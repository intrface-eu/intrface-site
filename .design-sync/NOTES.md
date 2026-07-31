# design-sync notes — intrface-site

This repo is not shaped like a design-system repo, and most of what follows is
the consequence of that. `packages/ui` is an empty scaffold; the components live
in the Next app at `apps/web/src/components`.

## How this repo syncs

- **The entry is `apps/web/design-sync-entry.tsx`, committed.** It names the 24
  prop-driven components. It lives inside `apps/web` rather than under
  `.design-sync/` because the converter takes the package identity from the
  nearest `package.json` above the entry — from the repo root it synced the
  workspace and reported version 0.0.0, with no `src/` match, so every group
  came out `general` and no JSDoc was picked up.
- **Config paths are resolved from the package dir (`apps/web`), not the repo
  root.** `cssEntry` is additionally bounded to inside the package — a path that
  climbs out is silently skipped with `! cssEntry: … resolves outside`.
- **Run order for a re-sync:**
  1. `bun install --frozen-lockfile`
  2. `bun run build:web` — the stylesheet only exists as Next's compiled output
  3. `node .design-sync/stage-css.mjs` — see below
  4. `node .ds-sync/lib/…` type emit: `node node_modules/ts7/bin/tsc --project
     .design-sync/tsconfig.types.json`, then rewrite the emitted `@/` specifiers
     to relative paths (the loop at the end of this file explains why)
  5. `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules
     ./apps/web/node_modules --entry apps/web/design-sync-entry.tsx --out
     ./ds-bundle --remote .design-sync/.cache/remote-sync.json`

## Why each piece of scaffolding exists

- **`.design-sync/stage-css.mjs`** — copies the compiled stylesheet and the
  self-hosted fonts into `apps/web/.ds-css/` (gitignored). It also does two
  things that are not cosmetic: it renames font files (next/font emits hashes
  containing `~`, and the design API rejects those paths as reserved — one file
  failed upload with `permission_denied … reserved (CLAUDE.md or .claude/)`
  purely because of its name), and it appends a `:root` block binding
  `--font-google-sans-flex` and `--font-geist-mono`. Next binds those variables
  to `<html>` from its font loader, so without the block every type role falls
  back to a system face and the whole system renders in the wrong typeface.
- **`.design-sync/shims/`** — `next/image` and `@/i18n/navigation` are mapped to
  plain `<img>` / `<a>` stand-ins via `.design-sync/tsconfig.sync.json`. The real
  modules need the Next image loader and a locale request. **Rule order matters
  in that file:** the exact `@/i18n/navigation` entry must come before the `@/*`
  wildcard, or the wildcard resolves first and the real module comes back.
- **`.design-sync/shims/process-env.ts`** — imported first by the entry.
  `@/lib/site/config` reads `process.env.NEXT_PUBLIC_SITE_URL`; in a browser
  bundle that throws while the modules evaluate, and `window.IntrfaceDS` ends up
  empty with every preview failing `[BUNDLE_EXPORT]`.
- **`.design-sync/tsconfig.types.json`** — the app never emits declarations, so
  the converter had no `.d.ts` tree and every contract came out
  `[key: string]: unknown` — useless to the design agent. This emits real ones.
  Two gotchas: `ts7` errors on `baseUrl` (it still emits), and the emitted files
  keep `@/…` specifiers that the converter's type project cannot resolve, so
  they must be rewritten to relative paths before the build.

## Known render warns (checked on every re-sync)

- `[FONT_MISSING] "Inter", "Google Sans Flex Fallback"` — accepted. Inter is only
  a fallback in the brand stack and the Fallback family is next/font's metric
  adjuster; the real faces ship as woff2 in `fonts/`.
- `[CSS_RUNTIME]` fires when `cssEntry` is missing — it means the staging step
  was skipped, not that the DS is CSS-in-JS.

## Deliberate floor cards

- **`MobileNav`** — its toggle is `lg:hidden`, so at card width it renders
  nothing. A viewport override did not survive the render check; left as the
  floor card rather than faked.
- **`LiveSiteRow`** — builds `/proof/sites/<slug>-desktop.png` itself, and those
  captures are not in the bundle, so the card would show broken images. Fix by
  shipping the captures under a path the upload plan allows, then author it.

Excluded on purpose: `OrganizationJsonLd` (renders a `<script>`, nothing visual)
and `PaperShaderSurface` (dead code since the contact-band shader was removed).

## Re-sync risks

- **The staged CSS is a build artifact.** If `bun run build:web` has not run
  since the last source change, the sync ships a stale stylesheet. Always
  rebuild first.
- **Font hashes change on every Next build**, so `fonts/` churns and the old
  names must be deleted remotely — the driver's `deletePaths` handles it as long
  as the anchor is fetched first.
- **The preview build must never import an icon barrel.** A preview importing
  `@tabler/icons-react` took over 10 minutes and had to be killed; with a bare
  inline SVG the same rebuild is 0.4s. Components importing icons by name are
  fine — this is a preview-authoring rule only.
- **`apps/web/package.json` carries a `types` field** pointing at the emitted
  declarations. It is only for this sync; nothing else in the repo reads it.
- The 19 next-intl-bound components (page shells, header, footer, contact form,
  `HonestNote`) are out of scope by construction. If any of them ever takes its
  copy from props, it becomes syncable.
