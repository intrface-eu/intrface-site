import type { PrismInquiryResult } from "@/lib/site/prism-inquiry";

/**
 * Decides what one inquiry's attempt amounts to, given the store (Prism) and
 * the owner email (Resend). Kept apart from the server action so the rules can
 * be tested with plain functions:
 *
 * - Prism stored it: success, `capture: "prism"`, whatever the email does.
 * - Prism throttled it: the visitor is told to wait. No email, no alert, so a
 *   flood Prism refuses never turns into a flood in the owner's inbox.
 * - Prism off or not stored, email accepted: success, `capture: "email"`. The
 *   inquiry exists only as an email; nothing in Prism follows it up.
 * - Neither: the urgent Prism notify alert, and `failed` for the visitor.
 * - Neither configured: `unconfigured`, and the form hands over to mailto.
 */

export type MailResult = { ok: true } | { ok: false; error: string };

export type DeliveryOutcome =
  | { status: "sent"; capture: "prism"; inquiryId: string; duplicate: boolean; mailed: boolean }
  | { status: "sent"; capture: "email"; prism: "off" | string }
  | { status: "throttled"; retryAfterSeconds: number }
  | { status: "failed"; prism: "off" | string; mail: "off" | string }
  | { status: "unconfigured" };

export type DeliverySteps = {
  /** Null when Prism intake is off in this environment. */
  store: (() => Promise<PrismInquiryResult>) | null;
  /** Null when Resend is not configured. Gets a line saying where the inquiry is kept. */
  mail: ((storeLine: string) => Promise<MailResult>) | null;
  /** The operator alert when nothing took the inquiry. Must not throw. */
  alert: (error: string) => Promise<unknown>;
};

export async function deliverInquiry({ store, mail, alert }: DeliverySteps): Promise<DeliveryOutcome> {
  const stored = store ? await store() : null;

  if (stored?.kind === "rate_limited") {
    return { status: "throttled", retryAfterSeconds: stored.retryAfterSeconds };
  }

  const prism = stored === null ? "off" : stored.kind === "stored" ? null : stored.reason;

  if (!mail) {
    if (stored?.kind === "stored") {
      return { status: "sent", capture: "prism", inquiryId: stored.inquiryId, duplicate: stored.duplicate, mailed: false };
    }
    if (stored === null) return { status: "unconfigured" };
    await alert(`Prism did not store the inquiry (${prism}) and no email transport is configured`);
    return { status: "failed", prism: prism ?? "off", mail: "off" };
  }

  // The same on every attempt of one submission: the email goes out under the
  // submission's Idempotency-Key, and Resend refuses a reused key whose
  // content changed. So no error text and no "repeat" note here.
  const storeLine =
    stored?.kind === "stored"
      ? `Prism: stored as ${stored.inquiryId}`
      : stored === null
        ? "Prism: intake off; this email is the only copy"
        : "Prism: NOT stored; this email is the only copy";

  const sent = await mail(storeLine);

  if (stored?.kind === "stored") {
    return { status: "sent", capture: "prism", inquiryId: stored.inquiryId, duplicate: stored.duplicate, mailed: sent.ok };
  }

  if (sent.ok) return { status: "sent", capture: "email", prism: prism ?? "off" };

  await alert([prism && prism !== "off" ? `Prism: ${prism}` : null, `Resend: ${sent.error}`].filter(Boolean).join("; "));
  return { status: "failed", prism: prism ?? "off", mail: sent.error };
}
