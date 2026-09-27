import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_PATHS, SITE_URL } from "@/lib/site/config";
import { HREFLANG_LOCALES, localePath } from "@/lib/site/metadata";

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path === "/work") return 0.9;
  if (path === "/imprint") return 0.2;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITE_PATHS.flatMap((path) => {
    // Every locale gets its own entry; the alternates name only the locales
    // Google accepts in hreflang (see `HREFLANG_LOCALES`), as the pages do.
    const languages: Record<string, string> = {};

    for (const locale of HREFLANG_LOCALES) {
      languages[locale] = `${SITE_URL}${localePath(locale, path)}`;
    }

    languages["x-default"] = `${SITE_URL}${localePath(routing.defaultLocale, path)}`;

    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: priorityFor(path),
      alternates: { languages },
    }));
  });
}
