export const SITE_NAME = "INTRFACE";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://intrface.eu").replace(/\/$/, "");

// Kept character-for-character identical to the Metadata namespace in
// messages/en.json — one canonical sentence per fact, reused rather than
// paraphrased. Change both or neither.
export const SITE_TAGLINE = "Interfaces for the world.";

export const SITE_DESCRIPTION =
  "INTRFACE builds interfaces for the world from Vrsar, Istria: Voyager, Polis, Funda, MidiFlow and Patchbay of our own, and sites for businesses across the EU.";

export const CONTACT_EMAIL = "hello@intrface.eu";

// Two forms of one number: the spaced form is what a reader sees, the compact
// E.164 form is what a `tel:` href needs. Every surface reads from these — no
// phone number is typed into a component or a message file.
export const CONTACT_PHONE_DISPLAY = "+385 99 190 5899";

export const CONTACT_PHONE_TEL = "+385991905899";

export const AOC_REPO_URL = "https://github.com/basicalex/agent-ops-cockpit";

/** Every locale-prefixed route on the site. Sitemap, hreflang, and nav read from here. */
export const SITE_PATHS = [
  "/",
  "/work",
  "/work/velum",
  "/work/voyager",
  "/work/astyle-marine",
  "/work/polis",
  "/work/funda",
  "/work/client-sites",
  "/about",
  "/imprint",
] as const;

export type SitePath = (typeof SITE_PATHS)[number];
