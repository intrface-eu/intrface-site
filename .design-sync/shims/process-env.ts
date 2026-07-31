/**
 * A `process.env` stand-in for the bundled design system.
 *
 * `@/lib/site/config` reads `process.env.NEXT_PUBLIC_SITE_URL`, which Next
 * replaces at build time. The design bundle is built by esbuild for a browser,
 * where `process` does not exist — the read throws while the bundle's own
 * modules are still evaluating, so every export is lost and `window.IntrfaceDS`
 * comes up empty.
 *
 * The design-system entry imports this first. ES modules evaluate their imports
 * in source order, so the global exists before any component module reads it.
 */
const runtime = globalThis as { process?: { env: Record<string, string | undefined> } };

if (!runtime.process) runtime.process = { env: {} };

export {};
