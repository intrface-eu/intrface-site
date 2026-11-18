import type { IntakeBudget, IntakeNeed, IntakeTiming } from "@/lib/site/intake";

/**
 * Prism inquiry intake (contract v1.1, owned by the Prism funnel-foundation
 * branch): one services inquiry, stored in the intrface workspace, with its
 * needs as the offer intent. Server-only; the browser never sees the URL or
 * the credentials.
 *
 *   POST {PRISM_INQUIRY_URL}  (https://prism-api.intrface.dev/api/v1/inquiries)
 *   Authorization: Bearer {PRISM_INQUIRY_TOKEN}      scope inquiries:ingest, bound to one workspace
 *   CF-Access-Client-Id / CF-Access-Client-Secret     Cloudflare Access service token
 *
 * 202 or 200 (`duplicate: true`) means stored. 429 carries `retryAfterSeconds`.
 * 5xx means nothing was stored and the same `submissionId` may be retried.
 * Every other answer means not stored, and the caller falls back to email.
 *
 * Off unless `PRISM_INQUIRY_ENABLED=1` and all four values are set, so the
 * site behaves exactly as before until the Prism side is live.
 */

export type PrismInquiry = {
  submissionId: string;
  needs: readonly IntakeNeed[];
  timing?: IntakeTiming;
  budget?: IntakeBudget;
  locale: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  sourcePath?: string;
};

export type PrismInquiryConfig = {
  url: string;
  token: string;
  accessClientId: string;
  accessClientSecret: string;
};

export type PrismInquiryResult =
  | { kind: "stored"; inquiryId: string; duplicate: boolean }
  | { kind: "rate_limited"; retryAfterSeconds: number }
  | { kind: "not_stored"; reason: string };

type Options = {
  fetch?: typeof fetch;
  /** Waits between attempts, in ms. One entry per retry. */
  backoff?: readonly number[];
  sleep?: (ms: number) => Promise<void>;
};

/** One retry: the action already waits on Resend after this. */
const BACKOFF = [400] as const;
const TIMEOUT_MS = 6_000;
const RETRY_AFTER_DEFAULT = 60;
const RETRY_AFTER_MAX = 3_600;

export function prismInquiryConfig(env: Record<string, string | undefined> = process.env): PrismInquiryConfig | null {
  if (env.PRISM_INQUIRY_ENABLED?.trim() !== "1") return null;

  const url = env.PRISM_INQUIRY_URL?.trim();
  const token = env.PRISM_INQUIRY_TOKEN?.trim();
  const accessClientId = env.PRISM_ACCESS_CLIENT_ID?.trim();
  const accessClientSecret = env.PRISM_ACCESS_CLIENT_SECRET?.trim();

  if (!url || !token || !accessClientId || !accessClientSecret || !url.startsWith("https://")) return null;
  return { url, token, accessClientId, accessClientSecret };
}

/** Only the contract's fields, optional ones left out when empty. */
export function inquiryBody(inquiry: PrismInquiry): Record<string, unknown> {
  return {
    submissionId: inquiry.submissionId,
    needs: [...new Set(inquiry.needs)],
    ...(inquiry.timing ? { timing: inquiry.timing } : {}),
    ...(inquiry.budget ? { budget: inquiry.budget } : {}),
    locale: inquiry.locale,
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
    ...(inquiry.company ? { company: inquiry.company } : {}),
    ...(inquiry.sourcePath ? { sourcePath: inquiry.sourcePath } : {}),
  };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfter(value: unknown): number {
  const seconds = typeof value === "number" && Number.isFinite(value) ? Math.ceil(value) : RETRY_AFTER_DEFAULT;
  return Math.min(Math.max(seconds, 1), RETRY_AFTER_MAX);
}

async function json(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function storeInquiry(
  config: PrismInquiryConfig,
  inquiry: PrismInquiry,
  options: Options = {},
): Promise<PrismInquiryResult> {
  const doFetch = options.fetch ?? fetch;
  const backoff = options.backoff ?? BACKOFF;
  const sleep = options.sleep ?? wait;
  const body = JSON.stringify(inquiryBody(inquiry));
  let reason = "";

  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    if (attempt > 0) await sleep(backoff[attempt - 1]);

    let response: Response;
    try {
      response = await doFetch(config.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "CF-Access-Client-Id": config.accessClientId,
          "CF-Access-Client-Secret": config.accessClientSecret,
          "Content-Type": "application/json",
        },
        body,
        // Cloudflare Access answers a bad service token with a login redirect.
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (caught) {
      reason = `network: ${caught instanceof Error ? caught.message : String(caught)}`;
      continue;
    }

    const data = await json(response);

    if ((response.status === 202 || response.status === 200) && data.ok === true && typeof data.inquiryId === "string") {
      return { kind: "stored", inquiryId: data.inquiryId, duplicate: data.duplicate === true };
    }

    if (response.status === 429) {
      return { kind: "rate_limited", retryAfterSeconds: retryAfter(data.retryAfterSeconds) };
    }

    reason = `Prism ${response.status}${typeof data.error === "string" ? ` ${data.error}` : ""}`;
    // 5xx stored nothing and the same id is safe to send again. Anything else
    // (400, 401, 403, 409, 413, a redirect, an unexpected 2xx) will not change.
    if (response.status < 500) break;
  }

  return { kind: "not_stored", reason };
}
