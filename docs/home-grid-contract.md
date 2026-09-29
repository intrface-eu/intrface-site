# Home contract (2026-09-29, revision 10: our own products)

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

Revision 9, 2026-09-28: the owner asked for "an animated text where each
letter animates the switch", shorter holds, a pause on the line shown while
hovered, carousel arrows left and right of the sentence that switch on
command, and a swipe on phones. The 700ms cross-fade is gone: the sentence
is split into letters that leave and arrive with a stagger on the Web
Animations API (anime.js `waapi`), each line holds 3s, and arrows, the Left
and Right keys and a horizontal swipe move through the lines by hand.

Revision 10, 2026-09-29: the owner made the grid a way into our own
products. It holds five tiles, in this order: Voyager, Index, Polis,
AgroPulse, Patchbay. Velum and AstyleMarine left the grid only; their
pages under `/work` stay, as does every entry in `PROJECTS`. Each product
keeps its About page itself and its root redirects there, so a tile opens
the product root in the same tab: entering the interface, not leaving the
site. The new-tab arrow and "opens in a new tab" are gone from the tiles.
Patchbay became a link to a minimal About page on this site,
`/<locale>/patchbay`, and keeps "Coming soon" in its caption. Short routes
`/<locale>/voyager`, `/<locale>/polis` and `/<locale>/agropulse` redirect
(307) to the product roots. Later the same day the owner ruled Index a
coming-soon product: nothing links to its own address. Its About page,
"What is Index?", is hosted here at `/<locale>/index` until it ships, and
its tile opens that page and says "Coming soon", like Patchbay's. On
phones the coming-soon tiles drop the arrow and show the status, on a
second caption line when it does not fit beside the name. Last, the owner
made both pages English only: the other locales are for INTRFACE's own
pages. `/<hr|it|vec|ckm>/index` and `/…/patchbay` redirect (307) to
`/en/index` and `/en/patchbay`; tiles in every locale link straight to the
English pages; their captions stay translated.

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
  width and nothing below it moves. A line shows while it carries
  `data-live`; the server sets it on the page locale's line, so first paint
  is the settled page line with no flash and no shift. Assistive tech reads
  the page locale's line only, from a visually hidden copy (`.sr-only`) at
  the head of the `h1`; every line of letters is `aria-hidden` and the
  animation never touches the copy.
- **Letters.** Each line is words (`.home-veil__word`, inline-block,
  `white-space: nowrap`, joined by ordinary spaces) of letters
  (`.home-veil__char`, inline-block), so lines wrap at word boundaries as
  the plain text does and a word never breaks. A letter in its own
  inline-block loses the font's kerning with its neighbour (`font-kerning`
  cannot reach across the boundary: the split text set 0.4 to 0.8% wider,
  the period drifting off "far." and "fare."). `KERNING` in
  `claim-cycle.tsx` puts it back: the pairs in the five lines that Google
  Sans Flex 600 kerns by 0.004em or more ("r." −0.096em, "y," −0.064em,
  "’è" −0.063em, "xe", "av", "ov", "vo", "fa", "Re" and others), measured in
  Chromium and applied as `margin-inline-end` in em on the first letter,
  server-rendered. The split then sets within about 1px of the plain text
  per line. A pair missing from the table sets unkerned; if a line
  changes, measure its new pairs. Wrapping (`text-wrap: balance`) matches
  the plain text at every width from 320 to 1440px except English between
  360 and 392px, where the balance picks "Reducing needless / friction
  between" over "Reducing / needless friction / between intention,"; five
  rows either way, same height.
- **Motion.** A switch moves the letters, opacity and transform only
  (`waapi.animate`, one Web Animation per letter and property, `stagger`
  for the delays; no filter, no blur). Forward, the old line's letters
  leave up and to the left (`translate3d(-0.08em, -0.3em, 0)`), first to
  last over a 240ms spread, each fading in 260ms
  (`cubic-bezier(0.4, 0, 0.6, 1)`) and moving in 380ms
  (`cubic-bezier(0.5, 0, 0.75, 0)`, accelerating away). The new line's
  letters start 360ms in, over the same spread, from below and to the
  right, each fading up in 420ms and settling in 560ms
  (`cubic-bezier(0.22, 1, 0.36, 1)`, no overshoot). Back, the offsets flip
  and the spread runs last to first. The two waves overlap in time but a
  place is clear before its new letter arrives. The switch takes 1.16s;
  then the line holds 3s. A switch asked for mid-flight stops every letter
  where it is and retargets from there: every other line still showing
  leaves, the target arrives, so rapid clicks never stack and end on the
  right line with no letter left half-shown.
- **Pauses.** The cycle pauses while a mouse (not touch) is over the
  sentence block, on the line shown; a switch already in flight lands
  first. It pauses with keyboard focus inside (a button focused by a mouse
  click does not count, so leaving resumes), while the tab is hidden and
  while the block is off screen (IntersectionObserver). Leaving, a swipe, a
  click or a key starts a full switch-and-hold again.
- **Arrows.** Two `<button>`s, previous and next
  (`HomeGrid.common.prevLanguage` / `nextLanguage` in the page's language:
  "Previous language" / "Next language", "Prethodni jezik" / "Sljedeći
  jezik", "Lingua precedente" / "Lingua successiva", "Lingua de prima" /
  "Prossima lingua", "Prošli jazik" / "Idući jazik"), 44px circles with
  `IconArrowLeft` / `IconArrowRight`. They switch in their direction,
  wrapping round the cycle. They fade in (240ms) under a mouse over the
  block (`(hover: hover) and (pointer: fine)`) or with keyboard focus inside
  (`:has(:focus-visible)`), vertically centred on the sentence. From
  1400px they flank it: the shell's gutter there is at least 100px, so the
  previous arrow sits in it, 24px from the text. From 640 to 1399px the
  gutter is 40px or less, so both sit together 24px right of the `h1`
  (which is 20ch wide, leaving room at every width). Below 640px (a mouse
  on a narrow window, a keyboard on a phone) they sit at the end of the
  link row. With a mouse they take the pointer even while faded, and the
  space between them and the text is part of the block, so reaching for
  them keeps the hover. Touch screens show none.
- **Keys and swipe.** With focus inside the block, Left and Right switch
  back and forward. On touch, the block has `touch-action: pan-y`: a
  horizontal swipe of 40px or more that is more horizontal than vertical
  switches (left: forward, right: back); vertical movement scrolls the
  page. A swipe ending on the link does not follow it; a tap does.
- **Announcements.** The automatic cycle is silent. A switch made by hand
  puts the new line, with its `lang`, in a visually hidden
  `aria-live="polite"` paragraph.
- **The link.** Under the sentence, `.home-veil__switch`: for each other
  locale a next-intl `Link` (`href="/"`, `locale`, `lang`, `hrefLang`) with
  that locale's `HomeGrid.common.switchLocale` ("Continue in English",
  "Nastavi na hrvatskom"; a locale without the key falls back to its
  endonym). All of them sit in one grid cell; only the one for the line
  shown is visible and focusable, and it fades with its line: out over
  400ms as the old letters leave, in over 640ms from 360ms, as the new
  letters arrive (CSS transitions on `data-state`). The others
  are `aria-hidden`, `tabIndex={-1}` and `visibility: hidden`. While the
  page's own line shows, the slot is empty but keeps its height. Focusing
  the link pauses the cycle, so it never fades under focus. Style:
  `.type-caption` in `--ink-inverse-muted`, a 1px underline at half
  strength, `--ink-inverse` on hover, a 2px `--ink-inverse` focus ring at
  4px offset, 44px tall.
- **Reduced motion.** No cycle: the page's line stays, and the links to the
  other languages of its cycle (three; four on `/it`) sit in one row under it (wrapping on a phone), all
  visible and focusable. CSS lays this out from first paint; the client
  clears `aria-hidden` and `tabIndex` once it hydrates. No letter motion, no
  arrows (`display: none`), and the keys and swipe do nothing.

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

Five, one per product of our own, in DOM order: Voyager, Index, Polis,
AgroPulse, Patchbay. Velum and AstyleMarine are client work and are not on
the grid; `PROJECTS` keeps them for `/work`.

- **Grid.** From 1024px two equal rows on twelve columns: Voyager 7 and
  Index 5, then Polis, AgroPulse and Patchbay 4 each (`data-span`), so the
  seams of the two rows never meet. Below 1024px, 2 columns by 3 equal
  rows: Voyager (`data-lead`) takes the whole top row, the other four sit
  two by two under it. Voyager is the largest cell at every width. A tall
  Voyager cell on a phone was tried and dropped: filled by height, it cut
  both ends off the capture's centred headline.
- **Links.** Every tile is one link, in the same tab (no `target`, no
  `rel`), named "{name}: {line}", with ", {status}" after it on a
  coming-soon tile ("{name}: {status}" for Patchbay, which has no line).
  The open products' roots live in `PRODUCT_ROOTS`
  (`lib/site/product-roots.ts`), which the short routes read too: Voyager
  `https://voyager.intrface.eu/` with `Projects.voyager.role` and the
  captures from `PROJECTS.voyager`; Polis `https://polis.intrface.eu/`
  with `WorkPolis.name` and `WorkPolis.domain`; AgroPulse
  `https://agropulse.intrface.eu/` with `HomeGrid.projects.agropulse.line`.
  Each root opens the product's own About page. The two products not open
  yet (`data-soon`) are next-intl `Link`s to their English page on this
  site, in every locale (`locale` and `hrefLang` from
  `PRODUCT_PAGE_LOCALE`, so no redirect hop): Index to `/en/index` (see The
  Index page) with `HomeGrid.projects.index.line` ("The things you save,
  read, filed and connected.") and `HomeGrid.projects.index.status`;
  Patchbay to `/en/patchbay` (see The Patchbay page) with
  `WorkIndex.entries.patchbay.name` and `.status`. These caption strings
  are translated in all five locales.
- **Addresses of products not open yet.** Patchbay's appears nowhere: not
  in code, text, alt, comments or commits. Index's own address is linked
  from no page or tile.
- **Image.** `<picture>` with `next/image` props from `getImageProps`: the
  desktop capture (1440×1000) from 768px, the mobile capture (390×844)
  below. `object-fit: cover`, anchored to the top and to the side the
  page's headline sits on (`data-anchor`): Voyager and Patchbay
  centre, Index, Polis and AgroPulse keep their left edge.
  `sizes` follows the cell: from 1024px a span of n columns is n/12 of the
  viewport wide where it fills by width (from an aspect ratio of 8.64/n:
  59vw, 42vw, 34vw) and 72vh where it fills by height; from 768 to 1023px
  Voyager is 100vw from 12/25 and the others 50vw from 24/25, else 48vh;
  below 768px the mobile capture always fills by width, 100vw for Voyager
  and 50vw for the rest. All five load eagerly; Voyager alone gets
  `fetchPriority="high"`. `alt` is the name.
- **Quiet at rest.** Under `(hover: hover) and (pointer: fine)` a black
  layer at 50% sits over each screenshot (`.work-tile__picture::after`); it
  goes to 0 on hover or `:focus-visible`, over 200ms, with no transition
  under reduced motion. On touch screens there is no layer: full
  brightness, one tap opens the link.
- **Caption.** A black bar pinned over the bottom of the tile, one line:
  the product's logo (18px tall, `alt=""`), the name (`.type-caption`,
  `--ink-inverse`), the line (`--ink-inverse-muted`, from 1024px only,
  ending in an ellipsis when it does not fit) and `IconArrowRight` at the
  end: enter, not leave. A coming-soon tile shows "Coming soon"
  (`.work-tile__status`, `--ink-inverse-muted`, never cut) at every width,
  after the line where the line shows. Below 768px those tiles drop the
  arrow and their caption may wrap: where the name and the status do not
  fit side by side in the half-width cell, the status takes a second line
  (at 390px: Patchbay in en, it and ckm, Index in it; one line otherwise).
  From 1024px the name never shrinks; the line gives way first.
- **Logos** (`public/proof/projects/<key>/logo.svg`; AgroPulse's
  `logo-2026-09-29.svg`), each the product's
  own mark in its own light or dark-scheme colours, geometry untouched:
  Voyager `apps/web/public/logo-icon-light.svg`; Index
  `apps/web/public/index-mark.svg` from the Index repo with its dark-scheme
  ink (`--ink`, `oklch(0.93 0.006 80)`, `#eae7e3`) as the fill and the
  viewBox cropped to the shapes, as its own `Mark` component does
  (`40.5 9.5 48 177.5`); Polis `apps/web/public/brand/polis-app-icon.svg`;
  AgroPulse the Field Signal symbol (AgroPulse commit fc89afd),
  `assets/brand/field-signal/svg/agropulse-symbol-reversed.svg`, the ivory
  variant with the lime dot that AgroPulse uses on dark grounds, with the
  viewBox cropped square around the symbol (`-0.5 0 118 118`), written as
  `agropulse/logo-2026-09-29.svg` so no cache serves the old leaf-and-pulse
  mark, which stays in `agropulse/logo.svg` unused; Patchbay
  `brand/assets/logo/patchbay-symbol-paper.svg`, viewBox cropped square
  around the symbol. (Velum and AstyleMarine keep theirs under
  `proof/projects/` for other pages.)
- **Captures** (1440×1000 and 390×844, DPR 1, top of the page, webp at
  `cwebp -q 80 -m 6`). Each tile shows the product's About page, the page
  the tile opens; Patchbay, whose tile opens its page here, shows its
  landing. Voyager from its production root, which is its About page, with
  the analytics banner declined (`voyager/desktop-2026-09-26.webp` and
  `mobile-2026-09-26.webp`, shared with the showcase; dated names so no
  image cache serves the old capture); Index from its page here,
  `/en/index` on a production build, 2026-09-29, viewport only
  (`index/desktop.webp`, `index/mobile.webp`: the headline and "Coming
  soon", no sign-in); Polis and AgroPulse from their live About pages
  (`https://polis.intrface.eu/about`, `https://agropulse.intrface.eu/about`)
  after their new heroes went live, 2026-09-29, viewport only, 1× density,
  no banner dismissed (`polis/about-desktop-2026-09-29b.webp` and
  `about-mobile-2026-09-29b.webp`, the same names under `agropulse/`; the
  earlier `about-*-2026-09-29.webp`, already deployed, stay unused);
  Patchbay from `/` of a local run of a
  copy of its working tree (the intro at the top of the landing). The
  earlier Polis and AgroPulse captures (`polis/landing-*.webp`,
  `agropulse/desktop.webp`, `agropulse/mobile.webp`) stay in the tree
  unused by the grid. Use dated names when replacing a file.
- **Edge and state.** 1px border in paper at 16% (the bento sets
  `--line`); no radius or shadow. The focus ring is drawn inside the tile
  (paper with a black line inside it) so the grid does not clip it.

## Short routes

`/<locale>/voyager`, `/<locale>/polis` and `/<locale>/agropulse`, in every
locale, redirect with 307 to the product root in `PRODUCT_ROOTS`. They are
config redirects (`redirects()` in `next.config.ts`, built from
`PRODUCT_ROOTS` and `routing.locales`), which run before the proxy and
need no route file. Without a locale, `/voyager` goes first to
`/en/voyager` (the proxy's 308), then on. They are not in `SITE_PATHS`, so
not in the sitemap. Temporary, since a product may later get a page here.
`/en/index` is not a redirect but the hosted Index page; when Index ships,
add it to `PRODUCT_ROOTS` and remove the page.

## English-only product pages

The pages of products not open yet, `/index` and `/patchbay`
(`PRODUCT_PAGES` in `lib/site/product-roots.ts`), exist in English only
(`PRODUCT_PAGE_LOCALE`); hr, it, vec and ckm are for INTRFACE's own pages.
`next.config.ts` redirects `/<hr|it|vec|ckm>/index` and `/…/patchbay` to
the English page with 307 (temporary, since they may be translated
later). Each page's `generateStaticParams` returns `en` alone and
`dynamicParams` is false, so the build prerenders only `en/index.html` and
`en/patchbay.html`. Metadata comes from `buildPageMetadata` with
`translated: false`: canonical `/en/...`, no hreflang alternates, no
alternate OpenGraph locales. They are not in `SITE_PATHS`; the sitemap
adds one English entry each, with no alternates. "Back to home" goes to
`/en`.

## The Index page

`/en/index` (`app/[locale]/index/page.tsx`,
`components/pages/index-about-page.tsx`, messages in `IndexAbout`, in
`en.json` only): "What is Index?", Index's About page hosted here until it
ships. Next handles a folder named `index` under `[locale]` without
trouble: the build prerenders `en/index.html` beside `en.html`. On paper with the site header and footer, in the
site's type, following the section rhythm of the About page in the Index
repo:

1. Head: "Back to home"; Index's mark on an ink plate beside the label
   "What is Index?"; the `h1` "The things you save, read, filed and
   connected."; the lede; the "Coming soon" pill.
2. The catalogue drawing.
3. What you can do: a claim, a lede, the worlds drawing beside seven
   features (worlds, links, map, search, Telegram, the YouTube queue,
   collections).
4. How it works: three steps (you send, Index reads, you find), then the
   film drawing.
5. Why it holds: three reasons (it shows its reasons, you settle its
   guesses, your library stays yours).
6. The close: "Index is coming soon." and the scope, adapted: "When it
   opens: invite-only at first, in English, on the web and on Telegram.",
   then "Back to home" again.

The three ink drawings are copied from the Index repo
(`public/about/{catalogue,worlds,video}.webp` to
`proof/projects/index/about-*.webp`), not redrawn. No link to the product,
no sign-in, no request for access, no source, no "open source", no
numbers or users, no privacy-policy link (that page lives in the
product). Metadata: title "What is Index?", description the lede and the
status (see English-only product pages).

## The Patchbay page

`/en/patchbay` (`app/[locale]/patchbay/page.tsx`,
`components/pages/patchbay-page.tsx`), on paper like the other pages, with
the site header and footer. It shows, and only shows: "Back to home"
(`HomeGrid.common.backToGrid`) to `/en`; Patchbay's mark on an ink plate
(the mark is drawn in paper for dark grounds); the name
(`WorkIndex.entries.patchbay.name`, the `h1`); its line
(`WorkIndex.entries.patchbay.interface`, "Creative collaboration"); the
status pill ("Coming soon", `.status`); and the existing captures, desktop
and mobile, side by side from 1024px as on the showcases (`alt` is the
name; the mobile one's is empty). No address, no features, no
collaborators, no source link, no contact button. Metadata through
`buildPageMetadata`: title the name, description "{interface}.
{status}.", the shape Polis and Funda use; no new message keys. English
only (see English-only product pages).

## Verification

Typecheck, `bunx eslint src`, `bunx next build`; headless QA on a
production build (an isolated port) at 1440×900, 1024×768, 768×1024 and
390×844: no console or page errors, no horizontal overflow, no `<header>`;
five tile links with the right href and no `target`, Index's and
Patchbay's to `/en/index` and `/en/patchbay` in every locale; every caption on one line with no name cut, every
logo loaded; at 1440 the hovered Voyager tile's layer goes to 0 and the
others stay at 0.5; with touch emulation at 390 there is no layer; the
bento box equals the
viewport at scroll 0; no tile pixel shows at scroll 0; its top is 0 until
scroll = veil height and negative after; the veil's bottom is ≤ 0 at the
veil height; the rise runs from 12svh to 0 over the same run; the mobile capture
below 768px, the desktop capture from 768px; Tab to the first tile at
scroll 0 moves the veil away; screenshots at 0, 50, 100 and 150svh, looked
at. `/en`, `/hr`, `/it`, `/vec`, `/ckm` return 200 with their `html lang` and
start with their own line; `/de`, `/de/about` and `/fr/work` redirect to
the `/en` equivalents; `/` with `Accept-Language: it` redirects to `/it`;
`/en/about`, `/en/index`, `/en/patchbay` and every `/<locale>/work/*`
page return 200; `/<hr|it|vec|ckm>/index` and `/…/patchbay` return 307 to
the English page; the sitemap lists `/en/index` and `/en/patchbay` once
each, with no other locale; their pages carry a canonical and no hreflang; `/en/voyager`, `/en/polis` and
`/en/agropulse` return 307 to their product roots; no page links Index's
own address; hreflang on `/en/about` lists
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

The letter switch (revision 9), on a production build at 1440×900,
1024×768 and 390×844 (touch emulated): the lines advance in order, each
settled about 4.2s after the last (1.16s switch, 3s hold); hovering holds
the line shown and fades the arrows in; next and previous switch in their
direction and wrap; five rapid clicks end on the right line, one line
live and no letter mid-way or left styled; Left and Right switch with
focus inside, and keyboard focus holds the line; leaving resumes after a
full switch and hold; at 390 a 150px swipe left or right switches, a
25px one does not, a vertical drag scrolls the page, and a tap on the link
while the Istroveneto line shows lands on `/vec`; arrows sit clear of the
text at 1440 (flanking), 1280, 1024, 800 and 600; `h1` height constant
through every switch; no long task over 50ms; no console errors; no
horizontal overflow. Mid-switch frames forward and back, settled lines at
each width, and the arrows, looked at.

## Open

- None on the captures. The Index tile's first capture (Index's own About
  page, with "Sign in", "Ask for access" and "Live · Invite-only") was
  replaced on 2026-09-29 by a capture of `/en/index`, which says "Coming
  soon". The Index and Polis files were overwritten in place (never
  deployed); clear `.next/cache/images` before serving a build that has
  them.
