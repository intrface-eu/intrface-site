/**
 * A first-line brake on the public contact action, before anything reaches
 * Prism or the owner's inbox.
 *
 * In memory, per server instance: on Vercel each instance keeps its own count,
 * so this stops a burst from one client, not a distributed flood. Prism keeps
 * its own durable limit (429) behind it. The client key is a hash of the
 * connection's address, held for the window and never stored or logged.
 * Retries of the same submission do not count again.
 */

export type RateLimitDecision = { ok: true } | { ok: false; retryAfterSeconds: number };

export type RateLimitOptions = {
  windowMs: number;
  /** Distinct submissions one client may send in the window. */
  perClient: number;
  /** Distinct submissions this instance accepts in the window, from everyone. */
  overall: number;
  now?: () => number;
};

export const CONTACT_RATE_LIMIT: RateLimitOptions = {
  windowMs: 10 * 60_000,
  perClient: 5,
  overall: 40,
};

type Entry = { at: number; client: string; submissionId: string };

export function createRateLimiter(options: RateLimitOptions) {
  const now = options.now ?? Date.now;
  let entries: Entry[] = [];

  return function check(client: string, submissionId: string): RateLimitDecision {
    const time = now();
    entries = entries.filter((entry) => time - entry.at < options.windowMs);

    // A retry of a submission already counted passes without counting again.
    if (entries.some((entry) => entry.submissionId === submissionId && entry.client === client)) {
      return { ok: true };
    }

    const mine = entries.filter((entry) => entry.client === client);
    const limited = mine.length >= options.perClient ? mine : entries.length >= options.overall ? entries : null;

    if (limited) {
      const oldest = limited[0].at;
      return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + options.windowMs - time) / 1000)) };
    }

    entries.push({ at: time, client, submissionId });
    return { ok: true };
  };
}

/** A short, non-reversible key for one client address. */
export async function clientKey(address: string): Promise<string> {
  const bytes = new TextEncoder().encode(`intrface-contact:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
