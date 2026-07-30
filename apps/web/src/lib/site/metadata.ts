import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site/config";

/** OpenGraph locale codes for the four site languages. */
const OG_LOCALES: Record<AppLocale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  hr: "hr_HR",
};

/**
 * The generated share card, `app/[locale]/opengraph-image.tsx`. Declared here
 * because the route file cannot be the single source: a page that returns its
 * own `openGraph` object replaces the one the layout built, and the file-based
 * image goes with it — so every page has to name the card again.
 */
export const SHARE_CARD_ALT = "INTRFACE — IT consulting from Istria";
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

function shareCard(locale: AppLocale) {
  return [{ url: `/${locale}/opengraph-image`, ...SHARE_CARD_SIZE, alt: SHARE_CARD_ALT }];
}

/** Turns a locale-less path such as `/work/voyager` into `/hr/work/voyager`. */
export function localePath(locale: AppLocale, path: string): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path);
  }

  languages["x-default"] = localePath(routing.defaultLocale, path);

  return languages;
}

export type PageMetadataInput = {
  locale: AppLocale;
  /** Locale-less route path, e.g. `/work/polis`. */
  path: string;
  /** Page title without the site suffix — the root template appends it. */
  title: string;
  description: string;
};

/**
 * Per-page metadata with canonical URL and hreflang alternates for all locales.
 * Resolution against the site origin comes from `metadataBase` in the root layout.
 */
export function buildPageMetadata({ locale, path, title, description }: PageMetadataInput): Metadata {
  const url = localePath(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
      images: shareCard(locale),
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((value) => value !== locale).map((value) => OG_LOCALES[value]),
    },
  };
}
