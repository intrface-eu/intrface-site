# Intrface Site PRD (RPG)

---

## Problem Statement
Intrface is building multiple serious products—AOC, Voyager, Funda, and supporting platform infrastructure—but currently lacks a coherent public-facing website that explains who Intrface is, how these products relate, and why the portfolio matters. Existing material is distributed across engineering READMEs and internal project repositories, which are useful for developers but not suitable for partners, early customers, collaborators, or press.

The core problem is not simply "we need a website." The problem is that Intrface lacks a clear external narrative layer. Without that layer, the portfolio looks fragmented, product value is hard to understand quickly, and it is difficult to convert attention into meaningful next steps such as partnership inquiries, demos, recruiting, or product exploration.

Success requires a brand and portfolio site that presents Intrface as an AI-native product studio/platform company, gives flagship products clear product narratives, and establishes a scalable foundation for future product pages, updates, and ecosystem storytelling.

## Target Users
- **Partners / collaborators**: People evaluating Intrface as a product partner, venture partner, or systems builder.
- **Prospective customers**: Visitors who need a concise understanding of AOC, Voyager, Funda, and future products.
- **Technical evaluators**: Developers, operators, and product-minded technical readers who want enough proof to trust the work.
- **Future hires / contributors**: People trying to understand the mission, product quality, and direction of the company.
- **Internal Intrface team**: Stakeholders who need a canonical, reusable public narrative and information architecture.

## Success Metrics
- Homepage communicates Intrface positioning and featured products clearly within the first viewport + first scroll.
- AOC, Voyager, and Funda each have a dedicated, reusable project page structure.
- The site ships with a scalable content model so additional projects can be added without rewriting the app architecture.
- Contact / conversion pathways are present and functional.
- Lighthouse-quality baseline for marketing pages is acceptable for launch: fast load, responsive layout, semantic metadata.
- The repository is structured so subsequent planning can proceed through Taskmaster in dependency order.

---

## Capability Tree

### Capability: Brand Positioning
Define and express what Intrface is, what it builds, and how its products fit together.

#### Feature: Company narrative
- **Description**: Present Intrface as a coherent company/studio/platform rather than a list of disconnected repos.
- **Inputs**: Prior audit findings, project summaries, founder positioning, product ecosystem thesis.
- **Outputs**: Clear brand statement, supporting narrative sections, concise messaging blocks.
- **Behavior**: Converts internal product complexity into an externally understandable story.

#### Feature: Messaging hierarchy
- **Description**: Establish a consistent hierarchy for hero copy, section copy, project summaries, and CTA language.
- **Inputs**: Product descriptions, user goals, conversion intent.
- **Outputs**: Reusable messaging rules and finalized copy blocks.
- **Behavior**: Ensures copy remains sharp, differentiated, and consistent across pages.

### Capability: Information Architecture
Design the public structure of the website and the relationship between pages.

#### Feature: Sitemap definition
- **Description**: Define the primary navigation and initial route map for launch.
- **Inputs**: Product priorities, audience needs, launch scope.
- **Outputs**: Agreed route set such as home, projects, project detail pages, about, contact, optional platform/journal placeholders.
- **Behavior**: Prevents scope drift and gives implementation a stable page inventory.

#### Feature: Content model
- **Description**: Define structured project/content data for featured products and future additions.
- **Inputs**: Product metadata, narrative requirements, launch priorities.
- **Outputs**: Typed content schema and initial content entries.
- **Behavior**: Separates content from presentation and supports scalable additions.

### Capability: Visual System
Create a marketing-grade visual language aligned with Intrface’s tone.

#### Feature: Design tokens and layout primitives
- **Description**: Establish foundational spacing, typography, color, and container rules.
- **Inputs**: Brand direction, readability needs, existing product aesthetics.
- **Outputs**: Reusable design primitives and section patterns.
- **Behavior**: Enables visual consistency and faster page construction.

#### Feature: Marketing components
- **Description**: Build reusable components for hero sections, project cards, feature grids, CTAs, and content sections.
- **Inputs**: Information architecture, design tokens, content model.
- **Outputs**: Composable UI building blocks.
- **Behavior**: Allows future pages to be assembled with low friction.

### Capability: Portfolio Presentation
Showcase flagship products and future projects clearly.

#### Feature: Featured project listing
- **Description**: Present flagship projects on homepage and projects index with concise descriptions and status.
- **Inputs**: Product summaries, status labels, visuals.
- **Outputs**: Project cards, teaser sections, links to details.
- **Behavior**: Helps visitors understand breadth without overwhelming them.

#### Feature: Project detail pages
- **Description**: Provide a reusable structure for deep project narratives.
- **Inputs**: Product copy, benefits, audience framing, optional proof/visuals.
- **Outputs**: Dedicated pages for AOC, Voyager, and Funda.
- **Behavior**: Supports both executive and technical audiences through structured product storytelling.

### Capability: Conversion and Trust
Provide clear next steps and enough proof to build confidence.

#### Feature: Contact pathway
- **Description**: Offer a clear route for partnership, demo, or collaboration inquiries.
- **Inputs**: Contact method, CTA strategy.
- **Outputs**: Contact page or CTA module with actionable next step.
- **Behavior**: Converts interest into reachable opportunity.

#### Feature: Metadata and credibility layer
- **Description**: Establish page metadata, social sharing basics, and visible proof markers.
- **Inputs**: Brand copy, project summaries, page content.
- **Outputs**: Metadata defaults, titles, descriptions, and proof-ready page structure.
- **Behavior**: Improves trust, discoverability, and shareability.

### Capability: Launch Quality
Prepare the site for iterative delivery with a stable implementation baseline.

#### Feature: Responsive shell
- **Description**: Ensure the site layout and navigation work across common viewport sizes.
- **Inputs**: Layout system, page inventory.
- **Outputs**: Responsive marketing shell.
- **Behavior**: Prevents launch regressions and enables reliable review.

#### Feature: Quality validation
- **Description**: Validate linting, production build, accessibility basics, and route completeness.
- **Inputs**: Implemented pages, metadata, components.
- **Outputs**: Green build and launch-readiness checklist.
- **Behavior**: Ensures the initial release is credible and maintainable.

---

## Repository Structure

```text
intrface-site/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Homepage
│   │   ├── about/page.tsx                 # Intrface company page
│   │   ├── projects/page.tsx              # Portfolio index
│   │   ├── projects/[slug]/page.tsx       # Reusable project detail route
│   │   └── contact/page.tsx               # Contact / CTA page
│   ├── components/
│   │   ├── marketing/                     # Hero, CTA, feature grids, section blocks
│   │   ├── projects/                      # Project card/detail presentation
│   │   ├── layout/                        # Header, footer, wrappers
│   │   └── ui/                            # Shared low-level primitives where needed
│   ├── content/
│   │   └── projects/                      # Typed project content/data entries
│   └── lib/
│       ├── site/                          # Site config, navigation, metadata helpers
│       └── content/                       # Content loaders/types
├── public/
│   └── images/
│       ├── brand/
│       └── projects/
├── docs/
│   └── planning/                          # Optional future strategy docs
└── tests/                                 # Optional later test coverage for key routes/components
```

## Module Definitions

### Module: `src/lib/site`
- **Maps to capability**: Brand Positioning + Conversion and Trust
- **Responsibility**: Centralize navigation, metadata defaults, company profile, CTA configuration.
- **File structure**:
  ```text
  site/
  ├── metadata.ts
  ├── navigation.ts
  └── config.ts
  ```
- **Exports**:
  - `siteMetadata` - default metadata settings
  - `mainNavigation` - top-level route definitions
  - `companyProfile` - reusable brand/company values

### Module: `src/content/projects`
- **Maps to capability**: Information Architecture + Portfolio Presentation
- **Responsibility**: Store structured project records for AOC, Voyager, Funda, and future projects.
- **File structure**:
  ```text
  projects/
  ├── aoc.ts
  ├── voyager.ts
  ├── funda.ts
  ├── index.ts
  └── types.ts
  ```
- **Exports**:
  - `projects` - array of project summaries
  - `getProjectBySlug(slug)` - lookup helper
  - `ProjectEntry` - content type definition

### Module: `src/components/layout`
- **Maps to capability**: Visual System + Launch Quality
- **Responsibility**: Provide shared shell elements and page framing.
- **File structure**:
  ```text
  layout/
  ├── header.tsx
  ├── footer.tsx
  └── page-container.tsx
  ```
- **Exports**:
  - `Header`
  - `Footer`
  - `PageContainer`

### Module: `src/components/marketing`
- **Maps to capability**: Visual System + Brand Positioning
- **Responsibility**: Compose reusable marketing sections.
- **File structure**:
  ```text
  marketing/
  ├── hero.tsx
  ├── section-heading.tsx
  ├── feature-grid.tsx
  ├── cta-banner.tsx
  └── proof-strip.tsx
  ```
- **Exports**:
  - `Hero`
  - `SectionHeading`
  - `FeatureGrid`
  - `CtaBanner`
  - `ProofStrip`

### Module: `src/components/projects`
- **Maps to capability**: Portfolio Presentation
- **Responsibility**: Render project lists and detail-page sections.
- **File structure**:
  ```text
  projects/
  ├── project-card.tsx
  ├── project-grid.tsx
  ├── project-hero.tsx
  └── project-section.tsx
  ```
- **Exports**:
  - `ProjectCard`
  - `ProjectGrid`
  - `ProjectHero`
  - `ProjectSection`

### Module: `src/app/*`
- **Maps to capability**: Information Architecture + Portfolio Presentation + Conversion and Trust
- **Responsibility**: Define route-level compositions for launch pages.
- **File structure**:
  ```text
  app/
  ├── page.tsx
  ├── about/page.tsx
  ├── projects/page.tsx
  ├── projects/[slug]/page.tsx
  └── contact/page.tsx
  ```
- **Exports**:
  - Route components only

---

## Dependency Chain

### Foundation Layer (Phase 0)
No dependencies.

- **site-config**: Brand constants, navigation definitions, metadata defaults, route inventory.
- **content-schema**: Typed content model for projects and reusable messaging data.
- **design-primitives**: Base layout, typography, spacing, and reusable section primitives.

### Composition Layer (Phase 1)
- **marketing-components**: Depends on [site-config, design-primitives]
- **project-components**: Depends on [content-schema, design-primitives]
- **layout-shell**: Depends on [site-config, design-primitives]

### Route Layer (Phase 2)
- **homepage**: Depends on [marketing-components, project-components, layout-shell, content-schema]
- **projects-index**: Depends on [project-components, layout-shell, content-schema]
- **project-detail-routes**: Depends on [project-components, layout-shell, content-schema, site-config]
- **about-contact-pages**: Depends on [marketing-components, layout-shell, site-config]

### Launch Layer (Phase 3)
- **metadata-polish**: Depends on [homepage, projects-index, project-detail-routes, about-contact-pages]
- **responsive-qa**: Depends on [homepage, projects-index, project-detail-routes, about-contact-pages]
- **release-baseline**: Depends on [metadata-polish, responsive-qa]

---

## Development Phases

### Phase 0: Foundation for Narrative, Content, and UI
**Goal**: Establish the information architecture, typed content model, and reusable visual primitives needed to build pages in a stable way.

**Entry Criteria**: Clean initialized repository; no launch pages implemented beyond placeholder.

**Tasks**:
- [ ] Define site configuration and navigation model (depends on: none)
  - Acceptance criteria: navigation, metadata defaults, and brand constants exist in a reusable module.
  - Test strategy: lint/type-check imports from route files and components.
- [ ] Create typed project content schema and seed flagship entries (depends on: none)
  - Acceptance criteria: AOC, Voyager, and Funda are represented as structured project records with summary and detail fields.
  - Test strategy: type-check content module; verify slug lookup behavior.
- [ ] Build design primitives and section layout foundation (depends on: none)
  - Acceptance criteria: shared page container, section heading, spacing, and base visual language are reusable.
  - Test strategy: render primitives in at least one route without style/layout regressions.

**Exit Criteria**: Implementation can build feature pages using shared config, data, and layout primitives.

**Delivers**: Stable foundation for route composition.

---

### Phase 1: Shared Marketing and Portfolio Components
**Goal**: Build reusable composition blocks for marketing pages and product presentation.

**Entry Criteria**: Phase 0 complete.

**Tasks**:
- [ ] Build global layout shell with header/footer (depends on: site configuration, design primitives)
  - Acceptance criteria: pages share a consistent shell with responsive navigation and footer.
  - Test strategy: verify shell renders across all launch routes.
- [ ] Build reusable marketing components (depends on: site configuration, design primitives)
  - Acceptance criteria: hero, feature grid, CTA, and section blocks exist and are composition-ready.
  - Test strategy: render components on homepage/about/contact with no lint/build issues.
- [ ] Build project presentation components (depends on: content schema, design primitives)
  - Acceptance criteria: project cards, grids, and detail sections support both list and detail contexts.
  - Test strategy: render all seeded projects in list/detail views.

**Exit Criteria**: Routes can be composed mostly from reusable components instead of one-off markup.

**Delivers**: Shared system for marketing and project storytelling.

---

### Phase 2: Launch Routes
**Goal**: Implement all initial launch pages with coherent content and navigation.

**Entry Criteria**: Phase 1 complete.

**Tasks**:
- [ ] Implement homepage (depends on: layout shell, marketing components, project presentation components, content schema)
  - Acceptance criteria: homepage includes hero, Intrface narrative, featured projects, capability framing, and CTA.
  - Test strategy: route renders correctly on mobile and desktop; metadata present.
- [ ] Implement projects index and reusable dynamic project route (depends on: layout shell, project presentation components, content schema, site configuration)
  - Acceptance criteria: `/projects` lists all flagship items and `/projects/[slug]` resolves valid entries for AOC, Voyager, and Funda.
  - Test strategy: verify slug routing and not-found behavior for unknown slugs.
- [ ] Implement about and contact pages (depends on: layout shell, marketing components, site configuration)
  - Acceptance criteria: pages explain Intrface and provide a clear contact path.
  - Test strategy: route rendering, link validation, and content completeness check.

**Exit Criteria**: All launch routes exist and are navigable end to end.

**Delivers**: The first complete version of the public site.

---

### Phase 3: Launch Polish and Release Baseline
**Goal**: Make the initial release credible, responsive, and ready for iterative expansion.

**Entry Criteria**: Phase 2 complete.

**Tasks**:
- [ ] Add metadata, social descriptions, and route-level polish (depends on: all launch routes)
  - Acceptance criteria: route metadata is no longer placeholder text and reflects Intrface + product content.
  - Test strategy: inspect generated metadata and verify page titles/descriptions.
- [ ] Run responsive QA and launch readiness sweep (depends on: all launch routes)
  - Acceptance criteria: common viewport issues, obvious accessibility issues, and copy/layout regressions are addressed.
  - Test strategy: manual QA checklist + build/lint verification.
- [ ] Finalize release baseline documentation (depends on: metadata polish, responsive QA)
  - Acceptance criteria: README and planning notes reflect actual launch architecture and next-step expansion areas.
  - Test strategy: repo review for consistency.

**Exit Criteria**: Repository builds cleanly, routes are complete, and launch review can proceed.

**Delivers**: A credible v1 brand/portfolio site baseline.

---

## Test Pyramid

```text
        /\
       /E2E\       ← 10% (route smoke tests / navigation checks later)
      /------\
     /Integration\ ← 30% (route composition, slug resolution, metadata wiring)
    /------------\
   /  Unit Tests  \ ← 60% (content helpers, config helpers, presentational logic)
  /----------------\
```

## Coverage Requirements
- Line coverage: 80% minimum for future testable helper modules
- Branch coverage: 70% minimum for helper logic
- Function coverage: 80% minimum for exported utility modules
- Statement coverage: 80% minimum for exported utility modules

## Critical Test Scenarios

### Content Model
**Happy path**:
- Project records load and expose required fields.
- Expected: homepage and project routes can consume them without runtime failures.

**Edge cases**:
- Missing optional fields such as secondary CTA or supporting bullets.
- Expected: UI degrades gracefully without broken layout.

**Error cases**:
- Unknown slug requested.
- Expected: route returns not-found behavior rather than broken page output.

**Integration points**:
- Content schema → project components → route layer.
- Expected: seeded flagship content renders consistently across list and detail contexts.

### Navigation and Layout
**Happy path**:
- Header, footer, and internal links render on all launch pages.
- Expected: users can navigate the site without dead ends.

**Edge cases**:
- Narrow mobile viewport and large desktop viewport.
- Expected: shell remains readable and usable.

**Error cases**:
- Missing route config value.
- Expected: type errors or obvious development-time failures rather than silent runtime issues.

**Integration points**:
- Site config → layout shell → route pages.
- Expected: all pages share canonical navigation and metadata behavior.

### Marketing Pages
**Happy path**:
- Homepage, about, projects, and contact routes render complete sections.
- Expected: narrative is coherent and CTAs remain visible.

**Edge cases**:
- Long copy blocks or expanded project descriptions.
- Expected: spacing and typography continue to hold.

**Error cases**:
- Placeholder metadata or empty CTA labels survive into release candidates.
- Expected: launch readiness QA catches and corrects them.

**Integration points**:
- Marketing components + project components + content data.
- Expected: route assembly works with reusable sections, not duplicated custom markup.

## Test Generation Guidelines
- Favor simple deterministic tests around data helpers and route lookup logic first.
- Treat presentational React components primarily as render-smoke/integration surfaces unless logic complexity grows.
- Add route smoke coverage only after the route set stabilizes.
- Prioritize metadata correctness, slug lookup behavior, and reusable component composition over snapshot-heavy testing.

---

## System Components
- **Route layer**: Next.js App Router pages for home, projects, project detail, about, and contact.
- **Content layer**: Typed local content objects for flagship products and reusable narrative blocks.
- **Presentation layer**: Reusable layout and marketing components assembled into route-level pages.
- **Configuration layer**: Metadata, navigation, company profile, and CTA configuration.

## Data Models

### `ProjectEntry`
Core fields should include:
- `slug`
- `name`
- `status`
- `oneLiner`
- `shortDescription`
- `audience`
- `problem`
- `solution`
- `highlights`
- `cta`
- `visuals` (optional at launch)

### `NavigationItem`
- `label`
- `href`
- `external` (optional)

### `CallToAction`
- `label`
- `href`
- `variant`

## Technology Stack
- **Framework**: Next.js App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content strategy**: local typed data first; CMS deferred
- **Planning/runtime tooling**: AOC + Taskmaster

**Decision: Local typed content for v1**
- **Rationale**: Fastest path to launch, strong type safety, minimal complexity, easy refactors while messaging is still changing.
- **Trade-offs**: Non-technical editing is less convenient than a CMS.
- **Alternatives considered**: MDX-first content, headless CMS from day one.

**Decision: Static-first marketing architecture**
- **Rationale**: Best fit for performance, simplicity, and low operational burden.
- **Trade-offs**: Dynamic personalization and CMS workflows are postponed.
- **Alternatives considered**: Fully dynamic content system, integrated admin panel.

**Decision: Reusable project-detail route pattern**
- **Rationale**: Supports multiple products without bespoke pages for every new addition.
- **Trade-offs**: Some products may eventually require richer custom storytelling.
- **Alternatives considered**: Fully custom page per product from the start.

---

## Technical Risks
**Risk**: Brand/message ambiguity slows implementation.
- **Impact**: High
- **Likelihood**: Medium
- **Mitigation**: Lock the initial launch narrative around Intrface + three flagship products before visual over-expansion.
- **Fallback**: Ship a narrower v1 focused on homepage + projects + contact, then expand copy later.

**Risk**: Over-design before content stabilizes.
- **Impact**: Medium
- **Likelihood**: High
- **Mitigation**: Build typed content model and section primitives before polishing elaborate visuals.
- **Fallback**: Use a restrained editorial layout with minimal motion for v1.

**Risk**: Scope creep into CMS, blog, animations, and advanced proof systems.
- **Impact**: High
- **Likelihood**: High
- **Mitigation**: Keep launch scope to core pages and reusable content architecture only.
- **Fallback**: Park expansion work in post-launch tasks.

## Dependency Risks
**Risk**: Missing approved brand assets or visuals for project pages.
- **Impact**: Medium
- **Likelihood**: Medium
- **Mitigation**: Build pages so they can launch with typography + simple visual placeholders.
- **Fallback**: Add visuals in a later polish phase.

## Scope Risks
**Risk**: Trying to equally feature every Intrface repo.
- **Impact**: High
- **Likelihood**: Medium
- **Mitigation**: Limit launch focus to AOC, Voyager, and Funda as flagships.
- **Fallback**: Create an “other projects” section later instead of expanding launch nav.

---

## References
- Existing product READMEs for AOC, Voyager, and Funda
- AOC project workflow conventions
- Intrface positioning discussion captured during initial audit

## Glossary
- **Flagship project**: A primary product prominently featured on the Intrface site.
- **Content model**: Structured data format for product and brand content.
- **Launch baseline**: The first credible, publicly presentable release of the site.

## Open Questions
- What exact public CTA should be primary at launch: contact, demo request, partnership, or waitlist?
- Should AOC be treated as the lead product on the homepage or should Intrface remain the only hero focus?
- Are there approved logos, screenshots, or visual assets ready for launch use?
- Will a journal/platform page be in v1 or explicitly deferred?
