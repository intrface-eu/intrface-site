# Home contract (2026-09-26, revision 5: the veil over a full-screen bento)

Owner decision, 2026-09-26 (late evening): "I want the apps to be a full
bento grid that covers the screen, include polis, and make it so the
gradient scrolls out of view and only then the bento grid scrolls."
Revision 4 stacked three whole screenshots in one column and lifted the
veil with a scroll-driven animation. Revision 5 puts four tiles, Polis
among them, in one bento that fills the screen, and pins it with CSS
sticky until the veil has gone. Screenshots now cover their cells and may
lose their bottom (and, in narrow cells, a side); the scroll-driven lift
and `--veil-rest` are removed.

The sentence, verbatim, is `HomeGrid.common.claim`:

> Reduce unnecessary friction between human intention, reality, and
> meaningful action.

## Page structure

`HomePage`: `<main className="text-ink">` holding `.home-stage` (the veil
and the bento), then the footer from the layout. Plain `--paper`, no
header, no `Ground`.

1. **The stage.** `.home-stage` is `position: relative` and `200svh` tall.
   The bento is its only in-flow child.
2. **The veil.** `Veil`, `.home-veil`: absolute at the top of the stage,
   `100svh` tall, `z-index` above the bento, `--ink` solid to 55% and then
   fading to nothing. On it the logo (`MakerMark`) and the sentence
   (`.type-display`, `--ink-inverse`, the page's `h1`, in
   `.section-shell`). It scrolls away at page speed. Its solid band
   (`::before`) takes pointer events, the faded part does not. When a tile
   gets keyboard focus, the veil moves up out of the way
   (`.home-stage:has(.work-tile:focus-visible) .home-veil`,
   `translateY(-100%)`, a 240ms transition only under
   `prefers-reduced-motion: no-preference`).
3. **The bento.** `WorkTiles`, `.work-tiles`, a `<section>` labelled
   `HomeGrid.common.gridLabel`: `position: sticky; top: 0`, full viewport
   width (not in `.section-shell`), `100svh` tall, on `--paper` with a gap
   and outer padding of `min(var(--grid-gap), 10px)`. It sits under the
   veil from the first frame, stays pinned for the first `100svh` of
   scroll, and moves up with the page once the veil has left.
4. **The footer.** Unchanged.

No JavaScript scroll handler and no reduced-motion branch for the scroll:
it is ordinary sticky scrolling and works the same in every browser.

## The tiles

Four, in DOM order: Voyager, Velum, Polis, AstyleMarine.

- **Grid.** From 1024px a checkerboard on five columns and two equal rows:
  Voyager 3 + Velum 2, then Polis 2 + AstyleMarine 3. Below 1024px, 2×2
  equal cells.
- **Link.** Each tile is one `<a>` (`target="_blank"`,
  `rel="noopener noreferrer"`) named "{name}: {line}, {Projects.newTab}".
  Voyager, Velum and AstyleMarine come from `PROJECTS` (live URL, captures,
  `Projects.<key>.role`). Polis is defined in `work-tiles.tsx` only (other
  pages iterate `PROJECTS`): it links to its public source,
  `https://github.com/basicalex/polis`, with `WorkPolis.name` and
  `WorkPolis.domain` ("Civic interfaces"). No badge, no description.
- **Image.** `<picture>` with `next/image` props from `getImageProps`: the
  desktop capture (1440×1000) from 768px, the mobile capture (390×844)
  below. `object-fit: cover`, anchored to the top; Voyager centres
  horizontally, the others keep their left edge, where their headlines
  sit. `sizes` follows the cell (60vw / 40vw from 1024px, 50vw below, 72vh
  where a cell is narrower than the capture and is filled by height). All
  four load eagerly; Voyager alone gets `fetchPriority="high"`. `alt` is
  the name. Polis's captures (`public/proof/projects/polis/`) are the top
  of the synthetic pilot home from `polis-shots/staff-2026-09-17`.
- **Caption.** A paper bar pinned over the bottom of the tile, one line:
  the name (`.type-caption`, ink), the line (`.type-caption`,
  `--ink-muted`, from 1024px only, ending in an ellipsis when it does not
  fit) and `IconArrowUpRight` at the end.
- **Edge and state.** 1px `--line` border; no radius, shadow or hover
  effect. The focus ring is drawn inside the tile (ink with a paper line
  inside it) so the grid does not clip it.

## Verification

Typecheck, `bunx eslint src`, `bunx next build`; headless QA on a
production build (port 3031) at 1440×900, 1024×768, 800×1000 and 390×844:
no console or page errors, no horizontal overflow, no `<header>`; four
tile links with the right href, target and rel; the bento box equals the
viewport at scroll 0; its top is 0 at scroll 0, 50svh and 100svh − 1 and
negative at 150svh; the veil's bottom is ≤ 0 at 100svh; the mobile capture
below 768px, the desktop capture from 768px; Tab to the first tile at
scroll 0 moves the veil away; screenshots at 0, 50, 100 and 150svh, looked
at. `/de`, `/fr`, `/hr` show their sentence; `/en/about` and
`/en/work/polis` return 200. `grep -rn "veil-rest\|home-veil-lift"
apps/web/src` returns nothing.
