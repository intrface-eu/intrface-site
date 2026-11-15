import { isIntakeNeed } from "@/lib/site/intake";

/**
 * What ties one inquiry together across retries, and where it came from.
 *
 * The form makes a submission id when the visitor first sends and keeps it
 * while the entry stays the same, so a retry after an error, or a second press
 * after a lost response, carries the same id. Prism treats it as the
 * idempotency key and Resend gets it as its `Idempotency-Key`. Editing the
 * entry makes a new one: it is a different message.
 */

const SUBMISSION_ID = /^[A-Za-z0-9_-]{8,80}$/;

export function isSubmissionId(value: unknown): value is string {
  return typeof value === "string" && SUBMISSION_ID.test(value);
}

export function newSubmissionId(): string {
  return `web-${crypto.randomUUID()}`;
}

/**
 * The submission id for this entry: the previous one when nothing changed
 * since the last attempt, a fresh one otherwise. `fingerprint` is any stable
 * string of the entry's values.
 */
export function submissionIdFor(
  previous: { id: string; fingerprint: string } | null,
  fingerprint: string,
  make: () => string = newSubmissionId,
): { id: string; fingerprint: string } {
  return previous && previous.fingerprint === fingerprint ? previous : { id: make(), fingerprint };
}

const SOURCE_PATH_LIMIT = 300;

/**
 * The page the form was on, as a path with only a valid `?need=` kept.
 *
 * Anything else in the query (campaign tags, ids) and the hash are dropped, so
 * nothing about the visit beyond the page and the offer it asked for leaves
 * the site. Returns "" when the value is not a same-site path.
 */
export function sourcePathFrom(value: string): string {
  const raw = value.trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "";

  let url: URL;
  try {
    url = new URL(raw, "https://intrface.invalid");
  } catch {
    return "";
  }
  if (url.origin !== "https://intrface.invalid") return "";

  const need = url.searchParams.get("need");
  const path = isIntakeNeed(need) ? `${url.pathname}?need=${need}` : url.pathname;
  return path.length <= SOURCE_PATH_LIMIT ? path : "";
}
