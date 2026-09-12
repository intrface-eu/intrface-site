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
};

export default withNextIntl(nextConfig);
