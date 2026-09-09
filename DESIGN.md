---
version: "1.0"
name: "Intrface design system"
description: "Project-level visual and product design contract for coding agents."
colors:
  bg: "#f5f1eb"
  surface: "#fbf9f4"
  card: "#ffffff"
  primary: "#0f766e"
  accent: "#b45309"
  text: "#0f1729"
  muted: "#47536b"
  ink-inverse: "#f5f1eb"
  success: "#15803d"
  warning: "#b45309"
  danger: "#be123c"
  on-primary: "#f4fffd"
  on-danger: "#fff1f2"
typography:
  display-xl:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(3rem, 7.4vw, 5.5rem)"
    fontWeight: "600"
    lineHeight: "1"
    letterSpacing: "-0.04em"
    maxInlineSize: "14ch"
  display:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(2.4rem, 5.6vw, 3.6rem)"
    fontWeight: "600"
    lineHeight: "1.04"
    letterSpacing: "-0.04em"
    maxInlineSize: "20ch"
  heading:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(1.6rem, 2.7vw, 2.2rem)"
    fontWeight: "600"
    lineHeight: "1.14"
    letterSpacing: "-0.03em"
  subheading:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(1.3rem, 1.8vw, 1.55rem)"
    fontWeight: "540"
    lineHeight: "1.2"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: "600"
    lineHeight: "1.4"
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(1.0625rem, 1.15vw, 1.1875rem)"
    fontWeight: "400"
    lineHeight: "1.65"
    maxInlineSize: "56ch"
  body-md:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.7"
    maxInlineSize: "64ch"
  body-sm:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: "400"
    lineHeight: "1.62"
    maxInlineSize: "60ch"
  caption:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: "500"
    lineHeight: "1.5"
  label:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "0.8rem"
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: "0.13em"
rounded:
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  action-primary:
    backgroundColor: "{colors.text}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  action-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  app-background:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
  panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "24px"
  panel-dark:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ink-inverse}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "24px"
  caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
---

# DESIGN.md

This is the project-wide visual and product design contract for agents and humans. Treat it as the source of truth before making product-facing UI, website, documentation, marketing, or media changes.

> AOC note: this template is AOC-owned and compatible with the Google Labs `design.md` format. Keep the YAML token front matter valid, concise, concrete, and updated when intentional design-system changes are made.

## Product experience

- Product/project: Intrface public web surfaces
- Primary audience: businesses, destination operators, institutions, technical teams, and collaborators evaluating Intrface for trusted interfaces across real-world systems
- Primary promise: Interfaces for the world — five products of our own and client work. Internal delivery rules, agent orchestration, and AOC are not public marketing content.
- Desired emotional impression: clear, trustworthy, precise, grounded, intelligent, interface-first
- Trust/energy level: calm confidence — an engineering studio, not a hype landing page

## Brand personality

- Voice: direct, concrete, evidence-first; short declarative sentences
- Mood: warm paper, dark ink, one working accent — a printed systems document brought to life
- Keywords: interface, orientation, trust, proof, legibility, operating layer
- Avoid: AI hype, gradients-for-gradients'-sake, robot/neural imagery, vague "innovation" language, dark-mode-startup clichés

## Visual principles

1. Interface is the brand: every surface should turn complexity into orientation.
2. Trust is visible: proof, sources, state, responsibility, and uncertainty should be legible.
3. Atmosphere supports meaning: the halftone is a print-inspired landmark, and it has to resolve into something. On the home page it is the ground of the space — one fixed field of dots the whole page floats on (`Ground`), with the live shader (`HeroHalftone`) as its region under the hero, where the pointer reads as pressure on the plate. A halftone that fills a corner is wallpaper — never that, and never behind reading content. Reading content stays on continuous opaque panes, not cards or floating label chips, and the shader's own mask ramps from nothing across the hero type to solid at the trim edge, so no dot ever sits behind a word.
4. One paper, one ink, one accent: warm paper `#f5f1eb` everywhere, ink `#0f1729` for text and dark bands, teal `#0f766e` as the single working accent.

## Layout system

- Density: generous; sections breathe with `py-20 sm:py-28`
- Grid/container rules: `.section-shell` — `min(100%, 80rem)` centered, `px-6/8/10` responsive
- **Ground and panes (home page only).** The fixed halftone ground sits behind continuous surfaces whose ends extend beyond the viewport. No bounded information cards, rounded section corners, boxed borders, or card shadows. Explicit exception (2026-09-07): bounded previews of actual public projects are allowed; bounded containers for every homepage section are not. `.home-pane::before` extends `8vw` past each horizontal edge; only its background is skewed, while text stays level in `.section-shell`. `.home-planes` clips horizontal decoration without becoming a scroll container. Ground remains its sibling.
- The pair ribbon slopes −1.2° and doctrine −1.8° (−1° on mobile). Evidence and the ink product index stay level. Selected work uses equal compact previews: three columns from 1024px, two from 640px, and one below. No lead span or stagger; screenshots keep their intrinsic proportions. Five owned products keep compact names, pairs, statuses, and stable targets. Polis, Funda, MidiFlow, and Patchbay show only their canonical name, a translated “Coming soon” status, and at most one short domain; identity pairs may stay. This applies to pages, metadata, and serialized translations. Keep Polis/Funda routes as minimal notices with back/contact links; publish no features, technical statuses, metrics, licences, source links, or case-study detail before release. The structural intro pins at `lg` only when the viewport is at least 760px tall. Doctrine keeps the short house thesis. Pane gaps are `clamp(4rem, 8vw, 9rem)`; vertical reading padding keeps angled edges clear of text. Contact joins the footer, with an ink copy region and a paper form region that reaches the right edge at `lg` and both edges below it. The contact copy is two ink blocks around the form in DOM order: title, intro, and the three prompts first; then the form; then an aside with reply time, email, phone, and the data note. Below `lg` they stack in that order so the first field follows the prompts; at `lg` grid areas put the aside under the copy in the ink column while the paper plane spans both rows. Two reveal groups in the copy and one in the aside, no per-line stagger. The form carries the only email fallback inside the paper plane; the aside carries the other.
- `<main>` on such a page must not create a stacking context (no `isolate`, no `z-index`, no `opacity`) or the ground paints over the footer, must not take a `transform` or a `filter` or the ground stops being fixed, and must carry no background of its own — the ground is what paints the paper.
- Spacing scale: 4 / 8 / 16 / 24 / 40 px
- Responsive behavior: single column below `lg`; asymmetric two-column grids at `lg`; below `lg` the header swaps its nav for a button that opens `MobileNav`, a React-state panel animated with `AnimatePresence`
- Empty/loading/error-state layout rules: keep the paper background, show ink text with a muted explanation; never blank white screens

## Color system

| Token | Value | Usage | Notes |
| --- | --- | --- | --- |
| `--paper` | `#f5f1eb` | Page/header/footer background | The only page background; no per-section off-whites |
| `--paper-raised` | `#fbf9f4` | Alternating section bands | Only alternate tone allowed |
| `--card` | `#ffffff` | Cards/panels on paper | Usually at 80–90% alpha over paper |
| `--ink` | `#0f1729` | All text, dark bands, primary buttons | Never mix with Tailwind slate-950 |
| `--ink-muted` | `#47536b` | Secondary text on paper | AA on both paper tones |
| `--accent` | `#0f766e` | Links, section labels, active states | The single working accent |
| `--line` | `rgba(15,23,41,.12)` | Hairlines/borders | |
| success `#15803d` / warning `#b45309` / danger `#be123c` | | Status only | |

Dark bands (ink background): body text `rgba(255,255,255,.78)` minimum, labels `rgba(255,255,255,.64)` minimum — never below (WCAG AA on `#0f1729`). `.tone-ink` also relights `--accent` to `#7cb8b1`: the paper teal is only 3.2:1 on ink, below AA for the accent links that appear on these bands. Same hue, same single working accent — only the value moves.

## Typography

- Primary font: Google Sans Flex (variable), loaded via Google Fonts
- Secondary/fallback font: Inter, Segoe UI, sans-serif; Geist Mono for numeric/technical fragments
- Role scale, top to bottom — every step changes at least two of size, weight, colour and case, so the ranking survives a squint:

  | Class | Role | Size | Weight | Colour |
  | --- | --- | --- | --- | --- |
  | `.type-display-xl` | the home claim, one per site | 48–88px | 600 | ink |
  | `.type-display` | the page claim, one per page | 38–58px | 600 | ink |
  | `.type-heading` | a section | 26–35px | 600 | ink |
  | `.type-subheading` | a named thing in a ledger row | 21–25px | 540 | inherits the band |
  | `.type-title` | a step, a clause, a card head | 17px | 600 | inherits the band |
  | `.type-body-lg` | the lead under a heading | 17–19px | 400 | `--ink-muted` |
  | `.type-body` | prose | 16px | 400 | `--ink-muted` |
  | `.type-body-sm` | secondary prose, notes, colophon | 15px | 400 | `--ink-muted` |
  | `.type-caption` | what a number counts, a field label | 14px | 500 | `--ink-muted` |
  | `.type-meta` | uppercase micro-label | 12.5px | 600 | `--ink-muted` |
  | `.type-section-label` | the accent kicker | 12.8px | 600 | `--accent` |
  | `.type-data` | figures, hashes, filenames, identifiers | inherits | inherits | inherits |

- Weight steps down as size steps down, display → subheading. `.type-title` is the one exception: at 17px it needs 600 to lead its paragraph. A heading lighter than the names under it makes a ledger read as a row of peers.
- Heading style: tracking −0.03 to −0.04em, weight 540–600, use the `.type-*` classes — never inline arbitrary heading sizes. −0.04em is the floor: past it letterforms stop holding their own shapes.
- Display is sized for a full-sentence headline, not a single word. Three lines of ~60 characters stay inside ~20vh at its ceiling. `.type-display-xl` is the one step above it, cut for the four-word home claim on one line (leading 1.0, measure 14ch) and used nowhere else.
- Body style: `.type-body` / `.type-body-lg`, line-height 1.62–1.7, `--ink-muted`
- Numeric/metric style: `.type-data` (`--font-mono`, tabular). Mono is the numeric and technical voice — figures, hashes, filenames, identifiers, bracketed literals. Never a costume for prose; keep it under ~15% of the text on a page.
- Uppercase is for short labels only. Anything with a verb in it is a `.type-caption`, not a `.type-meta` — uppercase strips the word shapes a reader navigates by, and it costs more the longer the run.
- Measure lives on the role, not on the page: each prose class carries its own `max-inline-size` in `ch`, so no component has to remember one. Do **not** reach for `max-w-2xl` / `max-w-3xl` on prose — 42rem at 15px is a 96-character line. A `max-w-*` utility is for a column that must be *narrower* than its role.

## Component rules

- Buttons: `TactileButton` only — pill radius, ink primary / white secondary / ghost; motion lift ≤ 2px
- Cards/panels: `.artifact-card` on paper; radius from the scale (`1rem` / `1.5rem` / `2rem`) — no in-between values
- Forms/inputs: white card surface, `--line` border, accent focus ring
- Navigation: sticky header on `--paper` with hairline; nav links `--ink-muted` → `--ink` on hover. On focus the ink ring is the only mark: the accent underline drops, because at `outline-offset: 4px` the two land on the same line
- Tables/lists: hairline separators, no zebra striping
- Modals/dialogs: card surface, radius `xl`, shadow-elevated
- Notifications/toasts: ink surface, white text
- Icons: Tabler icons, stroke ~1.75, sized 1em–1.25em
- Home panes: full-bleed opaque backgrounds with ends outside the viewport. No radius, enclosure border, shadow, or surface entrance fade. Use ink tone tokens only within ink regions; the contact form keeps paper-tone text, control borders, and accent. No `backdrop-filter`.
- Ground, live form (`VectorGround`, WebGL2, motion allowed): one short `--ink` line pinned to every vertex of an 18px grid at the 15° screen angle, each turned perpendicular to the pointer so the field reads as rings around the hand; the pointer settles rather than snaps, and drifts on its own after two seconds still or on a coarse pointer. Scroll moves the field through four states keyed to two `.ground-band` viewports of open paper (`data-ground-key="mark"` between Selected work and What we build, `"land"` before Contact): flat grid → the mark as a hatched plate in three dimensions → a sparse field through depth with perspective, scroll parallax, and pointer parallax → the outline of Istria as a plate. Lines stay at 30% ink in the field and never sit behind pane type; the plates tilt with the pointer. Istria's outline is traced from the public-domain Natural Earth coastline and needs no credit.
- Ground, still form: `.ground` — fixed, `--paper` base, two dot layers of the site's own screen. This is what reduced motion, missing WebGL2, and a lost context show. Near: 9px cell, `--ink` at 16%, rotated 15° (the shader's angle). Far: 27px cell, larger softer dots, `--ink` at 8%, rotated −8° so the two grids do not beat against each other. Both layers are 200vmax squares centred on the viewport, so no travel can bring an edge into view
- Home evidence: three image-led previews for Velum, Voyager, and AstyleMarine on continuous paper, all visible without tabs. Each entry is one locale-aware link to its own showcase, with a name, one concrete purpose line, and a visible “View project” affordance. Screenshots supply color; no raised-card chrome or hover-only information. Preserve intrinsic capture ratios, responsive sizes, lazy loading below the fold, alt text, and a visible focus ring. The pair ribbon links to stable `#system-0` through `#system-4` targets and `#for-businesses` at selected work; each link names its destination (the product name or the selected-work label as a `.pair-ribbon-name` micro-label) before the pair mark, so the accessible name starts with where it goes. Target, hover, and focus extend a hairline, not a surface.
- Pair marks: `PairMark` (`.pair-mark`) draws the two sides a product sits between — two `.type-artifact` words on a hairline with a solid accent node at the midpoint. Every pair on the site uses it; never a pill, never a card

## Motion and interaction

- Motion personality: restrained, functional, orientation-focused
- Duration range: 180–500ms for UI transitions. Brand-mark motion is exempt: the
  header mark's compose entrance (620ms), its ambient tilt loop (4.8–7.2s), and its
  spring interactions (650–800ms, sampled linear() curves) run longer by design.
  The ground's ambient motion also runs longer:
  - Ambient drift: the near dots travel 8 cells across and 4 down over 48s, the
    far dots 2 across and 3 up over 90s, both `linear` and infinite. The travel is
    an exact multiple of the cell in the layer's own rotated coordinates, so the
    loop returns to itself with no seam. `translate` only — never
    `background-position`, which is paint, not compositing.
  - Anchor scrolls are smooth only without a reduced-motion preference; `prefers-reduced-motion: reduce` sets `scroll-behavior: auto` on the root, so ribbon and contact links jump.
  - Scroll parallax: `animation-timeline: scroll(root)` moves the near field
    `−70vh` and the far field `−35vh` over the whole document. No scroll listener
    anywhere. Browsers without scroll-driven animations get a still ground with
    its drift, and nothing is faked in JavaScript to make up for it.
  - Panes scroll with the document and stay opaque. No shared rise or fade on
    whole surfaces; the ground supplies the relative movement.
  - Pointer travel: one passive rAF-throttled `pointermove` listener writes two
    normalised scalars; the near field answers by ±12px and the far by ±5px. It
    is the only JavaScript in the ground, and it does nothing on a coarse pointer.
  - Reduced motion: drift, parallax, and pointer travel stop. The ground is one
    still field and every pane stays in place.
- Home interactions: project previews are ordinary links, with no selector or capture animation. Product rules extend over 220ms on hover/focus/target, immediately under reduced motion. No JavaScript scroll handler.
- Easing: ease-out / gentle springs (stiffness ≈ 420, damping ≈ 34)
- What should animate: section reveals (FadeIn), tab continuity (layout spring), CTA feedback
- What should not animate: core reading layout, trust/proof content, essential navigation, reduced-motion experiences
- Reduced-motion expectations: replace movement with static state or opacity; a shader draws one still frame and starts no loop

## Imagery and media

- Image style: the live halftone screen (hero only), interface diagrams (SystemMap), proof panels, document/place/workflow motifs; no generic AI gradients or robot imagery
- Illustration style: diagrammatic — nodes, hairline connectors, state badges
- Iconography style: Tabler, outline
- Screenshot/product-frame treatment: actual-project previews and their showcases are unframed and square-edged, with captions on paper. Other evidence routes retain their existing frame treatment.
- Video/animation treatment: only when it demonstrates an interface behavior

## Content design

- Tone: confident, concrete, systems-literate; talk about the reader's system, not our cleverness
- Present a studio portfolio: projects, what we make, and contact. About stays a short studio introduction with location and contact, not a biography or registry ledger. Do not repeat studio-size explanations or imply staff numbers. Keep legal company, representative, registry, activity, VAT and privacy information in the footer-linked Imprint and structured identity.
- CTA style: verbs about the system — "Start a system review", "Bring us the messy system"
- Terminology: interface, operating layer, orientation, proof, source-aware
- Error message style: state what happened, what is known, and the next action
- Things to avoid: exclamation marks, "revolutionary/magical", unexplained AI claims

## Accessibility requirements

- Contrast: WCAG AA minimum everywhere, including on dark bands (see color table floors)
- Keyboard/focus behavior: visible focus (`outline-offset: 4px` ink outline) on every stop; tabs support arrow/Home/End keys. Never `outline-none` on a focusable control — in Tailwind v4 it sets `--tw-outline-style: none`, which a later `focus-visible:outline` reads back, and the ring cancels itself
- Skip link: `.skip-link` is the first tab stop on every page — parked off-screen, a paper pill on the header band when focused, pointing at `#main-content`
- Reduced motion: honored in every animated component and shader; a canvas surface also pauses offscreen and with the tab
- Captions/alt text: meaningful alt for informative images, `aria-hidden` for decorative surfaces
- Minimum readable sizes: 0.78rem, and only for uppercase tracked labels (`.type-meta`, `.type-section-label`). Sentence-case text bottoms out at `.type-caption`, 0.875rem.

## Design do / don't

### Do

- Use the token variables (`--paper`, `--ink`, `--accent`, `--line`) — never re-hardcode hexes in components
- Route all type through the `.type-*` classes
- Alternate paper/paper-raised/ink bands to create rhythm
- Give the halftone a job: make it respond to something real, and keep it out from behind type

### Don't

- Don't introduce Tailwind gray/slate text colors alongside ink tokens
- Don't add new radii, off-white backgrounds, or accent colors
- Don't put animated shaders behind body text — the hero screen is allowed because its mask keeps it off the measure entirely
- Don't make every section a card grid — vary the form (band, ledger, diagram, steps)
- Don't put type on the ground: homepage text sits on continuous opaque panes. Never turn these panes back into bounded cards.

## Subsystem design extensions

Subsystem-specific design files may extend this document, but should not contradict it.

- HyperFrames/media: `hyperframes/docs/DESIGN.md`
- Web/app-specific extensions: `apps/web/src/app/globals.css` is the token implementation
- Docs/marketing-specific extensions:

## Agent instructions

When changing UI, visual assets, product copy, documentation presentation, marketing pages, or media:

1. Read this file first.
2. Reuse existing components, tokens, and patterns before inventing new ones.
3. Preserve visual consistency unless the user explicitly requests a design-system change.
4. Update this file when making intentional design-system changes.
5. If a subsystem has its own `DESIGN.md`, treat this root file as the upstream contract and the subsystem file as a specialization.
6. Mention design-impacting changes in task notes, PRs, commits, or handoffs.
