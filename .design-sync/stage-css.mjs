/**
 * Stage the app's compiled CSS and its self-hosted fonts for the design sync.
 *
 * The site has no library build — its stylesheet only exists as Next's compiled
 * output — so the sync reads that. Three things happen here that the converter
 * cannot do for itself:
 *
 *   1. The font files are renamed. next/font emits hashes containing `~` and
 *      other characters the design API rejects as reserved paths; the CSS is
 *      rewritten to match.
 *   2. The font variables are bound at :root. Next binds them to <html> from
 *      its font loader, so outside the app every type role would fall back to
 *      a system face.
 *   3. Everything lands inside apps/web, because the converter refuses config
 *      paths that resolve outside the package.
 *
 * Run `bun run build:web` first — this reads that build's output.
 * Usage: node .design-sync/stage-css.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const NEXT = 'apps/web/.next/static';
const OUT = 'apps/web/.ds-css';

const chunks = join(NEXT, 'chunks');
if (!existsSync(chunks)) {
  console.error(`[STAGE] ${chunks} missing — run the app build first (bun run build:web).`);
  process.exit(1);
}

const css = readdirSync(chunks)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ f, size: statSync(join(chunks, f)).size }))
  .sort((a, b) => b.size - a.size)[0];
if (!css) {
  console.error('[STAGE] no compiled stylesheet in the build output.');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'chunks'), { recursive: true });
mkdirSync(join(OUT, 'media'), { recursive: true });

// Only what a path may safely carry: the API rejects the rest as reserved.
const safe = (name) => name.replace(/[^A-Za-z0-9._-]/g, '-');

const media = join(NEXT, 'media');
const renamed = new Map();
for (const f of existsSync(media) ? readdirSync(media) : []) {
  if (!/\.(woff2?|ttf|otf)$/.test(f)) continue;
  let to = safe(f);
  for (let i = 2; [...renamed.values()].includes(to); i++) to = safe(f).replace(/\.woff2$/, `-${i}.woff2`);
  renamed.set(f, to);
  copyFileSync(join(media, f), join(OUT, 'media', to));
}

let text = readFileSync(join(chunks, css.f), 'utf8');
for (const [from, to] of renamed) if (from !== to) text = text.split(from).join(to);

text += `

/* --- design-sync ---------------------------------------------------------
 * Next binds these variables to <html> from its font loader, so nothing
 * outside the app sets them and every type role falls back to a system face.
 * The families are the ones the @font-face rules above define. */
:root {
  --font-google-sans-flex: "Google Sans Flex", "Google Sans Flex Fallback";
  --font-geist-mono: "Geist Mono", "Geist Mono Fallback";
}
`;

writeFileSync(join(OUT, 'chunks', 'app.css'), text);
const dirty = [...renamed].filter(([from, to]) => from !== to).length;
console.error(`[STAGE] ${css.f} → ${OUT}/chunks/app.css (${(text.length / 1024) | 0} KB)`);
console.error(`[STAGE] ${renamed.size} font file(s) → ${OUT}/media/ (${dirty} renamed for path safety)`);
