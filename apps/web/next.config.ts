import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";
import { PRODUCT_PAGE_LOCALE, PRODUCT_PAGES, PRODUCT_ROOTS } from "./src/lib/site/product-roots";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const LOCALES = routing.locales.join("|");
const OTHER_LOCALES = routing.locales.filter((locale) => locale !== PRODUCT_PAGE_LOCALE).join("|");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Shaders live in `.glsl` files and ship minified; see tools/glsl-loader.cjs.
      "*.glsl": { loaders: ["./tools/glsl-loader.cjs"], as: "*.js" },
    },
  },
  // German and French were retired on 2026-09-27. Their old addresses move
  // to the same page in English for good. Config redirects run before the
  // proxy, so next-intl never sees these paths.
  async redirects() {
    return [
      { source: "/:retired(de|fr)", destination: "/en", permanent: true },
      { source: "/:retired(de|fr)/:path*", destination: "/en/:path*", permanent: true },
      // Short routes into our own products: /en/voyager, /hr/polis and so on
      // go to the product's root, which opens its About page. Temporary
      // (307), since a product may later get a page here; not in the sitemap.
      ...Object.entries(PRODUCT_ROOTS).map(([key, destination]) => ({
        source: `/:locale(${LOCALES})/${key}`,
        destination,
        permanent: false,
      })),
      // The pages of products not open yet are in English only: /hr/index,
      // /vec/patchbay and so on go to the English page. Temporary (307),
      // since they may be translated later.
      ...PRODUCT_PAGES.map((path) => ({
        source: `/:locale(${OTHER_LOCALES})${path}`,
        destination: `/${PRODUCT_PAGE_LOCALE}${path}`,
        permanent: false,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
