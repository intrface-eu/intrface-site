# Home contract (2026-10-30, revision 11: interfaces on paper)

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

Revision 11, 2026-10-30: the owner called the bento "just ugly" and asked
for white space and our interfaces as the main thing, with the sentence
animated better but kept as neat as it is. The bento and its sticky stage
are gone. The first screen is still black with the sentence; the first
interface peeks into its bottom edge, and the black gives way to paper
behind it. Below, one product per row on paper (Voyager, AgroPulse,
Polis), each a desktop capture with a phone over its near corner, the
phone showing the product in use (the Voyager atlas, the AgroPulse grove,
the Polis report). Index and Patchbay share one quieter "Coming soon" row,
and the last block, "We build these for clients too.", shows Velum and
AstyleMarine small and links to `/services`. The sentence now rises word
by word behind a mask, and the arrows gave way to the language codes
(EN, HR, VEC, CKM) with a hairline that runs out the hold. The footer is
paper on home too. Revisions 5 to 10 below the structure are history.

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
- **Words.** Each line is words (`.home-veil__word`, inline-block,
  `overflow: hidden`, a little padding above and below with matching
  negative margins, so descenders and accents are not clipped) holding one
  `.home-veil__word-in` each, with its index in `--w`. Words keep the
  font's kerning, so the per-letter `KERNING` table is gone.
- **Motion.** On first paint the page's line rises word by word inside the
  masks (`data-intro`, CSS `claim-rise`: from `translate3d(0, 110%, 0)`,
  1000ms, `cubic-bezier(0.16, 1, 0.3, 1)`, each word 42ms after the last
  from 160ms). A switch moves the words, transform only (`waapi.animate`,
  `stagger`): the old line's words leave upward out of their masks
  (`EASE_AWAY`, 460ms each, 18ms apart), the new line's words rise in from
  below starting 240ms in (`EASE_LAND`, 950ms each, 42ms apart); back, the
  directions flip. Then the line holds 3.4s. A switch asked for mid-flight
  retargets from where the words are.
- **Pauses.** The cycle pauses while a mouse (not touch) is over the
  sentence block, on the line shown; a switch already in flight lands
  first. It pauses with keyboard focus inside (a button focused by a mouse
  click does not count, so leaving resumes), while the tab is hidden and
  while the block is off screen (IntersectionObserver). Leaving, a swipe, a
  click or a key starts a full switch-and-hold again.
- **Codes.** Under the sentence, `.home-veil__codes` (a group labelled
  `Showcase.languages`, "Language of the sentence") holds one button per
  line with its code in capitals and its endonym as the name;
  `aria-pressed` marks the line shown. A click switches straight to that
  line. Under the pressed code a hairline (`::after`, `claim-hold`) runs
  from nothing to full over the switch and the hold, so it shows when the
  next line comes; while the cycle is paused it stands full (`data-held`).
  Under reduced motion the hairline does not run.
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
  clears `aria-hidden` and `tabIndex` once it hydrates. No word motion, no
  running hairline, and the keys and swipe do nothing.

## Page structure

`HomePage`: `<main className="home text-ink">` holding `Veil` and
`HomeInterfaces`, then the footer from the layout. No header, no `Ground`.

1. **The first screen.** `Veil`, `.home-veil`: at least `100svh` on
   `--black`, the logo and the sentence (see The sentence). Its bottom
   padding leaves `--iface-peek` (`clamp(4.5rem, 15svh, 9rem)`) free, and
   the first interface rises into that band.
2. **The interfaces.** `HomeInterfaces`, `.ifaces.ifaces--home`, a
   `<section>` labelled `HomeGrid.common.gridLabel`. Its background runs
   from `--black` to `--paper` in eased stops over `--fade`
   (`clamp(9rem, 40vw, 36rem)`), so on a phone the first row's text already
   sits on paper. The first row is pulled up by `--iface-peek` above the
   black. See The interfaces.
3. **The footer.** Paper, as on every page.

## The interfaces

Rows are `InterfaceRow` (`components/showcase/interface-row.tsx`), shared
with `/services`. A row is a desktop capture (1440×900 at 2x, a white plate
with a hairline and a long offset shadow) with a phone (390×844 at 2x, the
capture in a thin ink body) over its near corner, and a narrow text column:
the name, the status, one line and the way in. From 1024px the screens take
the wide column and run off the page edge on their side (`data-side`); the
phone hangs into the gap toward the text. Below 1024px a row stacks,
screens first, bleeding a fifth past the far edge. The lead row
(`data-lead`, Voyager) sets the screens across the width from a fifth in,
with the phone standing mostly beside the screen so it covers the page's
margin and not its copy, and the name and the line under it in two
columns. The section clips the bleed (`overflow-x: clip`).

In order:

- **Voyager**, lead, "Live": desktop the Voyager home page, phone the Vrsar
  atlas. "Open Voyager" goes to `PRODUCT_ROOTS.voyager`; a quieter "Open
  the Vrsar atlas" goes to `https://voyager.intrface.eu/en/vrsar`.
- **AgroPulse**, screens on the start side, "Live": the app on a 5.5 ha
  grove near Vrsar, desktop and phone. "Open AgroPulse".
- **Polis**, "Public test": desktop the root's map of Croatia ("Where are
  you?"), phone the report form. Its line is followed by "A public test
  with synthetic data. No municipality uses Polis yet." "Open Polis".
- **Coming soon**, `.iface-pair`: Index and Patchbay as two quieter cards
  linking to `/en/index` and `/en/patchbay` (see English-only product
  pages), with their status.
- **The door**, `.iface-door`: "We build these for clients too.", one line
  naming Velum and AstyleMarine, a primary button to `/services`, and the
  two sites (`InterfaceDuo`), each screen linking to the live site.

Captures live in `public/proof/projects/<project>/*-2026-10-30.webp`.
Alt text is in `Showcase.alt`. The one motion: as a row comes into view its
screen settles from 3rem below and the phone from 7rem (scroll-driven,
transform only, behind `@supports (animation-timeline: view())` and
`prefers-reduced-motion: no-preference`).

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

Revision 11 (2026-10-30): `bun run check-types`, eslint on the changed
files, `bun run build`; a production build on an isolated port, looked at
at 1440×900 and 390×844, from the top and as full pages with reduced motion
emulated (a full-page capture stretches the viewport and moves every
`view()` timeline, so it shows the settle half-run otherwise). The checks
below describe the old bento and stay as history.

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
