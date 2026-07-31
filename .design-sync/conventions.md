# Building with the INTRFACE system

One paper, one ink, one accent. Warm paper `#f5f1eb`, ink `#0f1729`, teal `#0f766e` — no
second accent, no grey scale borrowed from a framework. The look is a printed document,
not an app chrome: hairlines instead of cards, bands instead of boxes.

## Setup

**No provider, no theme context.** Every component here renders from props alone — mount
one and it is styled. What it does need is `styles.css`: it carries the tokens, the type
roles, the utility classes and the `@font-face` rules, and it binds the two font
variables the faces resolve through. Load it once at the root.

```jsx
import { CaseSection, StatBand, TactileButton } from '<this design system>'

<main className="bg-paper text-ink">
  <CaseSection label="Method" title="How we work is written down." tone="paper">
    <StatBand stats={[{ value: '13', label: 'Projects on the same written rules' }]} />
    <TactileButton className="mt-8" href="/work">See the work</TactileButton>
  </CaseSection>
</main>
```

## The styling idiom

Tailwind utilities for layout, **named classes for type and for bands**. Never set a font
size, weight or colour with a utility — pick the role instead. That is what keeps a page
rankable at a squint.

| Concern | Vocabulary |
|---|---|
| Type roles | `type-display` `type-heading` `type-subheading` `type-title` `type-body-lg` `type-body` `type-body-sm` `type-caption` `type-meta` `type-section-label` |
| Mono | `type-data` (figures, hashes, filenames, at whatever size it sits in) · `type-artifact` (a chip-scale literal, sized) |
| Bands | `tone-paper` `tone-raised` `tone-ink` — alternate them; never two of the same in a row |
| Shell | `section-shell` (centred `min(100%, 80rem)` with responsive gutters) |
| Colour | `bg-paper` `bg-paper-raised` `bg-card` `bg-ink` `text-ink` `text-ink-muted` `text-accent` `text-white` `border-rule` `border-rule-control` `text-danger` |
| Panels | `interface-panel` `interface-node` (the diagram surfaces) · `stat-ledger` (the figure grid) |
| Tokens | `var(--paper)` `var(--ink)` `var(--ink-muted)` `var(--accent)` `var(--line)` `var(--radius-md\|lg\|xl)` `var(--shadow-surface\|elevated)` |

Three rules that are easy to break:

- **Measure lives on the role.** `type-body` already carries its own `max-inline-size` in
  `ch`. Add `max-w-*` only when a column must be narrower than the role's own measure.
- **Uppercase is for short labels only** — `type-meta` and `type-section-label`. Anything
  with a verb in it is a caption, not a label.
- **Mono is the numeric and technical voice**, not a costume for prose: figures, hashes,
  filenames, identifiers, bracketed literals. Under ~15% of a page's text.

On an ink band the text floors switch automatically (`--ink-inverse*`); write `text-ink`
inside `tone-ink` and it resolves to the inverted floor, so contrast holds without a
second palette.

## Where the truth is

- `styles.css` and its imports — the tokens, the ten type roles and every utility class
  named above, as compiled. Read it before inventing a class.
- `components/<group>/<Name>/<Name>.d.ts` — the prop contract, with the JSDoc the
  component's author wrote. `<Name>.prompt.md` sits beside it with usage.

## What is not here

The page shells (`HomePage`, `WorkIndexPage`, …), the header, the footer, the contact
form and `HonestNote` read their copy from next-intl and cannot render outside a locale
request, so they are not in this system. Compose their equivalents from `CaseSection`,
`StatBand` and the ledgers.

Two components ship without an authored preview: `MobileNav` (its toggle only exists
below the `lg` breakpoint) and `LiveSiteRow` (it builds capture paths that resolve only
on the site). Both import and render normally.
