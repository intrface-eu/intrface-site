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
  black: "#000000"
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
- Primary promise: Interfaces for the world — products of our own (Voyager, AgroPulse, Radio, PatchBay, Polis and midiflow open now; Index and Funda coming soon) and client work. Internal delivery rules, agent orchestration, and AOC are not public marketing content.
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
3. Atmosphere supports meaning: the halftone is a print-inspired landmark, and it has to resolve into something. On the about page it is the ground of the space: one fixed field the page stands on (`Ground`), gathering into Istria at the land band. Home has no ground: it is paper, the veil and the work. A halftone that fills a corner is wallpaper; never that. Where type sits on the ground, the ground quiets its lines under it (`data-ground-quiet`).
4. One paper, one ink, one accent: warm paper `#f5f1eb` everywhere but home, which is true black (`--black`, `#000`) down to the footer; ink `#0f1729` for text and dark bands, teal `#0f766e` as the single working accent. One print red `#b91c1c` sits outside that count as a spot colour with a single job: the X the ground draws on Vrsar, and nothing else. It never appears in the UI — not as a link, a status, an error, a border, or a hover — and it is a mark, not text, so 3:1 on paper is its bar.

## Layout system

- Density: generous; sections breathe with `py-20 sm:py-28`
- Grid/container rules: `.section-shell` — `min(100%, 80rem)` centered, `px-6/8/10` responsive
- **Home: one sentence over our products (revision 11, 2026-10-30; six products since revision 12, 2026-11-12).** `HomePage` renders `Veil` (the first screen, black, the logo and the sentence) and `HomeInterfaces`; the footer comes from the layout and is paper. No header, no ground, no heading over the work, no badge, no count. docs/home-grid-contract.md is the detailed contract; where the veil and footer rules below still describe the bento (revisions 6 to 10), the contract wins.
  - The veil (`.home-veil`) is one layer over the top of the page, `100svh` + `--veil-fade` (60svh) tall: `--black`, solid through the whole first viewport, then fading to nothing over the fade band in one linear gradient with eased stops. At scroll 0 the screen is black with only the mark and the sentence. On its solid band, and only there, sit the maker's mark (top-left) and the one sentence (`HomeGrid.common.claim`, the page's `<h1>`, `.type-display` in `--ink-inverse`, left aligned in `.section-shell`, in the upper half of the viewport, never hyphenated). The sentence cycles through the owner's rotation (revision 7, 2026-09-27): English, Croatian, Istroveneto and Istrian Chakavian, in that order, starting from the page's own. Italian (revision 8, the fifth locale, formal, for business clients in Italy) is not in the rotation: on `/it` the Italian line comes first, then English, Croatian, Istroveneto and Chakavian, then Italian again; no other page shows it. The page's lines (four, or five on `/it`), each with its `lang`, share one grid cell, so the block keeps the height of the tallest line in that page's cycle; assistive tech reads only the page locale's line. Under the sentence, one quiet link in the language of the line shown (`HomeGrid.common.switchLocale`, "Continue in English") switches the site to that language; while the page's own line shows, its slot stays empty at the same height. Under reduced motion the page's line stays and the links to the other languages of its cycle (three, or four on `/it`) sit in one row. On hover with a mouse, or with keyboard focus inside, a previous and a next arrow button fade in around the sentence (see Language arrows); a touch screen shows none and switches on a horizontal swipe. No other button, scroll hint, status or second sentence.
  - The interfaces (`HomeInterfaces`, `.ifaces.ifaces--home`, a `<section>` labelled `HomeGrid.common.gridLabel`, "Work by INTRFACE"): on paper, one `InterfaceRow` per product that opens without signing in, in this order: Voyager (the lead, screens across the width, a screen tall), AgroPulse, Radio, PatchBay, Polis, midiflow, screens alternating sides. Each row is a desktop capture with a phone over its near corner, the name, the status ("Live", or "Public test" for Polis with its synthetic-data note), one line and "Open {name}" to the product root in `PRODUCT_ROOTS`, in the same tab; Voyager adds a quieter "Open the Vrsar atlas". From 1024px the rows after the lead are about half a screen tall (a 2:1 frame on the desktop capture, a smaller phone, a shorter gap). The last block, `.iface-door`, "We build these for clients too.", shows Velum and AstyleMarine and links to `/services`. Index and Funda are not on home; they are on `/work` as "Coming soon".
- **Disclosure.** The approved name, spelling, status and one line of each product are the table in docs/site-revamp-contract.md (2026-11-12): Voyager, AgroPulse, Radio ("INTRFACE Radio" in alt text and metadata), PatchBay (never "Patchbay"), midiflow (lowercase) and Polis (public test, with "A public test with synthetic data. No municipality uses Polis yet."). No user numbers, adoption, partners, prices, latency or other claims; no open-source claim or repository link for Polis. Funda and Index show only their name, a translated "Coming soon" and one short line; Funda keeps its minimal notice at `/work/funda`. Index (owner ruling 2026-09-29) gets a full About page hosted here at `/en/index` ("What is Index?"), English only (the other locales redirect with 307, the sitemap lists the English page alone, no hreflang), with no link to its own address, no sign-in, no request for access, no source link, no numbers or users. PatchBay's page here was removed on 2026-11-12: `/<locale>/patchbay` redirects to `https://patchbay.city/`.
- **Panes (about).** The fixed ground sits behind continuous surfaces whose ends extend beyond the viewport (`.home-pane::before` runs `8vw` past each edge; only its background may skew, the text stays level in `.section-shell`). `.home-planes` clips that overhang without becoming a scroll container, and Ground remains its sibling. No bounded information cards, rounded section corners, boxed borders, or card shadows. The `home-` class names predate the grid; about is their only user now.
- **History.** Until 2026-09-25 home was a stack of panes: a hero sheet with the claim and two buttons, a sloped pair ribbon, a selected-work pane, an ink product ledger, a doctrine pane, a contact close with a form, and a ground band where "From here / to the world" came out of the X. From 2026-09-25 to 2026-09-26 it was a grid of cells with sloped cuts on the WebGL ground, a fixed corner mark and a rotating work cell. On 2026-09-26 (revisions 1 to 3) it was a grid of eight working interface fragments in plain cells that opened in place over the page on `/#slug`, the last of them under the veil. The owner retired them the same evening: they approximated the products, and home now shows the real work. Revision 4 stacked three whole screenshots in one column under a veil that lifted with a scroll-driven animation; revision 5, the same night, made them a full-screen bento of four with Polis, pinned until the veil has gone; revision 6 made it six tiles with AgroPulse and Patchbay, logos in the captions and screenshots dimmed at rest; revision 10 (2026-09-29) made it five tiles of our own products (Voyager, Index, Polis, AgroPulse, Patchbay), each opening its product in the same tab. All of the fragment work is gone, with its CSS, components and messages; `ContactForm` and its server action stay in the tree unused. Rules below that mention those panes are superseded by the home rules above.
- **About, five moves.** The same ground and panes, in five: the claim, with the field under it (`.hero-sheet`); the person — a large portrait plate that crosses the pane edge at `lg`, the name, and a short first-person paragraph beside it; the manifesto (2026-10-02, owner's text, `About.manifesto`, `.about-manifesto`) — its title as the kicker, the opening pair at `.type-heading`, the body in an offset column from `lg` (columns 5–12) at `.type-body-lg`, the stanzas kept as broken lines in ink, the owner's bold lines heaviest ("Context → intent → interface." at subheading size, the closing couplet at heading size), never a card or a list; it sits before the land band because its last line hands over to the map; one `data-ground-key="land"` band where the map gathers and marks Vrsar, with no phrases, caption or label; and a close of one sentence and two buttons. No studio blurb, no product list, no contact form. The band comes before the footer in the document, so on about the ground keys the land from the band, and the field runs contour → land → contour.
- `<main>` on a page with the ground (about) must not create a stacking context (no `isolate`, no `z-index`, no `opacity`) or the ground paints over the footer, must not take a `transform` or a `filter` or the ground stops being fixed, and must carry no background of its own — the ground is what paints the paper.
- Spacing scale: 4 / 8 / 16 / 24 / 40 px
- Responsive behavior: single column below `lg`; asymmetric two-column grids at `lg`; below `lg` the header swaps its nav for a button that opens `MobileNav`, a React-state panel animated with `AnimatePresence`. The home page has no header at any width (`HeaderGate`).
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
  | `.type-display-xl` | unused since the grid replaced the home claim | 48–88px | 600 | ink |
  | `.type-display` | the page claim, one per page (on home, the sentence on the veil, in `--ink-inverse`) | 38–58px | 600 | ink |
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
- Display is sized for a full-sentence headline, not a single word. Three lines of ~60 characters stay inside ~20vh at its ceiling. `.type-display-xl` is the one step above it, cut for the four-word home claim on one line (leading 1.0, measure 14ch). The grid retired that claim, so nothing uses it now.
- Body style: `.type-body` / `.type-body-lg`, line-height 1.62–1.7, `--ink-muted`
- Numeric/metric style: `.type-data` (`--font-mono`, tabular). Mono is the numeric and technical voice — figures, hashes, filenames, identifiers, bracketed literals. Never a costume for prose; keep it under ~15% of the text on a page.
- Uppercase is for short labels only. Anything with a verb in it is a `.type-caption`, not a `.type-meta` — uppercase strips the word shapes a reader navigates by, and it costs more the longer the run.
- Measure lives on the role, not on the page: each prose class carries its own `max-inline-size` in `ch`, so no component has to remember one. Do **not** reach for `max-w-2xl` / `max-w-3xl` on prose — 42rem at 15px is a 96-character line. A `max-w-*` utility is for a column that must be *narrower* than its role.

## Component rules

- Buttons: `TactileButton` only — pill radius, ink primary / white secondary / ghost; motion lift ≤ 2px
- Cards/panels: `.artifact-card` on paper; radius from the scale (`1rem` / `1.5rem` / `2rem`) — no in-between values
- Forms/inputs: white card surface, `--line` border, accent focus ring
- Navigation: sticky header on `--paper` with hairline on every page but home, where `HeaderGate` renders nothing and the maker's mark on the veil stands in; nav links `--ink-muted` → `--ink` on hover. On focus the ink ring is the only mark: the accent underline drops, because at `outline-offset: 4px` the two land on the same line
- Tables/lists: hairline separators, no zebra striping
- Modals/dialogs: card surface, radius `xl`, shadow-elevated
- Notifications/toasts: ink surface, white text
- Icons: Tabler icons, stroke ~1.75, sized 1em–1.25em
- Veil (`Veil`, `.home-veil`, home only): see Layout. It takes no pointer events except on its solid band (a transparent `::before` over the first `100svh`), the maker's mark and the sentence block, so where it has faded a click, a touch or a wheel reaches the tile under it, and a swipe on the black scrolls the page.
- Interface row (`InterfaceRow`, `.iface-row`, home and `/services`): see The interfaces in docs/home-grid-contract.md. `/work` lists the same products quieter (`.work-list`): a small desktop capture, the name, the status, the line and "Open {name}", no phone, no bleed, no motion; then Index and Funda as text with "Coming soon"; then Velum and AstyleMarine (`ProjectPreviews`). Short routes `/<locale>/<key>` for every key in `PRODUCT_ROOTS` (voyager, agropulse, radio, patchbay, polis, midiflow) redirect (307) to the product root and stay out of the sitemap.
- Language arrows (`ClaimCycle`, `.home-veil__arrow`, home only, owner request 2026-09-28): two `<button>`s, 44px circles with a 1px `--ink-inverse` edge at 28% and a Tabler `IconArrowLeft` / `IconArrowRight` (20px, stroke 1.5) in `--ink-inverse-muted`; hover brings the edge to 64% and the icon to `--ink-inverse`, focus draws the 2px `--ink-inverse` ring at 4px offset. Named in the page's language (`HomeGrid.common.prevLanguage` / `nextLanguage`). They fade in (240ms) while a mouse is over the sentence block or keyboard focus is inside it, and are vertically centred on the sentence: from 1400px they flank it, the previous one in the shell's gutter; from 640 to 1399px they sit together just right of the sentence; below 640px (a mouse on a narrow window, a keyboard on a phone) at the end of the link row. None on touch screens or under reduced motion.
- Language link (`ClaimCycle`, `.home-veil__switch-link`, home only): a next-intl `Link` to `/` in the language of the line above it, `.type-caption` in `--ink-inverse-muted` with a 1px underline at half strength; hover brings it to `--ink-inverse`, focus draws a 2px `--ink-inverse` ring at 4px offset. It fades with its line and is focusable only while visible; focusing it holds the cycle.
- Locale switcher (footer): a native select listing each language by its own name (English, Hrvatski, Italiano, Istrovèneto, Čakavski, in routing order; `LOCALE_ENDONYMS`, never translated).
- Maker's mark (`MakerMark`, home only): `AnimatedMark` and the word "intrface" in `--paper`, top-left on the veil's solid band, linking home. It scrolls away with the veil; nothing on home is fixed. No header band. The locale switcher is in the footer; the sentence's link on the veil is the only other way to change language.
- Footer on home: black, by CSS alone. `body:has(.home-stage) .site-footer` redefines `--paper` (black), `--ink` (opaque `#ebebeb`, since the signature's ink must not let its stroke show through), `--ink-muted`, `--line` and `--accent` (`#7cb8b1`, 9.4:1) and sets `color-scheme: dark` for the locale menu. Every other page keeps the paper footer.
- Footer: one short block over the inked signature wordmark: `INTRFACE · Vrsar, Croatia`, the tagline, contact (email and phone, `id="contact"`), GitHub, Imprint, Privacy, Terms, the locale switcher, and © year. No link groups, no form, no second sentence. It takes its natural height and never keys the ground (about keys its own land band). Where the ground runs, it quiets its lines only under the three text blocks.
- Ground, live form (`VectorGround`, WebGL2, motion allowed): a field of short `--ink` lines, one per vertex of an 18px grid, each turned to point at the pointer so the field reads as rays into the hand; the pointer settles rather than snaps, and drifts on its own after two seconds still or on a coarse pointer. Scroll moves the field through its states keyed to the element a page marks `data-ground-key="land"`: a contour map, each line lying along the isoline of a height map that scroll shifts, strong on a contour level and faint between, with a hill under the hand the contours ring → the outline of Istria as a plate → the contour map again. The ground runs on about only, where the key is the land band. No page keys the mark plate (`data-ground-key="mark"`) today; the shader keeps it, and the current (streamline) kind, off the sequence. About a third of the lines never join a plate; they stay in the field behind it so a gathering keeps its depth. Lines never sit at full strength behind type; the plates tilt with the pointer. Istria's outline is traced from the public-domain Natural Earth coastline and needs no credit. The land plate carries the site's one mark: a red X on Vrsar, snapped to the smoothed outer contour at the plate's top face so it sits on the coast and not in the hatch, drawn by about four dozen lines taken from the pool that would otherwise join the plate and set out late, so the X lands after the coast has settled. Once there they hold their stroke — the pointer turns the plate, never these lines — and they are the only red on the site. The ground sets `data-ground-x` on the keyed element when the X has arrived; nothing is drawn from it now (the "From here / to the world" phrases are retired). Under reduced motion or without WebGL2, where the ground never activates, the X does not exist. While it runs, the ground gives up its own paper (the body's paper is the floor), about's paper panes give up their slabs so the copy sits on the ground, and the ground quiets its lines to about a tenth within a soft margin of every block marked `data-ground-quiet`. Content has weight in the open field: each marked block pulls the lines toward it and turns them along its edges in the contour map; the plates are left alone. When the hand is still for two seconds, or on a coarse pointer, each line turns at its own rate, a share of them in 45° steps, so the ground looks busy rather than waiting.
- Ground, still form: `.ground` — fixed, `--paper` base, two dot layers of the site's own screen. This is what reduced motion, missing WebGL2, and a lost context show. Near: 9px cell, `--ink` at 16%, rotated 15° (the shader's angle). Far: 27px cell, larger softer dots, `--ink` at 8%, rotated −8° so the two grids do not beat against each other. Both layers are 200vmax squares centred on the viewport, so no travel can bring an edge into view

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
- Home scroll: no sticky stage and no JavaScript. The one motion: as a row comes into view its desktop screen settles from 3rem below and the phone from 7rem (CSS scroll-driven, `animation-timeline: view()`, transform only, behind `@supports` and `prefers-reduced-motion: no-preference`); without support or under reduced motion they sit in place.
- Home sentence (owner request 2026-11-10, "more creative"): each line is words in masks (inline-blocks that never break, so lines wrap where the plain text does); the word for technology is also split into letters. A plain word rises into its mask. The technology letters mesh in, alternately from below and above, and stand dimmed at 38%; the word for meaning arrives last, slower, fading up; then light passes from it into the technology word letter by letter until both stand at full strength: technology given meaning. `<tech>` and `<meaning>` tags in each locale's message mark the two words, so the motion follows the meaning in every language. Transform and opacity only, no filter or blur. A line lands in about 2.2s and holds 3.4s. A switch asked for mid-flight takes over from wherever each part is. The cycle pauses under a mouse, with keyboard focus inside, in a hidden tab and off screen. Like the mark's loops, it runs longer than UI transitions by design. Under reduced motion none of it runs. See docs/home-grid-contract.md.
- Home interactions: none beyond the links and the sentence's language controls, Left/Right keys and swipe. No in-place expansion, no hash handling, no hover motion on the rows. Showcase pages lead back with "Back to home" (`HomeGrid.common.backToGrid`) to `/`.
- Easing: ease-out / gentle springs (stiffness ≈ 420, damping ≈ 34)
- What should animate: section reveals (FadeIn), tab continuity (layout spring), CTA feedback
- What should not animate: core reading layout, trust/proof content, essential navigation, reduced-motion experiences
- Reduced-motion expectations: replace movement with static state or opacity; a shader draws one still frame and starts no loop

## Imagery and media

- Image style: the ground (a live line field, with a halftone dot field as its still form), interface diagrams (SystemMap), proof panels, document/place/workflow motifs; no generic AI gradients or robot imagery
- Illustration style: diagrammatic — nodes, hairline connectors, state badges
- Iconography style: Tabler, outline
- Screenshot/product-frame treatment: actual-project previews and their showcases are unframed and square-edged, with captions on paper. Other evidence routes retain their existing frame treatment.
- Video/animation treatment: only when it demonstrates an interface behavior

## Content design

- Tone: confident, concrete, systems-literate; talk about the reader's system, not our cleverness
- Home says one sentence, then shows the work as it is, linking to it: the sentence on the veil ("Giving technology meaning.", in each language of the page's cycle in turn, with a link to continue in the one shown), then real screenshots of each of our products that open without signing in (Voyager, AgroPulse, Radio, PatchBay, Polis, midiflow) with its name, its status and one line, each opening the product in the same tab, and last the door to client work. `/work` is the full list: those six, then Index and Funda as "Coming soon", then Velum and AstyleMarine. The footer carries the name, the place, the tagline and the channels. About is the person, the stance and the place: a short first-person text from Alex Bašić beside the portrait, the owner's manifesto, the map with the X on Vrsar, and one close to work and contact; no product list, no contact form, no registry ledger. Do not repeat studio-size explanations or imply staff numbers. Keep legal company, representative, registry, activity and VAT information in the footer-linked Imprint and structured identity; the privacy policy (`/privacy`, with the stable `#data-deletion` anchor Meta links to) and the terms of use (`/terms`) are footer-linked pages on the Imprint's layout.
- CTA style: verbs about the system — "Start a system review", "Bring us the messy system"
- Terminology: interface, operating layer, orientation, proof, source-aware
- Error message style: state what happened, what is known, and the next action
- Things to avoid: exclamation marks, "revolutionary/magical", unexplained AI claims

## Accessibility requirements

- Contrast: WCAG AA minimum everywhere, including on dark bands (see color table floors)
- Keyboard/focus behavior: visible focus (`outline-offset: 4px` ink outline) on every stop; tabs support arrow/Home/End keys. Never `outline-none` on a focusable control — in Tailwind v4 it sets `--tw-outline-style: none`, which a later `focus-visible:outline` reads back, and the ring cancels itself
- Skip link: `.skip-link` is the first tab stop on every page — parked off-screen, a paper pill at the top of the viewport when focused (on the header band where there is one), pointing at `#main-content`
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
- Don't put animated shaders behind body text; the ground quiets its lines under every marked block
- Don't make every section a card grid — vary the form (band, ledger, diagram, steps)
- Don't put reading text on the ground without `data-ground-quiet`, and never turn the about panes back into bounded cards. Home tiles sit on black, not the ground, and each is the work's screenshot, not a card around a description.

## Subsystem design extensions

Subsystem-specific design files may extend this document, but should not contradict it.

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
