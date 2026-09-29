/**
 * The root of each open product that runs on its own subdomain. Each root
 * sends the visitor on to the product's About page, so a home tile or a
 * short route (`/<locale>/<key>`) opens the product itself, in the same tab.
 * Products not open yet (Index, Patchbay) have their page on this site
 * instead and are not listed here.
 * next.config.ts reads this file for its redirects; keep it free of
 * imports so the config can load it.
 */
export const PRODUCT_ROOTS = {
  voyager: "https://voyager.intrface.eu/",
  polis: "https://polis.intrface.eu/",
  agropulse: "https://agropulse.intrface.eu/",
} as const;

export type ProductRootKey = keyof typeof PRODUCT_ROOTS;

/**
 * Pages hosted here for products not open yet. They are in English only
 * (the other locales are for INTRFACE's own pages): home tiles in every
 * locale link to `/en/<page>`, the other locales redirect there (307), and
 * the sitemap lists the English page alone, with no hreflang alternates.
 */
export const PRODUCT_PAGES = ["/index", "/patchbay"] as const;
export const PRODUCT_PAGE_LOCALE = "en";
