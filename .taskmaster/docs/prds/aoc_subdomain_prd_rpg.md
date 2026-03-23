# AOC Public Subdomain PRD (RPG)

## Problem Statement
The current Intrface site can only present AOC as a flagship preview. That is no longer enough. AOC now needs its own public surface at `aoc.intrface.eu` to explain the product in depth and position it as both a real development environment and a consulting / education offering.

AOC is not just another AI coding interface. It is a terminal-first, local-first compatible workspace built for structured agentic coding with minimal overhead, strong continuity, and serious operator control. The existing brand-site AOC page cannot hold the full philosophy, product proof, installation path, and service framing without overloading the portfolio site.

The team needs a dedicated AOC public site that:
- explains the terminal-first / local-first thesis clearly
- proves AOC is a real daily-use development environment
- presents the product without GUI/SaaS/subscription assumptions
- creates clear paths into product exploration, learning, and consulting
- can be developed immediately inside the new monorepo as `apps/aoc`

## Target Users
- **Serious developers**: want a more disciplined way to work with coding agents than browser-chat workflows.
- **Local-first / self-hosting operators**: want structured AI-assisted coding without SaaS dependency.
- **Teams evaluating agentic coding**: want a framework for continuity, memory, tasks, and operator control.
- **Learners / students**: want to understand modern human-machine coding interaction through a serious, practical system.
- **Consulting / training leads**: want to understand how Intrface can help teams adopt this way of working.

## Success Metrics
- `apps/aoc` ships a usable v1 public site with core narrative routes/sections.
- AOC is clearly differentiated from generic AI coding tools and from the broader Intrface portfolio surface.
- The site creates explicit CTA paths for repo/docs, learning, and consulting.
- Core public claims remain grounded in the AOC repo, README, and real workspace behavior.
- The site visually reflects AOC's cockpit-like, operator-first identity.

---

## Capability Tree

### Capability: AOC Narrative Positioning
Define the thesis and message architecture for the dedicated AOC public surface.

#### Feature: Core thesis framing
- **Description**: Present AOC as a terminal-first AI workspace for structured, strategic, local-first agentic coding.
- **Inputs**: AOC README, actual workspace usage, product strategy.
- **Outputs**: Clear homepage/core copy hierarchy.
- **Behavior**: Distill AOC into a concise but strong public narrative that is product-accurate and differentiated.

#### Feature: Product differentiation
- **Description**: Explain why AOC differs from GUI-heavy, subscription-centric, cloud-dependent AI coding tools.
- **Inputs**: AOC feature set, positioning goals, competitive framing.
- **Outputs**: Why AOC / differentiator sections.
- **Behavior**: Emphasize local-first compatibility, minimal overhead, portability, continuity, and operator control.

### Capability: Product Proof and System Explanation
Explain how AOC works without overwhelming first-time visitors.

#### Feature: System overview
- **Description**: Introduce the AOC workspace and Distributed Cognitive Architecture in a public-friendly way.
- **Inputs**: README, screenshots, architecture concepts.
- **Outputs**: Product overview sections and visual proof blocks.
- **Behavior**: Translate context, memory, tasks, runtime, and cockpit layout into understandable site sections.

#### Feature: Real-use credibility
- **Description**: Show that AOC is used daily in actual development practice.
- **Inputs**: live workspace screenshots, operational patterns, source truth.
- **Outputs**: credibility/proof section(s).
- **Behavior**: Use real session cues, repo truth, and practical framing rather than abstract marketing claims.

### Capability: Education and Services Surface
Position AOC as a system to learn and a practice Intrface can teach.

#### Feature: Learn path
- **Description**: Create a public path for individuals who want to seriously learn agentic coding through AOC.
- **Inputs**: education goals, AOC philosophy, audience needs.
- **Outputs**: Learn/training section or route.
- **Behavior**: Explain who it is for, what can be learned, and why AOC is a useful teaching medium.

#### Feature: Consulting path
- **Description**: Create a path for teams and organizations interested in adopting structured agentic coding practices.
- **Inputs**: consulting goals, AOC workflow strengths.
- **Outputs**: Consulting section or route.
- **Behavior**: Frame AOC as part of team enablement, workflow design, and operator maturity.

### Capability: Practical Adoption Path
Give visitors a clean route from understanding AOC to trying it.

#### Feature: Install / get started surface
- **Description**: Provide a practical adoption path with install and first-step guidance.
- **Inputs**: AOC install/readme flow, docs links.
- **Outputs**: Get-started page or section.
- **Behavior**: Keep setup approachable while linking deeper docs/repo material.

#### Feature: CTA routing
- **Description**: Direct users into repo/docs, learning, or consulting based on intent.
- **Inputs**: page architecture, user intent categories.
- **Outputs**: site CTA system.
- **Behavior**: Present strong but uncluttered next-step actions.

---

## Repository Structure

```text
intrface-site/
├── apps/
│   └── aoc/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       ├── public/
│       ├── package.json
│       └── next.config.ts
└── packages/
    ├── branding/
    └── ui/
```

## Module Definitions

### Module: `apps/aoc/src/app`
- **Maps to capability**: AOC Narrative Positioning, Practical Adoption Path
- **Responsibility**: Define top-level routes and page composition for the AOC public site.
- **File structure**:
  ```text
  app/
  ├── page.tsx
  ├── philosophy/
  ├── product/
  ├── learn/
  ├── consulting/
  └── install/
  ```
- **Exports**:
  - route-level page entrypoints

### Module: `apps/aoc/src/components`
- **Maps to capability**: Product Proof and System Explanation
- **Responsibility**: Hold reusable AOC-site sections, cockpit UI motifs, and CTA components.
- **File structure**:
  ```text
  components/
  ├── layout/
  ├── sections/
  └── site/
  ```
- **Exports**:
  - hero, proof, explainer, CTA, navigation components

### Module: `apps/aoc/src/lib`
- **Maps to capability**: AOC Narrative Positioning, Education and Services Surface
- **Responsibility**: Store structured content/config/theme data for the AOC public site.
- **File structure**:
  ```text
  lib/
  ├── site/
  └── aoc/
  ```
- **Exports**:
  - content models
  - navigation config
  - theme helpers

### Module: `packages/branding`
- **Maps to capability**: Product Proof and System Explanation
- **Responsibility**: Provide shared Intrface and AOC theme seeds where reuse is durable.
- **Exports**:
  - AOC product theme tokens

---

## Dependency Chain

### Foundation Layer (Phase 0)
- **AOC IA and message architecture**: Defines routes, narrative priorities, and CTA paths.
- **AOC visual language extraction**: Defines cockpit/terminal styling cues and public-site motifs.

### Core Site Layer (Phase 1)
- **AOC shell and navigation**: Depends on [AOC IA and message architecture, AOC visual language extraction]
- **AOC homepage composition**: Depends on [AOC IA and message architecture, AOC shell and navigation]

### Deep Content Layer (Phase 2)
- **Philosophy and product overview surfaces**: Depends on [AOC homepage composition]
- **Learn and consulting surfaces**: Depends on [AOC homepage composition]
- **Install/get started surface**: Depends on [AOC homepage composition]

### Polish Layer (Phase 3)
- **CTA routing and conversion polish**: Depends on [Philosophy and product overview surfaces, Learn and consulting surfaces, Install/get started surface]
- **Metadata, QA, and launch readiness**: Depends on [CTA routing and conversion polish]

---

## Development Phases

### Phase 0: Define AOC Public Site Direction
**Goal**: Lock the information architecture and visual/narrative direction for the AOC subdomain.

**Entry Criteria**: `apps/aoc` exists and can run.

**Tasks**:
- [ ] Define route/section architecture for the AOC subdomain (depends on: none)
  - Acceptance criteria: homepage and supporting routes/sections are explicitly scoped.
  - Test strategy: manual architecture review.
- [ ] Extract AOC branding and cockpit cues from repo/docs/live use (depends on: none)
  - Acceptance criteria: AOC visual direction is concrete enough to implement.
  - Test strategy: manual visual review against source truth.

**Exit Criteria**: The site is clearly shaped before feature implementation begins.

**Delivers**: A concrete blueprint for the AOC public surface.

---

### Phase 1: Build the Core AOC Surface
**Goal**: Ship the AOC shell and homepage.

**Entry Criteria**: Phase 0 complete.

**Tasks**:
- [ ] Build AOC site shell, navigation, and shared sections (depends on: [Define route/section architecture for the AOC subdomain, Extract AOC branding and cockpit cues from repo/docs/live use])
  - Acceptance criteria: the AOC app has consistent layout, nav, and reusable page primitives.
  - Test strategy: lint/build and route smoke test.
- [ ] Implement the AOC homepage narrative and proof composition (depends on: [Build AOC site shell, navigation, and shared sections])
  - Acceptance criteria: homepage clearly communicates thesis, proof, differentiation, and CTA paths.
  - Test strategy: manual narrative and visual review.

**Exit Criteria**: Visitors can land on the homepage and understand what AOC is and why it matters.

**Delivers**: A credible homepage for `aoc.intrface.eu`.

---

### Phase 2: Add Depth Routes
**Goal**: Build the supporting public surfaces needed for serious evaluation.

**Entry Criteria**: Phase 1 complete.

**Tasks**:
- [ ] Implement philosophy and product overview routes (depends on: [Implement the AOC homepage narrative and proof composition])
  - Acceptance criteria: deeper explanation of worldview and system structure exists.
  - Test strategy: route smoke test and source-truth review.
- [ ] Implement learn and consulting routes (depends on: [Implement the AOC homepage narrative and proof composition])
  - Acceptance criteria: education and service pathways are public and understandable.
  - Test strategy: manual conversion-path review.
- [ ] Implement install/get-started route (depends on: [Implement the AOC homepage narrative and proof composition])
  - Acceptance criteria: practical adoption path is visible and actionable.
  - Test strategy: compare against repo docs/install flow.

**Exit Criteria**: The site supports exploration, learning, and service inquiry.

**Delivers**: A more complete AOC public subdomain.

---

### Phase 3: Conversion and Launch Polish
**Goal**: Prepare the AOC public site for confident public use.

**Entry Criteria**: Phase 2 complete.

**Tasks**:
- [ ] Refine CTA paths and conversion framing (depends on: [Implement philosophy and product overview routes, Implement learn and consulting routes, Implement install/get-started route])
  - Acceptance criteria: repo/docs/learn/consulting pathways are clear and intentional.
  - Test strategy: manual conversion walkthrough.
- [ ] Add metadata, responsive QA, and launch polish (depends on: [Refine CTA paths and conversion framing])
  - Acceptance criteria: route metadata, responsiveness, and baseline launch quality are in place.
  - Test strategy: lint/build plus manual QA.

**Exit Criteria**: The AOC subdomain is coherent, differentiated, and ready for public iteration.

**Delivers**: AOC public-site v1.

---

## Test Pyramid

```text
        /\
       /E2E\       ← 10%
      /------\
     /Integration\ ← 25%
    /------------\
   /  Unit Tests  \ ← 65%
  /----------------\
```

## Coverage Requirements
- Line coverage: no hard threshold for initial marketing/product-site pass
- Branch coverage: no hard threshold for initial pass
- Function coverage: no hard threshold for initial pass
- Statement coverage: no hard threshold for initial pass

## Critical Test Scenarios

### Homepage narrative
**Happy path**:
- visitor understands what AOC is within one screen
- Expected: thesis, proof, and primary CTA are immediately legible

**Edge cases**:
- long copy on smaller screens
- Expected: hierarchy remains readable and uncluttered

**Error cases**:
- messaging drifts into generic AI-tool jargon
- Expected: copy review catches and corrects it

**Integration points**:
- links to repo/docs/Intrface preview/consulting paths
- Expected: all major CTA flows work and remain intentional

### Install / get started
**Happy path**:
- visitor can find the install path quickly
- Expected: docs/repo/install links are easy to follow

**Integration points**:
- alignment with current AOC README install flow
- Expected: site instructions do not contradict product docs

## Test Generation Guidelines
Prioritize route smoke testing, narrative review, CTA-path validation, responsive QA, and source-truth comparisons over synthetic unit-test expansion.

---

## System Components
- **Homepage**: thesis, proof, differentiation, and main CTA hub
- **Philosophy**: worldview and development-practice framing
- **Product overview**: public explanation of workspace and architecture
- **Learn**: education and training pathway
- **Consulting**: team enablement / service pathway
- **Install**: practical adoption path

## Data Models
- **AocNavItem**
  - `label`
  - `href`
  - `intent`: overview | learn | consulting | install
- **AocProofBlock**
  - `title`
  - `body`
  - `source`
- **AocAudiencePath**
  - `audience`
  - `goal`
  - `cta`

## Technology Stack
- Next.js app in `apps/aoc`
- TypeScript
- Tailwind CSS
- shared brand/theme tokens from workspace packages where useful

**Decision: Dedicated AOC app inside the Intrface monorepo**
- **Rationale**: Gives AOC its own public narrative surface without fragmenting repo ownership.
- **Trade-offs**: Requires app-specific content and design work instead of over-reusing the parent site.
- **Alternatives considered**: keeping all AOC content inside `intrface.eu` only; separate repo immediately.

**Decision: Product + education + consulting framing**
- **Rationale**: Matches the actual ambition for AOC as both a tool and a serious way of learning/teaching agentic coding.
- **Trade-offs**: Broader message architecture to manage.
- **Alternatives considered**: repo/docs-only framing; pure marketing page.

---

## Technical Risks
**Risk**: The site becomes too broad too early.
- **Impact**: High
- **Likelihood**: Medium
- **Mitigation**: keep v1 focused on thesis, proof, install, learn, and consulting paths.
- **Fallback**: collapse depth routes into fewer pages/sections temporarily.

**Risk**: Messaging drifts from real AOC behavior into abstraction.
- **Impact**: High
- **Likelihood**: Medium
- **Mitigation**: ground all claims in README, docs, and live use patterns.
- **Fallback**: cut unsupported claims and simplify copy.

## Dependency Risks
**Risk**: AOC public-site work outruns the current visual system.
- **Impact**: Medium
- **Likelihood**: High
- **Mitigation**: extract terminal/cockpit branding cues first.
- **Fallback**: ship with a tighter shell and iterate styling after narrative structure lands.

## Scope Risks
**Risk**: Attempting docs portal, course platform, and consulting funnel all at once.
- **Impact**: High
- **Likelihood**: High
- **Mitigation**: keep initial site informational and pathway-oriented, not full platformized education infra.
- **Fallback**: defer advanced course/docs experiences to later phases.

---

## References
- `/home/ceii/dev/agent-ops-cockpit/README.md`
- live AOC workspace/session visuals
- `.taskmaster/docs/prds/intrface_monorepo_switch_prd_rpg.md`

## Glossary
- **Terminal-first**: designed around terminal-native workflows rather than GUI-first interaction.
- **Local-first compatible**: works well with local models and low-dependency setups.
- **Distributed Cognitive Architecture**: AOC's context/memory/tasks model.

## Open Questions
- Should philosophy and product overview be separate routes or one combined route initially?
- Should learn and consulting be full routes at v1 or strong homepage sections first?
- When should multilingual support arrive for the AOC subdomain?
