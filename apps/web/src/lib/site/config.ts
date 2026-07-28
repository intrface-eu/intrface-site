export const SITE_NAME = "INTRFACE";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://intrface.eu").replace(/\/$/, "");

// Kept character-for-character identical to the Metadata namespace in
// messages/en.json — one canonical sentence per fact, reused rather than
// paraphrased. Change both or neither.
export const SITE_TAGLINE = "IT consulting from Istria. Our own tooling is public under Apache-2.0.";

export const SITE_DESCRIPTION =
  "INTRFACE is an IT consultancy in Istria. Client software, plus Voyager, Polis and Funda of our own. Agent Ops Cockpit, the tooling behind them, is public: Apache-2.0, 403 commits.";

export const CONTACT_EMAIL = "hello@intrface.eu";

export const AOC_REPO_URL = "https://github.com/basicalex/agent-ops-cockpit";

export const POLIS_REPO_URL = "https://github.com/basicalex/polis";

/** Every locale-prefixed route on the site. Sitemap, hreflang, and nav read from here. */
export const SITE_PATHS = [
  "/",
  "/work",
  "/work/voyager",
  "/work/polis",
  "/work/funda",
  "/work/client-sites",
  "/method",
  "/about",
  "/imprint",
] as const;

export type SitePath = (typeof SITE_PATHS)[number];
