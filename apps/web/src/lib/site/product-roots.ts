/**
 * The root of each open product of ours, in the order home and /work show
 * them. Each root opens the product itself (most send the visitor on to
 * their About page), so a row on home or a short route (`/<locale>/<key>`)
 * opens the product in the same tab. Index, not open yet, has its page on
 * this site instead and is not listed here; neither is Funda.
 * next.config.ts reads this file for its redirects; keep it free of
 * imports so the config can load it.
 */
export const PRODUCT_ROOTS = {
  voyager: "https://voyager.intrface.eu/",
  agropulse: "https://agropulse.intrface.eu/",
  radio: "https://radio.intrface.eu/",
  patchbay: "https://patchbay.city/",
  polis: "https://polis.intrface.eu/",
  midiflow: "https://midiflow.app/",
} as const;

export type ProductRootKey = keyof typeof PRODUCT_ROOTS;

/**
 * Pages hosted here for products not open yet. They are in English only
 * (the other locales are for INTRFACE's own pages): links in every locale
 * go to `/en/<page>`, the other locales redirect there (307), and the
 * sitemap lists the English page alone, with no hreflang alternates.
 * A path here must not share a key with `PRODUCT_ROOTS`.
 */
export const PRODUCT_PAGES = ["/index"] as const;
export const PRODUCT_PAGE_LOCALE = "en";
