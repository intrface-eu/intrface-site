export const SITE_NAME = "INTRFACE";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://intrface.eu").replace(/\/$/, "");

export const SITE_TAGLINE = "Software for complex real-world systems.";

export const SITE_DESCRIPTION =
  "INTRFACE builds software with an industrialized, open-source AI-agent delivery system: live client sites, deep platforms, and the delivery system itself.";

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
