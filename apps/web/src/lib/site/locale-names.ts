import type { AppLocale } from "@/i18n/routing";

/**
 * Each site language by its own name. Endonyms are not translated: a reader
 * looks for their language as they write it, whatever the page is in.
 */
export const LOCALE_ENDONYMS: Record<AppLocale, string> = {
  en: "English",
  hr: "Hrvatski",
  it: "Italiano",
  vec: "Istrovèneto",
  ckm: "Čakavski",
};
