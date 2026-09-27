import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
    ];
  },
};

export default withNextIntl(nextConfig);
