# Home contract (2026-09-27, revision 8: Italian as a fifth locale)

Owner decision, 2026-09-26 (late evening): "I want the apps to be a full
bento grid that covers the screen, include polis, and make it so the
gradient scrolls out of view and only then the bento grid scrolls."
Revision 4 stacked three whole screenshots in one column and lifted the
veil with a scroll-driven animation. Revision 5 puts four tiles, Polis
among them, in one bento that fills the screen, and pins it with CSS
sticky until the veil has gone. Screenshots now cover their cells and may
lose their bottom (and, in narrow cells, a side); the scroll-driven lift
and `--veil-rest` are removed. Later the same night the owner asked for
the grid to rise into place, then for a black page with the fade starting
after the first screen ("gives it more gravity"): home is now true black
down to the footer, and the veil is solid for a full viewport before it
fades.

Revision 6, the same night: the owner asked for a quieter grid, the
projects' logos on the cards, new Voyager and Polis captures, and two more
projects, AgroPulse and Patchbay (still in development). The bento now
holds six tiles in two rows of three, screenshots rest dimmed under a
mouse, and each caption starts with the project's own mark.

Revision 7, 2026-09-27: the site dropped German and French and runs in
four locales, in this order: English (`en`), Croatian (`hr`), Istroveneto
(`vec`, ISO 639-3 for Venetian) and Istrian Chakavian (`ckm`, ISO 639-3).
`/de/...` and `/fr/...` redirect permanently (308) to the same path under
`/en` (`redirects()` in `next.config.ts`, which runs before the proxy). The
home sentence now cycles through the four languages, and a link under it
switches the site to the language shown.

Revision 8, 2026-09-27: the owner added standard Italian (`it`, formal
register) as a fifth locale for business clients in Italy. The routing
order is en, hr, it, vec, ckm; an Italian browser reaches `/it` through
next-intl's Accept-Language detection. Italian stays out of the owner's
rotation (en, hr, vec, ckm), which is unchanged on those four pages; on
`/it` the Italian line comes first, then the rotation. `it` is ISO 639-1,
so it joins the hreflang alternates (en, hr, it, x-default); its
OpenGraph locale is `it_IT`, shared with `vec`.

## The sentence

`HomeGrid.common.claim` in each locale. English, verbatim:

> Reducing needless friction between intention, reality, and meaningful
> action.

Croatian: "Manje trenja između onoga što hoćeš, onoga što jest i onoga što
vrijedi napraviti." Italian, Istroveneto and Chakavian carry their own
lines in `it.json`, `vec.json` and `ckm.json`.

`Veil` (server) loads `claim` and `switchLocale` for each locale in the
page's cycle with `getTranslations({ locale, namespace: "HomeGrid.common" })`
and hands them, page locale first, to `ClaimCycle` (client,
`components/home/claim-cycle.tsx`).

- **Order.** The rotation is fixed: en, hr, vec, ckm, en..., starting from
  the page's own locale (on `/hr`: hr, vec, ckm, en). Italian is not in
  it: on `/it` the cycle is it, en, hr, vec, ckm, then it again (five
  lines); no other page shows the Italian line. `cycleOrder` in
  `components/home/veil.tsx` holds both rules. The server renders the page
  locale's line visible, so first paint has no flash and no shift.
- **One cell.** The `h1` is a grid; the page's lines (`.home-veil__line`,
  each with its `lang`; four, or five on `/it`) sit in one cell, so the
  block has the height of the tallest line in that page's cycle at every
  width and nothing below it moves. Assistive tech reads the page locale's
  line only: the others are `aria-hidden`.
- **Motion.** Each line holds 5s, then a 700ms cross-fade (opacity and a
  0.35rem rise, `cubic-bezier(0.33, 0, 0.2, 1)`): the old line rises out
  over the first 60%, the new one rises in over the last 75%. Opacity and
  transform only. The cycle pauses while the pointer (not touch) is over
  the sentence or link, while focus is inside, while the tab is hidden and
  while the block is off screen (IntersectionObserver). Each pause restarts
  the hold.
- **The link.** Under the sentence, `.home-veil__switch`: for each other
  locale a next-intl `Link` (`href="/"`, `locale`, `lang`, `hrefLang`) with
  that locale's `HomeGrid.common.switchLocale` ("Continue in English",
  "Nastavi na hrvatskom"; a locale without the key falls back to its
  endonym). All of them sit in one grid cell; only the one for the line
  shown is visible and focusable, and it fades with its line. The others
  are `aria-hidden`, `tabIndex={-1}` and `visibility: hidden`. While the
  page's own line shows, the slot is empty but keeps its height. Focusing
  the link pauses the cycle, so it never fades under focus. Style:
  `.type-caption` in `--ink-inverse-muted`, a 1px underline at half
  strength, `--ink-inverse` on hover, a 2px `--ink-inverse` focus ring at
  4px offset, 44px tall.
- **Reduced motion.** No cycle: the page's line stays, and the links to the
  other languages of its cycle (three; four on `/it`) sit in one row under it (wrapping on a phone), all
  visible and focusable. CSS lays this out from first paint; the client
  clears `aria-hidden` and `tabIndex` once it hydrates.

## Page structure

`HomePage`: `<main className="text-ink">` holding `.home-stage` (the veil
and the bento), then the footer from the layout. No header, no `Ground`.
The stage is `--black` (`#000`, a home-only token); other pages keep
paper.

1. **The stage.** `.home-stage` is `position: relative` and
   `100svh + --veil-height` tall. The bento is its only in-flow child.
2. **The veil.** `Veil`, `.home-veil`: absolute at the top of the stage,
   `--veil-height` tall (`100svh` + `--veil-fade`, 60svh), `z-index` above
   the bento, `--black` solid through the first `100svh`, then fading to
   nothing over `--veil-fade` with eased stops. At scroll 0 the screen is
   black with only the logo and the sentence. On it the logo (`MakerMark`) and the sentence
   (`.type-display`, `--ink-inverse`, the page's `h1`, in
   `.section-shell`, cycling through the four languages with its link
   under it; see The sentence). It scrolls away at page speed. Its solid
   band (`::before`, the first `100svh`), the mark and the sentence block
   take pointer events, the faded part does not. When a tile
   gets keyboard focus, the veil moves up out of the way
   (`.home-stage:has(.work-tile:focus-visible) .home-veil`,
   `translateY(-100%)`, a 240ms transition only under
   `prefers-reduced-motion: no-preference`).
3. **The bento.** `WorkTiles`, `.work-tiles`, a `<section>` labelled
   `HomeGrid.common.gridLabel`: `position: sticky; top: 0`, full viewport
   width (not in `.section-shell`), `100svh` tall, on `--black` with a gap
   and outer padding of `min(var(--grid-gap), 10px)`. It sits under the
   veil from the first frame, stays pinned for `--veil-height` of scroll,
   and moves up with the page once the veil's bottom has left.
4. **The footer.** Black on home only, by CSS alone:
   `body:has(.home-stage) .site-footer` redefines `--paper` (black),
   `--ink` (opaque `#ebebeb`), `--ink-muted`, `--line` and `--accent`
   (`#7cb8b1`) and sets `color-scheme: dark`. Other pages keep paper.

No JavaScript scroll handler. The pinning is ordinary sticky scrolling
and works the same in every browser. On top of it, the grid inside the
sticky section starts 12svh low and eases up to 0 over `--veil-height` of
scroll (CSS scroll-driven animation, transform only, behind `@supports
(animation-timeline: scroll())` and `prefers-reduced-motion:
no-preference`), so it lands as the veil leaves; without support, under
reduced motion, or with a tile focused, it sits at 0.

## The tiles

Six, in DOM order: Voyager, AgroPulse, Velum, Polis, AstyleMarine, Patchbay.

- **Grid.** From 1024px two equal rows on twelve columns, wide and narrow
  cells trading places: Voyager 5, AgroPulse 4, Velum 3, then Polis 3,
  AstyleMarine 5, Patchbay 4 (`data-span`). Below 1024px, 2 columns by 3
  rows of equal cells.
- **Links.** Five tiles are one `<a>` each (`target="_blank"`,
  `rel="noopener noreferrer"`), named "{name}: {line}, {Projects.newTab}".
  Voyager, Velum and AstyleMarine come from `PROJECTS` (live URL, captures,
  `Projects.<key>.role`). Polis and AgroPulse are defined in
  `work-tiles.tsx` only (other pages iterate `PROJECTS`). Polis links its
  public source, `https://github.com/basicalex/polis`, with `WorkPolis.name`
  and `WorkPolis.domain`. AgroPulse links `https://agropulse.intrface.eu`
  with `HomeGrid.projects.agropulse.line` ("The olive season in Istria,
  field by field.").
- **Patchbay is not a link.** It is not public yet: a plain `<div>` with
  its name and "Coming soon" (`WorkIndex.entries.patchbay.name` and
  `.status`) as text, no arrow, no hover, no description. Its address
  appears nowhere: not in code, text, alt, comments or commits. The status
  takes the arrow's place; below 768px it is read out but not shown. Its
  image has empty `alt`, since the caption names it.
- **Image.** `<picture>` with `next/image` props from `getImageProps`: the
  desktop capture (1440×1000) from 768px, the mobile capture (390×844)
  below. `object-fit: cover`, anchored to the top and to the side the
  site's headline sits on (`data-anchor`): Voyager and Patchbay centre,
  AgroPulse keeps its right-hand panel, the others their left edge.
  `sizes` follows the cell per span (the cell's vw where it fills by width,
  72vh from 1024px or 48vh below where it fills by height, 50vw for the
  mobile capture). All six load eagerly; Voyager alone gets
  `fetchPriority="high"`. `alt` is the name.
- **Quiet at rest.** Under `(hover: hover) and (pointer: fine)` a black
  layer at 50% sits over each screenshot (`.work-tile__picture::after`); a
  link tile's layer goes to 0 on hover or `:focus-visible`, over 200ms, with
  no transition under reduced motion. Patchbay stays dimmed. On touch
  screens there is no layer: full brightness, one tap opens the link.
- **Caption.** A black bar pinned over the bottom of the tile, one line:
  the project's logo (18px tall, `alt=""`), the name (`.type-caption`,
  `--ink-inverse`), the line (`--ink-inverse-muted`, from 1024px only,
  ending in an ellipsis when it does not fit) and `IconArrowUpRight`. From
  1024px the name never shrinks; the line gives way first.
- **Logos** (`public/proof/projects/<key>/logo.svg`), each the project's
  own mark in its own light or dark-scheme colours, geometry untouched:
  Voyager `apps/web/public/logo-icon-light.svg`; Velum the boat group
  (`.velum-mark`) of `videos/velum-opening-hours/assets/velum-logo-dark.svg`,
  viewBox cropped to it; AstyleMarine `public/favicon.svg` with its
  dark-scheme fills made the default; Polis
  `apps/web/public/brand/polis-app-icon.svg`; AgroPulse the `Mark`
  component (`apps/web/src/features/pulse/ui/Icons.tsx`) with its dark
  tokens; Patchbay `brand/assets/logo/patchbay-symbol-paper.svg`, viewBox
  cropped square around the symbol.
- **Captures** (1440×1000 and 390×844, DPR 1, top of the page, webp at
  `cwebp -q 80 -m 6`, 2026-09-26): Voyager from its production root, with
  the analytics banner declined (`voyager/desktop-2026-09-26.webp` and
  `mobile-2026-09-26.webp`, shared with the showcase; dated names so no
  image cache serves the old capture); AgroPulse from its production root after the
  map settled; Polis from `/` of a local run of the repo (the place map,
  Croatian, Astro's dev toolbar hidden); Patchbay from `/` of a local run
  of a copy of its working tree (the intro at the top of the landing).
- **Edge and state.** 1px border in paper at 16% (the bento sets
  `--line`); no radius or shadow. The focus ring is drawn inside the tile
  (paper with a black line inside it) so the grid does not clip it.

## Verification

Typecheck, `bunx eslint src`, `bunx next build`; headless QA on a
production build (port 3031) at 1440×900, 1024×768, 800×1000 and 390×844:
no console or page errors, no horizontal overflow, no `<header>`; five
tile links with the right href, target and rel, and no `<a>` in the
Patchbay tile; every caption on one line with no name cut, every logo
loaded; at 1440 the hovered Voyager tile's layer goes to 0 and Patchbay's
stays at 0.5; with touch emulation at 390 there is no layer; the bento box equals the
viewport at scroll 0; no tile pixel shows at scroll 0; its top is 0 until
scroll = veil height and negative after; the veil's bottom is ≤ 0 at the
veil height; the rise runs from 12svh to 0 over the same run; the mobile capture
below 768px, the desktop capture from 768px; Tab to the first tile at
scroll 0 moves the veil away; screenshots at 0, 50, 100 and 150svh, looked
at. `/en`, `/hr`, `/it`, `/vec`, `/ckm` return 200 with their `html lang` and
start with their own line; `/de`, `/de/about` and `/fr/work` redirect to
the `/en` equivalents; `/` with `Accept-Language: it` redirects to `/it`;
`/en/about` and `/en/work/polis` return 200; hreflang on `/en/about` lists
en, hr, it and x-default, not vec or ckm; the sitemap lists the `/it` URLs.
`grep -rn "veil-rest\|home-veil-lift" apps/web/src` returns nothing.

The sentence (revision 7), at 1440×900 and 390×844: the server-rendered
line (JavaScript off) is the page locale's, at the same block height as
after hydration; the lines advance in the fixed order with the matching
link visible and focusable and the others hidden; the block height does
not change across the cycle; hover, a focused link, a hidden tab and
scrolling the block off screen each hold the line; clicking the link while
the Istroveneto line shows lands on `/vec`; with reduced motion emulated
the line does not change and three links show (four on `/it`). On `/it`
the cycle runs it, en, hr, vec, ckm; on `/en` it runs en, hr, vec, ckm with
no Italian line. Screenshots of each line at both widths, looked at.
