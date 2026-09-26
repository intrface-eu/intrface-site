# Home contract (2026-09-26, revision 4: the veil and the work)

Owner decision, 2026-09-26 (evening): the interface fragments were
approximations of the products, not the products. Home now shows the real
work: a screenshot of each live site, linking straight to it. The veil and
the sentence stay. Everything built for the fragments (revisions 1 to 3:
cells, open in place, hash URLs, the eight fragments) is removed.

The sentence, verbatim (the north star from the manifesto), already in the
four message files as `HomeGrid.common.claim`:

> Reduce unnecessary friction between human intention, reality, and
> meaningful action.

## Page structure

Top to bottom, on plain paper (`--paper`; no `Ground` on home; about keeps
it):

1. **The veil.** As built in revision 3 and unchanged: a layer as tall as
   the first viewport over the top of the page, `--ink`, solid at the top and
   fading to nothing at the bottom; on it the logo (`MakerMark`: mark and
   word, paper, top-left, linking home) and the sentence (`.type-display`,
   `--ink-inverse`, the page's `h1`, inside `.section-shell`). It lifts
   faster than the page (CSS scroll-driven animation, `-35svh` over the
   first `100svh`, behind `@supports` and `prefers-reduced-motion:
   no-preference`); the solid band takes pointer events, the faded part
   does not. Keep `.home-stage`, `.home-veil*`, `.maker-mark*` and
   `--veil-rest` as they are.
2. **The work.** Three tiles, one per live project, in this order: Voyager,
   Velum, AstyleMarine (`PROJECTS` in `lib/site/projects.ts` has name,
   `liveUrl` and the capture paths; the line is `Projects.<key>.role`). Each
   tile is one link to the live site (`target="_blank"`,
   `rel="noopener noreferrer"`, accessible name "{name}: {line}, {newTab}"
   using the existing `Projects.newTab` string) wrapping:
   - the real screenshot, whole, never cropped: from 768px the desktop
     capture (`PROJECTS[key].desktop`, 1440×1000), below it the mobile
     capture (`mobile`, 390×844), through `<picture>` or `next/image` with
     `sizes` set for the tile's real width; the first tile loads with
     priority, the others lazily; `alt` is the name;
   - a caption row under the image, always visible: name (`.type-caption`,
     ink), the line (`.type-caption`, `--ink-muted`), and an up-right arrow
     (`IconArrowUpRight`, already used on the site) at the end of the row.
   One column at every width. The tiles sit in `.section-shell` (so they
   line up with the sentence and the logo), stacked with `--grid-gap`
   between them (gap × 3 from 768px). The image gets a 1px `--line` edge so
   a paper-coloured screenshot does not melt into the page; no radius, no
   shadow, no overlay, no hover effect beyond the link's focus ring
   (`outline-offset: 4px`, ink). The first tile starts at `--veil-rest`,
   as the grid did.
3. **The footer.** Unchanged (natural height, no ground key).

Nothing else on the page: no heading over the work, no "selected work"
label, no status badges, no count, no button.

## Removal

Delete, and remove every reference to:

- `apps/web/src/components/home/grid/` entirely: `interface-shell.tsx`,
  `interface-cell.tsx`, `interface-grid.tsx`, `fragment-registry.tsx`, all
  `*-fragment.tsx`, `*-fragment.module.css` and `*-data.ts`.
- `apps/web/src/lib/site/interfaces.ts`.
- In `globals.css`: `.interface-grid`, `.interface-cell*`, `.tone-ink`,
  `--cell-chrome-*`, the open-in-place rules, `:root[data-ground-open]`
  rules that only served home cells (check before removing; about's ground
  rules stay), and anything else only the grid used. Keep `--grid-gap`.
- Messages, all four files: remove `HomeGrid.voyager`, `.index`, `.polis`,
  `.midiflow`, `.patchbay`, `.funda`, `.velum`, `.astyleMarine`, and in
  `HomeGrid.common` remove `open`, `openName`, `live`, `comingSoon`,
  `liveSite`, `close`, `theProject`. Keep `claim`, `makerMark`,
  `gridLabel` (reworded to "Work by INTRFACE" and its translations; it
  labels the tiles' `<section>`), and `backToGrid`, reworded to plain "Back
  to home" in each language (the showcase pages `project-showcase.tsx`,
  `work-polis-page.tsx`, `work-funda-page.tsx` use it; they keep linking to
  `/`).

## New files

- `apps/web/src/components/home/work-tiles.tsx` (server): reads `PROJECTS`
  and the `Projects` messages, renders the `<section>` with the three
  tiles. No client component is needed; the tile is an `<a>`.
- `apps/web/src/components/home/veil.tsx` (server): the veil, moved out of
  the deleted `interface-grid.tsx` unchanged.
- `home-page.tsx`: `<main className="text-ink">` with `.home-stage`
  holding the veil and the tiles, then nothing (the footer comes from the
  layout).

## DESIGN.md

Rewrite the home rules to this contract: layout (veil, tiles, footer),
component rules (the veil, the work tile; drop the interface cell, open in
place and maker's-mark-in-a-strip rules), motion (the veil lift; no
in-place expansion), content design ("home says one sentence, then shows
the work as it is, linking to it"), and the history line. The ground's
WebGL rules stay for about.

## Verification

Typecheck, `bunx eslint src`, `bunx next build`; then headless QA on a
production build (port 3031) at 1440×900, 1024×768 and 390×844: no console
or page errors, no horizontal overflow, no `<header>` on home; three tiles,
each an `<a>` to the right live URL with `target="_blank"` and
`rel="noopener noreferrer"`; the mobile capture is what renders at 390 and
the desktop capture from 768; the sentence on solid ink at scroll 0 with the
first tile reading through the fade; screenshots at scroll 0, 50svh, 100svh
and 150svh per size, looked at; `/de`, `/fr`, `/hr` show their sentence and
role lines; `/en/about`, `/en/work/voyager`, `/en/work/polis`, `/en/work/funda`
return 200 and the showcase pages show the reworded back link; `/en#voyager`
loads home without error (no hash handling remains). Confirm nothing in
`src` still imports from `home/grid` or `lib/site/interfaces`.
