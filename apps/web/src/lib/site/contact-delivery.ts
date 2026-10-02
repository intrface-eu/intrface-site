/**
 * Resend delivery for one contact submission, with retry and an operator alert.
 *
 * Production has no store behind the form, so a send that fails here is gone
 * unless someone hears about it. Transient failures (network, 429, 5xx) retry
 * under one Idempotency-Key, so a retry never sends twice. When every attempt
 * fails, the whole submission goes to Prism (`/api/v1/notify`) as an alert, and
 * the visitor still gets the mailto fallback.
 *
 * Environment:
 *   PRISM_NOTIFY_URL    full notify endpoint, e.g. https://prism.intrface.eu/api/v1/notify
 *   PRISM_NOTIFY_TOKEN  Prism API token with scope notify:send
 * Without both, the alert is skipped and only logged.
 */

export type ContactMail = {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  topic: string;
  company: string;
  locale: string;
  message: string;
};

type Fetch = typeof fetch;

type Options = {
  fetch?: Fetch;
  /** Waits between attempts, in ms. One entry per retry. */
  backoff?: readonly number[];
  sleep?: (ms: number) => Promise<void>;
};

const BACKOFF = [500, 1500] as const;

/** Prism caps title and body at 4000 characters. */
const ALERT_LIMIT = 4000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryable(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function sendContactMail(
  mail: ContactMail,
  options: Options = {},
): Promise<{ ok: true } | { ok: false; error: string }> {
  const doFetch = options.fetch ?? fetch;
  const backoff = options.backoff ?? BACKOFF;
  const sleep = options.sleep ?? wait;
  const idempotencyKey = crypto.randomUUID();
  let error = "";

  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    if (attempt > 0) await sleep(backoff[attempt - 1]);

    try {
      const response = await doFetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mail.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          from: mail.from,
          to: [mail.to],
          reply_to: mail.replyTo,
          subject: mail.subject,
          text: mail.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (response.ok) return { ok: true };

      error = `Resend ${response.status}: ${await response.text()}`;
      if (!retryable(response.status)) break;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }
  }

  return { ok: false, error };
}

/** Never throws: a failed alert must not change what the visitor sees. */
export async function alertDeliveryFailure(
  submission: ContactSubmission,
  error: string,
  options: Pick<Options, "fetch"> = {},
): Promise<boolean> {
  const url = process.env.PRISM_NOTIFY_URL?.trim();
  const token = process.env.PRISM_NOTIFY_TOKEN?.trim();

  if (!url || !token) {
    console.error("[contact] Delivery failed and no Prism alert is configured", error);
    return false;
  }

  const body = [
    `From: ${submission.name} <${submission.email}>`,
    submission.company ? `Company: ${submission.company}` : null,
    submission.topic ? `Topic: ${submission.topic}` : null,
    `Locale: ${submission.locale}`,
    `Error: ${error}`,
    "",
    submission.message,
  ]
    .filter((line) => line !== null)
    .join("\n")
    .slice(0, ALERT_LIMIT);

  try {
    const response = await (options.fetch ?? fetch)(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "intrface-site",
        kind: "alert",
        severity: "urgent",
        title: `Contact form not delivered: ${submission.name}`.slice(0, ALERT_LIMIT),
        body,
        dedupeKey: `intrface-site:contact:${crypto.randomUUID()}`,
      }),
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      console.error("[contact] Prism alert failed", response.status, await response.text());
      return false;
    }
    return true;
  } catch (caught) {
    console.error("[contact] Prism alert failed", caught);
    return false;
  }
}
