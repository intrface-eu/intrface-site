import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hr", "vec", "ckm"],
  defaultLocale: "en",
  localePrefix: "always",
  // No hreflang `Link` header from the proxy: it would name every locale,
  // and Google accepts only ISO 639-1 codes there. Page metadata carries the
  // alternates instead (see `HREFLANG_LOCALES` in lib/site/metadata.ts).
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];
