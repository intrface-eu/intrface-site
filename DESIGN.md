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
  display:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(2.85rem, 7vw, 5.15rem)"
    fontWeight: "600"
    lineHeight: "0.98"
    letterSpacing: "-0.055em"
  heading:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 3.1rem)"
    fontWeight: "550"
    lineHeight: "1.06"
    letterSpacing: "-0.04em"
  body-md:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.7"
  label:
    fontFamily: "Google Sans Flex, Inter, sans-serif"
    fontSize: "0.8rem"
    fontWeight: "700"
    lineHeight: "1"
    letterSpacing: "0.16em"
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
- Primary promise: Intrface builds the software, and the system that builds the software — client work in Istria, three platforms of its own, one open-source delivery pipeline
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
3. Atmosphere supports meaning: the CMYK halftone shader and grain are print-inspired landmarks — used sparingly, never as wallpaper behind reading content.
4. One paper, one ink, one accent: warm paper `#f5f1eb` everywhere, ink `#0f1729` for text and dark bands, teal `#0f766e` as the single working accent.

## Layout system

- Density: generous; sections breathe with `py-20 sm:py-28`
- Grid/container rules: `.section-shell` — `min(100%, 80rem)` centered, `px-6/8/10` responsive
- Spacing scale: 4 / 8 / 16 / 24 / 40 px
- Responsive behavior: single column below `lg`; asymmetric two-column grids at `lg`; header collapses nav into a details-based menu below `lg`
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

Dark bands (ink background): body text `rgba(255,255,255,.78)` minimum, labels `rgba(255,255,255,.64)` minimum — never below (WCAG AA on `#0f1729`).

## Typography

- Primary font: Google Sans Flex (variable), loaded via Google Fonts
- Secondary/fallback font: Inter, Segoe UI, sans-serif; Geist Mono for numeric/technical fragments
- Heading style: tight tracking (−0.04 to −0.055em), weight 550–600, use `.type-display` / `.type-heading` — never inline arbitrary heading sizes
- Body style: `.type-body` / `.type-body-lg`, line-height 1.7, `--ink-muted`
- Numeric/metric style: `--font-mono`, tabular where available
- Line-height/measure notes: body measure ≤ ~65ch (`max-w-2xl`/`max-w-3xl`)

## Component rules

- Buttons: `TactileButton` only — pill radius, ink primary / white secondary / ghost; motion lift ≤ 2px
- Cards/panels: `.artifact-card` on paper; radius from the scale (`1rem` / `1.5rem` / `2rem`) — no in-between values
- Forms/inputs: white card surface, `--line` border, accent focus ring
- Navigation: sticky header on `--paper` with hairline; nav links `--ink-muted` → `--ink` on hover
- Tables/lists: hairline separators, no zebra striping
- Modals/dialogs: card surface, radius `xl`, shadow-elevated
- Notifications/toasts: ink surface, white text
- Icons: Tabler icons, stroke ~1.75, sized 1em–1.25em

## Motion and interaction

- Motion personality: restrained, functional, orientation-focused
- Duration range: 180–500ms for UI transitions. Brand-mark motion is exempt: the
  header mark's compose entrance (620ms), its ambient tilt loop (4.8–7.2s), and its
  spring interactions (650–800ms, sampled linear() curves) run longer by design.
- Easing: ease-out / gentle springs (stiffness ≈ 420, damping ≈ 34)
- What should animate: section reveals (FadeIn), tab continuity (layout spring), CTA feedback, the hero halftone
- What should not animate: core reading layout, trust/proof content, essential navigation, reduced-motion experiences
- Reduced-motion expectations: replace movement with static state or opacity; set shader speed to 0

## Imagery and media

- Image style: CMYK halftone landmark fields (hero only), interface diagrams (SystemMap), proof panels, document/place/workflow motifs; no generic AI gradients or robot imagery
- Illustration style: diagrammatic — nodes, hairline connectors, state badges
- Iconography style: Tabler, outline
- Screenshot/product-frame treatment: white card frame, hairline border, `--shadow-elevated`
- Video/animation treatment: only when it demonstrates an interface behavior

## Content design

- Tone: confident, concrete, systems-literate; talk about the reader's system, not our cleverness
- CTA style: verbs about the system — "Start a system review", "Bring us the messy system"
- Terminology: interface, operating layer, orientation, proof, source-aware
- Error message style: state what happened, what is known, and the next action
- Things to avoid: exclamation marks, "revolutionary/magical", unexplained AI claims

## Accessibility requirements

- Contrast: WCAG AA minimum everywhere, including on dark bands (see color table floors)
- Keyboard/focus behavior: visible focus (`outline-offset: 4px` ink outline); tabs support arrow/Home/End keys
- Reduced motion: honored in every animated component and shader
- Captions/alt text: meaningful alt for informative images, `aria-hidden` for decorative surfaces
- Minimum readable sizes: 0.78rem, and only for uppercase tracked labels

## Design do / don't

### Do

- Use the token variables (`--paper`, `--ink`, `--accent`, `--line`) — never re-hardcode hexes in components
- Route all type through the `.type-*` classes
- Alternate paper/paper-raised/ink bands to create rhythm
- Let the hero halftone be visible; wash only enough for headline legibility

### Don't

- Don't introduce Tailwind gray/slate text colors alongside ink tokens
- Don't add new radii, off-white backgrounds, or accent colors
- Don't put animated shaders behind body text
- Don't make every section a card grid — vary the form (band, ledger, diagram, steps)

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
