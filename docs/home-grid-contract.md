# Home grid contract (2026-09-25)

Owner decision, 2026-09-25: the home page stops being a sales page. The first
thing a visitor meets is not information about INTRFACE. It is an interface
made by INTRFACE. Principle, verbatim: **The first thing isn't a header. It
isn't a menu. It's interaction.**

This file is the build contract for that page. Agents build against it; the
durable design rules move into `DESIGN.md` when the build lands.

## Page structure

1. **Viewport 1: the grid.** An edge-to-edge Bento composition of four cells,
   filling about `100svh` from 1280px up. No hero, no claim, no lead, no
   service list, no CTA bar, no header, no nav. Each cell *is* an interface
   fragment, not a screenshot in a decorative frame.
2. **Maker's mark.** The INTRFACE mark and word, small, fixed in the top-left
   corner, sitting on the ground. It consumes no header band. The locale
   switcher lives in the footer only.
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

## Revision 2026-09-26: four cells, open in place

The owner restated the brief as the north star (quoted in the section above)
and decided: Open expands the interface in place instead of leaving for a
showcase page (D7); four cells instead of eight (D8); at rest a cell is only
interface, with no name, and the top-right locale switcher goes (D9). This
section supersedes the old cell table, composition and interaction rules.

## The four cells

Registry: `apps/web/src/lib/site/interfaces.ts` (`CELLS`, `WORK_PIECES`,
`FragmentProps`, `WorkFragmentProps`).

| cell | fragment | expanded (`/#hash`) |
| --- | --- | --- |
| `voyager` | pannable chart of places around Vrsar, real coastline | `#voyager`; full-viewport chart with the places list |
| `index` | search over everything the site makes | `#index`; full-viewport search; grid items open in place (`/#slug`) |
| `polis` | report something on a plan of Vrsar, it becomes a case that moves through states | `#polis` |
| `work` | rotates through five pieces: `midiflow`, `patchbay`, `funda`, `velum`, `astyleMarine` | the current piece's hash (`#midiflow` … `#astyle-marine`) |

- Voyager is the largest cell and sits top-left. Index and Polis sit under
  it. Work is the tall cell on the right. Tablet: two columns, Voyager full
  width, Index and Polis side by side, Work full width. Phone: one column,
  each cell at least 72svh.
- From 1280px the grid fills the viewport below the mark band, with a floor
  so fragments stay usable on short screens.
- Velum and AstyleMarine are no longer captures. Each becomes a small working
  piece of its site's own interface, built only from content on the live
  site or in `public/proof/projects/<slug>/`: no invented items, prices or
  claims, and no outgoing actions inside the fragment.
- Polis on a plan of Vrsar is a demonstration. Nothing on the page says or
  implies that Vrsar uses Polis.

## Interaction model

- **At rest.** The cell shows only its fragment. No name, no status, no hint
  unless the interaction is not self-evident; such a hint fades after the
  first interaction. The cell region carries its name as `aria-label`.
- **Reveal.** On hover or focus-within (fine pointers), or on the first touch
  inside the cell (coarse pointers; the touch still reaches the fragment, and
  the cell stays revealed until another cell is touched), the foot row shows
  the name, the one line and `Open →`. Its height is reserved on every
  pointer through `--cell-chrome-bottom` so it never covers a control. The row
  takes no pointer events; its button does, and only while the row shows.
  Opacity only, 220ms, at once under reduced motion. For the work cell it reads the current piece.
- **Open.** `Open →` (a button, accessible name "Open {name}") expands the
  cell in place: its surface grows from the grid slot to the full viewport,
  the fragment re-renders with `expanded` true, the sloped cut becomes the
  viewport edge. No stretched text: no non-uniform scale, and no uniform scale
  left on at rest. At most 420ms, house easing; at once under reduced motion.
  The grid slot keeps its space, so nothing reflows behind.
- **Expanded.** A dialog (`role="dialog"`, `aria-modal`, labelled by the
  name). A thin top band inside the surface: name and line; then `Live site ↗`
  and `The project →` (the showcase route) where they apply, and a close mark.
  Focus moves in and is trapped; the rest of the page is inert; page scroll is
  locked without a layout shift. Esc, the close mark and browser Back collapse
  it the same way it opened, and focus returns to the cell.
- **URL.** Opening from the grid pushes `#<hash>`; collapsing goes back (or
  clears the hash with `replaceState` when the page was loaded with it). An
  in-page `/#slug` link opens in place; while another interface is open it
  switches at once and replaces the entry, so one Back returns to the grid.
  `hashchange` and `popstate` open, switch and close. Loading `/#<hash>` opens that interface expanded
  without animation; a work piece's hash also selects that piece. The
  pathname never changes, so the home route keeps no header.
- **Work rotation.** The work cell shows a switcher (the five piece names, a
  tablist) as part of its interface. It advances on its own every 9s only
  while the cell is visible, the tab is visible, no pointer or focus is in
  it, no reduced motion, and the visitor has not yet interacted with it; the
  first interaction stops it for good. Pieces crossfade (opacity, 200ms);
  only the current piece is mounted, so MidiFlow's sound stops when it leaves.
- The showcase pages stay for direct visits and keep "Back to the grid".
- Fragments never navigate on their own. Index results are links by design.

## Fragment contract (for fragment builders)

Files, all under `apps/web/src/components/home/grid/`:

- `<slug>-fragment.tsx` — `"use client"`, named export `<Slug>Fragment`
  (`VoyagerFragment`, `IndexFragment`, `PolisFragment`, `WorkFragment`,
  `MidiflowFragment`, `PatchbayFragment`, `FundaFragment`, `VelumFragment`,
  `AstyleMarineFragment`). Signature: `(props: FragmentProps)`, except
  `WorkFragment(props: WorkFragmentProps)`; both types from
  `@/lib/site/interfaces`. A fragment must work at its cell size on every
  breakpoint and at full viewport (`expanded`), where it may show more.
- `<slug>-fragment.module.css` — every non-utility rule the fragment needs.
  **Fragments never edit `globals.css`.**
- `<slug>-data.ts` — any static data (coastline points, place coordinates).

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

- `apps/web/src/lib/site/interfaces.ts` — the registry: `CELLS` (slug, grid
  area, tone, hash, href, liveUrl, status), `WORK_PIECES`, the fragment prop
  types, and `targetForHash` / `hashFor`, which map a URL fragment to a cell
  (and piece) and back.
- `apps/web/src/components/home/grid/interface-grid.tsx` (server) — resolves
  the copy of every cell and work piece and renders `InterfaceShell`.
- `apps/web/src/components/home/grid/interface-shell.tsx` (client) — owns the
  open cell, the work cell's current piece and the touch reveal; runs open
  and collapse (one clip-path animation of the fixed, full-viewport surface
  through the Web Animations API), the hash, `popstate` / `hashchange`, the
  in-page `/#slug` link handling, inert and the scroll lock.
- `apps/web/src/components/home/grid/interface-cell.tsx` (client) — draws a
  cell: the cut surface, the foot row, and while open the dialog with its
  top band; traps focus and closes on Esc.
- `apps/web/src/components/home/grid/fragment-registry.tsx` — cell slug →
  fragment. Imports the fragment files; do not edit them.
- `apps/web/src/components/pages/home-page.tsx` — `<main
  className="ground-main text-ink">`, `<Ground />`, the grid, nothing else.
  The `<main>` rules from DESIGN.md still hold (no stacking context, no
  transform, no background).
- `apps/web/src/components/layout/maker-mark.tsx` — the fixed corner mark,
  rendered on the home page only.
- Header: the home route renders no header (`HeaderGate`). Other routes keep
  it.
- `globals.css` — grid, cell, reveal, open-in-place and maker-mark rules.
- Messages: `HomeGrid.common` and `Footer` may be edited; the per-fragment
  objects are owned by the fragment builders.
