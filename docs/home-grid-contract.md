# Home contract (2026-09-26, revision 3: the veil and the interfaces)

Owner decision, 2026-09-26: the home page is one sentence over the
interfaces. Nothing else. The earlier grid work (2026-09-25/26: sloped
cuts on the WebGL ground, a corner mark, a rotating work cell) is scrapped as
UI; what stays of it is the working fragments, the open-in-place behaviour,
the logo (mark and word), the icon and the type. This file is the build
contract; the durable rules move into `DESIGN.md` when the build lands.

The sentence, verbatim (the north star from the manifesto):

> Reduce unnecessary friction between human intention, reality, and
> meaningful action.

## Page structure

Top to bottom, on plain paper (`--paper`; no `Ground` on home; about keeps
it):

1. **The veil.** A layer as tall as the first viewport (`100svh`) lying over
   the top of the interfaces: `--ink`, fully opaque at the top edge, fading
   to nothing at the bottom edge (one linear gradient; the agent picks where
   the fade starts so the sentence sits on solid ink and the lower cells read
   through). On it, and only on it: the logo (`AnimatedMark` and the word
   "intrface", inverse paper, top-left, linking home; the `MakerMark` moves
   in here and stops being fixed) and the sentence, localized, set in the
   brand face at display size (`.type-display`, `--ink-inverse`), left
   aligned inside `.section-shell`, in the upper half of the viewport. No
   button, no arrow, no scroll hint, no status, no second sentence.
2. **The interfaces.** The eight working fragments, each in its own plain
   rectangular cell, in a simple grid under the veil. The first row starts
   where the veil comes to rest after its lift (`65svh`; `92svh` where the
   lift does not run), so nothing stays under the solid ink for good and the
   lowest cells read through the fade at rest. Registry order: Voyager, Index, Polis, MidiFlow,
   Patchbay, Funda, Velum, AstyleMarine. Phone: one column, each cell at
   least `72svh`. From 768px: two columns, cells `clamp(24rem, 56svh, 42rem)`
   tall. Gaps of `--grid-gap` show paper. Surfaces are `--paper-raised`, or
   `--ink` for Index and MidiFlow (`.tone-ink`). No cut, no radius, no
   border, no shadow, no name at rest.
3. **The footer.** Unchanged in content (name and place, tagline, email,
   phone, GitHub, Imprint, locale switcher, © year, the signature wordmark).
   It loses its `55vh` floor and its `data-ground-key` (the footer never
   keys the ground now: about keys its own band); it takes its natural
   height.

## Scroll

- The veil leaves upward as the page scrolls; the interfaces stay and become
  ordinary page content. The parallax the owner asked for ("the interfaces
  slightly lag, then scroll properly once the gradient is gone") is done by
  moving the veil faster than the page, never by transforming the grid: the
  open dialog is `position: fixed` inside a cell, and a transform on any
  ancestor would break it. Over the first `100svh` of scroll the veil gets
  an extra `-35svh` of translate (`transform` only), through a CSS
  scroll-driven animation (`animation-timeline: scroll(root)`,
  `animation-range: 0 100svh`, `@supports (animation-timeline: scroll())`).
  Where that is unsupported, and under reduced motion, the veil simply
  scrolls with the page. No JavaScript scroll handler.
- The veil takes no pointer events where it has faded: a click, a touch or
  a wheel there reaches the cell under it. Its solid band and the logo link
  do take them, so a swipe on the ink scrolls the page instead of panning a
  hidden map, and nobody hovers or drags a cell they cannot see.
- Once scrolled past, the veil is gone; nothing fixed remains on the page
  (no fixed mark). The wordmark in the footer closes the page.

## Interaction model (unchanged in behaviour, simpler in chrome)

- **At rest.** A cell shows only its fragment; the region carries its name as
  `aria-label`.
- **Reveal.** On hover or focus-within (fine pointers), or on the first
  touch inside the cell (coarse pointers; the touch still reaches the
  fragment, and the cell stays revealed until another cell is touched), a
  plain foot row shows the name, the one line and `Open →`. Its height is
  reserved on every pointer through `--cell-chrome-bottom`; the row takes no
  pointer events, its button does, and only while the row shows. Opacity
  only, 220ms, at once under reduced motion.
- **Open.** `Open →` (a button, accessible name "Open {name}") expands the
  cell in place: the surface grows from its rectangle in the grid to the
  full viewport as one clip-path animation of the fixed, full-viewport
  surface (Web Animations API, at most 420ms, house easing, at once under
  reduced motion; the resting clip is now the cell's plain rectangle). The
  fragment re-renders with `expanded` true. The grid slot keeps its space.
- **Expanded.** A dialog (`role="dialog"`, `aria-modal`, labelled by the
  name) with a thin top band: name and line; `Live site ↗` and `The project
  →` where they apply; a close mark. `--cell-chrome-top` is the band's
  height, `--cell-chrome-bottom` is 0. Focus moves in and is trapped, the
  rest of the page is inert, page scroll is locked without a layout shift.
  Esc, the close mark and Back collapse it; focus returns to Open.
- **URL.** Opening pushes `#<hash>`; collapsing goes back (or clears the
  hash with `replaceState` when the page was loaded with it). An in-page
  `/#slug` link opens or switches in place and replaces the entry. Loading
  `/#<hash>` opens that interface at once. The pathname never changes, so
  `HeaderGate` still renders no header on home.
- Hashes: `voyager`, `index`, `polis`, `midiflow`, `patchbay`, `funda`,
  `velum`, `astyle-marine`. Same as before; Index's `/#slug` links keep
  working.
- Fragments never navigate on their own. Index results are links by design.

## Registry and shell (for the builder)

- `apps/web/src/lib/site/interfaces.ts`: `CELLS` becomes eight entries with
  `slug`, `tone`, `hash`, `href`, `liveUrl`, `status`, `project` (client
  sites take name, route and live URL from `PROJECTS`, the line from
  `Projects.<key>.role`). `WORK_PIECES`, `WorkPieceSlug`, `WorkFragmentProps`,
  `OpenTarget.piece` and the `area` field go. `targetForHash` and `hashFor`
  become plain lookups on `CELLS`. `FragmentProps = { expanded: boolean }`
  stays.
- `fragment-registry.tsx`: slug → fragment for all eight.
- `interface-shell.tsx`: drop the work piece state and everything that
  served it; `restingClip` returns the cell's rectangle. The rest (open,
  collapse, hash, history depth, popstate, hashchange, in-page links, inert,
  scroll lock) stays as built.
- `interface-cell.tsx`: drop the cut geometry; keep the foot row, the
  dialog, the band, the focus trap.
- Delete `work-fragment.tsx`, `work-fragment.module.css`,
  `work-piece-context.ts`; `midiflow-fragment.tsx` drops
  `useWorkPieceActive` (it is always active now; its offscreen and hidden
  pauses stay).
- `interface-grid.tsx` (server): resolves copy for the eight cells and
  renders the veil and the shell. `home-page.tsx`: `<main>` with the grid
  section and nothing else; no `Ground`, no `MakerMark`. The `<main>` rules
  (no stacking context, no transform, no background) can be relaxed now that
  no ground sits behind it, but keep it plain.
- `globals.css`: replace the interface-grid, interface-cell cut and
  maker-mark rules with the veil, the plain grid and the plain cell; remove
  `--tilt`, `--xa`, `--yp`, `--mark-band`; keep `--grid-gap`,
  `--cell-chrome-top`, `--cell-chrome-bottom`; drop the footer's `55vh`
  floor. Fragment module CSS files are not touched except to remove a rule
  that referenced the cut.
- Messages: add `HomeGrid.common.claim` in all four files; remove
  `HomeGrid.work`. Keep `makerMark`, `open`, `openName`, `close`,
  `liveSite`, `theProject`, `gridLabel`, `backToGrid` (showcase pages use
  it). The sentence:
  - en: "Reduce unnecessary friction between human intention, reality, and meaningful action."
  - de: "Unnötige Reibung zwischen menschlicher Absicht, Wirklichkeit und sinnvollem Handeln abbauen."
  - fr: "Réduire les frictions inutiles entre l'intention humaine, la réalité et l'action qui a du sens."
  - hr: "Smanjiti nepotrebno trenje između ljudske namjere, stvarnosti i smislenog djelovanja."
- `DESIGN.md`: rewrite the home rules (layout, component rules for the
  veil, the cell, the footer, the ground's "on home" clauses, motion, content
  design) to this contract. The ground's WebGL rules stay for about.

## Fragment contract (unchanged)

Files under `apps/web/src/components/home/grid/`: `<slug>-fragment.tsx`
(`"use client"`, named export `<Slug>Fragment(props: FragmentProps)`),
`<slug>-fragment.module.css`, `<slug>-data.ts`. A fragment fills its cell
(`h-full w-full` in a `position: relative` size container) and works at
cell size on every breakpoint and at full viewport (`expanded`). Strings
from `HomeGrid.<slug>`; colour and type through tokens only; never the
print red; motion by transform and opacity, loops paused offscreen, hidden
and under reduced motion; audio on a gesture only; no dependencies, no
network, no iframes; JS under 12 KB, data under 30 KB. Polis, Funda,
MidiFlow and Patchbay demonstrate the pair only: no feature names, metrics,
architecture or domains; Patchbay's domain is never written. Polis on a
plan of Vrsar does not imply Vrsar uses Polis.
