# Home grid contract (2026-09-25)

Owner decision, 2026-09-25: the home page stops being a sales page. The first
thing a visitor meets is not information about INTRFACE. It is an interface
made by INTRFACE. Principle, verbatim: **The first thing isn't a header. It
isn't a menu. It's interaction.**

This file is the build contract for that page. Agents build against it; the
durable design rules move into `DESIGN.md` when the build lands.

## Page structure

1. **Viewport 1: the grid.** An edge-to-edge Bento composition of eight cells,
   filling about `100svh` from 1280px up. No hero, no claim, no lead, no
   service list, no CTA bar, no header, no nav. Each cell *is* an interface
   fragment, not a screenshot in a decorative frame.
2. **Maker's mark.** The INTRFACE mark and word, small, fixed in the top-left
   corner, sitting on the ground. A small locale switcher fixed top-right.
   Neither consumes a header band.
3. **Footer.** Restrained. The inked signature wordmark stays. Then, in one
   short block: `INTRFACE · Vrsar, Croatia`, one sentence (the tagline
   "Interfaces for the world."), contact (email, phone), GitHub, Imprint
   (legal/privacy), locale switcher, © year. No link groups, no contact form,
   no second sentence.
4. **The ground stays.** The fixed halftone/vector ground runs under the whole
   page and shows in the grid gaps and under the footer. The footer carries
   `data-ground-key="land"` on its top region so the field gathers into Istria
   with the red X on Vrsar as the footer arrives. No `mark` key. The "From
   here / to the world" phrases are not rendered on this page.

## The eight cells

| slug | pair | status | fragment | Open → |
| --- | --- | --- | --- | --- |
| `voyager` | visitor ↔ place | Live | pannable chart of places around Vrsar, real coastline, pins with names | `/work/voyager` + live `https://voyager.intrface.eu` |
| `index` | — | — | search over everything the site makes; typing filters; results are links | none (it is the site's navigation) |
| `midiflow` | musician ↔ sound | Coming soon | playable step grid, WebAudio synth, sound only after a user tap | none |
| `patchbay` | artist ↔ artist | Coming soon | jacks and a cable you drag between them | none |
| `polis` | citizen ↔ institution | Coming soon | report something → it becomes a case that moves through states | `/work/polis` |
| `funda` | organization ↔ funding | Coming soon | pick who you are and what you need → matches appear | `/work/funda` |
| `velum` | customer ↔ business | Live | the site's own captures, scrollable inside a phone-shaped frame; desktop capture behind | `/work/velum` + live |
| `astyleMarine` | customer ↔ business | Live | same fragment as velum, its own captures | `/work/astyle-marine` + live |

Composition rule: Voyager is the largest cell. The two client captures are
portrait. From 1280px the grid fills the viewport; on tablets two columns
and rows around 50svh; on phones one column, every cell at least 72svh.
Every fragment must be usable at its cell size on every breakpoint.

## Geometry

- Sharp geometry. Cut, sloped edges, never rounded rectangles. Each cell is
  clipped with `clip-path: polygon(...)` to a quadrilateral whose edges slope
  0.5–1.5°, direction alternating so neighbouring edges stay near-parallel and
  the gap reads consistent. Optionally one chamfered corner per cell.
- Typography inside a cell is never rotated or skewed. Only the cell shape is.
- Gaps between cells are `clamp(8px, 1vw, 14px)` of open ground.
- Surfaces are the paper tokens (`--paper-raised`, `--card`) or ink
  (`--ink` with `.tone-ink` text tokens). Two or three ink cells at most.
- No radius, no shadow, no border. The edge is the cut.

## Interaction model

- **Reveal.** Every cell shows its name always (a `.type-meta` in one corner).
  At the cell's foot, inside the cut and left-aligned with the corner, one
  compact foot row: the one line (`.type-caption`, ellipsized to one line),
  then `Open →` and `Live site ↗` inline where they apply. The name is not
  repeated; the corner carries it. Cells under about 300px wide set the links
  on a second row. The row's height is reserved on every pointer through
  `--cell-chrome-bottom`, so fragments keep clear of it. On fine pointers it
  shows on hover or focus-within (opacity, 220ms, at once under reduced
  motion); on coarse pointers it is always visible. The row takes no pointer
  events; its two links do. No information is hover-only: the full line
  stays in the DOM for assistive tech.
- **Open.** `Open →` is a real link (`Link` from `@/i18n/navigation`) with the
  accessible name "Open {name}". It is not wrapped around the fragment;
  fragment controls must stay reachable by pointer and keyboard. The link
  prefetches its route on hover/focus.
- **Expand.** On click, the cell expands from its grid position to fill the
  viewport, then the route changes. Compositor-only: one transform on the
  cell (a uniform scale, `max(viewport width / cell width, viewport height /
  cell height)`, and a translate that centres the scaled cell on the
  viewport, which clips the overshoot) and one opacity fade on the foot row, 380ms,
  house easing. Then `router.push`. Under reduced motion: navigate at once,
  nothing moves. The showcase pages' back link points to `/` and reads
  "Back to the grid", so the grammar is: grid → touch → expand → explore →
  return to grid.
- Fragments never navigate on their own.

## Fragment contract (for fragment builders)

Files, all under `apps/web/src/components/home/grid/`:

- `<slug>-fragment.tsx` — `"use client"`, named export `<Slug>Fragment`
  (e.g. `VoyagerFragment`, `CaptureFragment` for the two client sites).
  Signature: `export function XFragment(props: { slug: string }): JSX.Element`.
  The capture fragment takes `{ slug: "velum" | "astyleMarine" }` and reads
  `PROJECTS` from `@/lib/site/projects`.
- `<slug>-fragment.module.css` — every non-utility rule the fragment needs.
  **Fragments never edit `globals.css`.**
- `<slug>-data.ts` — any static data (coastline points, place coordinates).
- Stubs already exist at these paths; replace their contents.

Rules:

- Fill the cell: the root element is `h-full w-full` inside a
  `position: relative` cell with `container-type: size`; use `cqw`/`cqh` for
  internal sizing where useful.
- Strings come from `useTranslations("HomeGrid.<slug>")` (next-intl client).
  The keys are already in all four message files (`en`, `de`, `fr`, `hr`).
  If a fragment needs a key that is missing, add it under its own
  `HomeGrid.<slug>` object in all four files with the Edit tool, nothing else
  in those files.
- Colour and type only through tokens and classes: `--paper`, `--paper-raised`,
  `--card`, `--ink`, `--ink-muted`, `--line`, `--accent`, `--font-brand`,
  `--font-mono`; `.type-meta`, `.type-caption`, `.type-data`, `.type-title`.
  Never the print red. Never a new radius. Tailwind utilities are fine.
- Motion: CSS transforms and opacity only; JavaScript touches the DOM only in
  response to input, via refs and `requestAnimationFrame`, never React state
  per frame. Any loop (a sequencer playhead, a pan inertia) stops when the
  cell is offscreen (`IntersectionObserver`), when the tab is hidden, and
  under `prefers-reduced-motion: reduce` (static state instead).
- Input: pointer and touch through Pointer Events with `touch-action` set so
  page scroll still works where the fragment does not consume the gesture;
  keyboard operable with visible focus (`outline-offset: 4px` ink outline);
  `aria-label`s from the messages.
- Audio (MidiFlow): `AudioContext` created on the first user gesture only;
  suspended when offscreen or hidden; no samples, an oscillator voice is fine.
- No new dependencies. No network at runtime. No iframes.
- Budget: a fragment's JS is under 12 KB minified; data files under 30 KB.
- Disclosure: Polis, Funda, MidiFlow and Patchbay are pre-release. A fragment
  demonstrates the *pair* (citizen ↔ institution, and so on) as a generic
  interaction. No feature names, no metrics, no architecture, no domains.
  Patchbay's domain is never written anywhere.
- Report: what you built, how it is operated, what you tested (command and
  result), what is left.

## Shell contract (for the grid builder)

- `apps/web/src/lib/site/interfaces.ts` — the cell registry: slug, grid area
  name, tone (`paper` | `ink`), href, liveUrl, status key, which fragment.
- `apps/web/src/components/home/grid/interface-grid.tsx` (server) — reads the
  registry, translates labels, renders `InterfaceCell`s.
- `apps/web/src/components/home/grid/interface-cell.tsx` (client) — chrome:
  clip-path, name corner, reveal label, Open link with prefetch and the FLIP
  expansion, then navigation. Fragment rendered as a child.
- `apps/web/src/components/home/grid/fragment-registry.tsx` — slug →
  fragment component. Imports the fragment files; do not edit them.
- `apps/web/src/components/pages/home-page.tsx` — rewritten: `<main
  className="ground-main text-ink">`, `<Ground />`, the grid, nothing else.
  The `<main>` rules from DESIGN.md still hold (no stacking context, no
  transform, no background).
- `apps/web/src/components/layout/maker-mark.tsx` — the fixed corner mark and
  locale switcher, rendered on the home page only.
- Header: the home route renders no header. Other routes keep it. Do this
  with a client `HeaderGate` around the server `Header` in the locale layout
  that returns null on the locale root.
- `apps/web/src/components/layout/footer.tsx` — rewritten as above.
- `globals.css` — grid, cell, label, expansion and maker-mark rules. Remove
  the dead home rules (hero sheet, pair strip, proof pane, build pane,
  doctrine pane, contact pane, ground band phrases) once nothing references
  them, and delete the components that no longer render on any page.
- Messages: `HomeGrid.common` and `Footer` may be edited; the per-fragment
  objects are owned by the fragment builders.
- `DESIGN.md`: update the Layout, Component and Content sections to state the
  new home contract and mark the old home-pane rules as history.
