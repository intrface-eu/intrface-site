# Intrface Monorepo Switch PRD (RPG)

## Problem Statement
`intrface-site` started as a single public-site app, but the roadmap has already outgrown that shape. `intrface.eu` must remain the parent brand and portfolio surface, while `aoc.intrface.eu` now needs to launch as its own deeper product/education/consulting property on a near-term timeline. Keeping both surfaces inside one flat app risks blurred routing, muddled ownership, and product-level constraints caused by a portfolio-first structure.

The team needs a repo structure that preserves shared control while allowing `intrface.eu` and `aoc.intrface.eu` to evolve as separate public apps. The solution must support immediate AOC subdomain work, avoid unnecessary repo fragmentation, and leave room for future sibling apps.

## Target Users
- **Intrface maintainers**: need one repo with clean app boundaries, shared tooling, and predictable build/deploy flows.
- **AOC product/education maintainers**: need a dedicated app surface for deep product messaging, consulting, and course-driven content without fighting the brand-site IA.
- **Future product-site owners**: need a scalable pattern that can later support more public subdomain surfaces without redoing the repository again.

## Success Metrics
- Current `intrface-site` app is migrated into a monorepo without breaking local development.
- `intrface.eu` and `aoc.intrface.eu` each have a clearly defined app boundary.
- Shared tokens/config live in reusable workspace packages rather than app-local duplication where appropriate.
- AOC subdomain work can begin immediately after migration without structural blockers.
- Build/lint/dev commands run successfully from the repo root and for each app.

---

## Capability Tree

### Capability: Workspace Topology
Define the monorepo shape, app boundaries, and shared package strategy.

#### Feature: App boundary definition
- **Description**: Establish dedicated workspace apps for the Intrface brand site and the AOC subdomain site.
- **Inputs**: Current single-app structure, expected domains, future roadmap.
- **Outputs**: `apps/web` and `apps/aoc` (or equivalent) with clearly scoped responsibilities.
- **Behavior**: Move current public-site code into the brand-site app and create a dedicated AOC app shell for immediate follow-up work.

#### Feature: Shared package boundaries
- **Description**: Define which concerns become workspace packages instead of app-local code.
- **Inputs**: Existing typography, branding, components, config, and i18n concerns.
- **Outputs**: Initial package plan for shared UI, branding/theme tokens, and shared config.
- **Behavior**: Keep only durable cross-app concerns shared; avoid premature abstraction of page-specific storytelling.

### Capability: Migration Execution
Safely move the current codebase into the monorepo without losing working behavior.

#### Feature: App extraction and relocation
- **Description**: Relocate the current Next.js site into the new app directory structure.
- **Inputs**: Existing root app, config files, public assets, package manifest.
- **Outputs**: Working brand-site app inside the monorepo.
- **Behavior**: Preserve current routes and assets while updating paths, scripts, and workspace wiring.

#### Feature: Root workspace orchestration
- **Description**: Add root-level workspace scripts and package management conventions.
- **Inputs**: Existing package manager setup, current scripts, target app/package layout.
- **Outputs**: Root scripts for dev, build, lint, and app-scoped execution.
- **Behavior**: Ensure maintainers can run the repo from the root while retaining app-level commands.

### Capability: Domain and Delivery Readiness
Prepare the repo for separate public surfaces and deployment targeting.

#### Feature: Domain ownership model
- **Description**: Define which app serves `intrface.eu` and which serves `aoc.intrface.eu`.
- **Inputs**: Product strategy, app boundaries, deployment platform constraints.
- **Outputs**: Documented domain-to-app mapping and deployment assumptions.
- **Behavior**: Keep the parent site and AOC site independently deployable even if they share infra.

#### Feature: AOC launch runway
- **Description**: Ensure the new structure is sufficient to start building the AOC subdomain immediately.
- **Inputs**: AOC near-term content/product goals, migration result.
- **Outputs**: A minimal but working AOC app shell with room for dedicated navigation, branding, and content strategy.
- **Behavior**: Leave the AOC app intentionally lightweight at first, but unblock same-day implementation.

---

## Repository Structure

```text
intrface-site/
├── apps/
│   ├── web/                # Intrface.eu brand + portfolio site
│   └── aoc/                # aoc.intrface.eu product / education site
├── packages/
│   ├── ui/                 # Shared durable UI primitives
│   ├── branding/           # Shared tokens, product themes, brand constants
│   └── config/             # Shared ts/eslint/tailwind/build config where useful
├── .taskmaster/
├── package.json            # Root workspace scripts
├── pnpm-workspace.yaml
└── ...
```

## Module Definitions

### Module: `apps/web`
- **Maps to capability**: Workspace Topology / App boundary definition
- **Responsibility**: Host the parent Intrface brand, portfolio, and flagship-preview experience.
- **File structure**:
  ```text
  apps/web/
  ├── src/
  ├── public/
  ├── package.json
  └── next.config.ts
  ```
- **Exports**:
  - brand-site runtime and routes

### Module: `apps/aoc`
- **Maps to capability**: Domain and Delivery Readiness / AOC launch runway
- **Responsibility**: Host the dedicated AOC product, education, and consulting surface.
- **File structure**:
  ```text
  apps/aoc/
  ├── src/
  ├── public/
  ├── package.json
  └── next.config.ts
  ```
- **Exports**:
  - AOC-site runtime and routes

### Module: `packages/ui`
- **Maps to capability**: Shared package boundaries
- **Responsibility**: Provide reusable, app-agnostic UI primitives and layout helpers.
- **File structure**:
  ```text
  packages/ui/
  ├── src/
  ├── package.json
  └── tsconfig.json
  ```
- **Exports**:
  - shared primitives only where reuse is real

### Module: `packages/branding`
- **Maps to capability**: Shared package boundaries
- **Responsibility**: Provide Intrface brand constants, product theme tokens, and shared visual foundations.
- **File structure**:
  ```text
  packages/branding/
  ├── src/
  ├── package.json
  └── tsconfig.json
  ```
- **Exports**:
  - brand tokens
  - product theme tokens
  - shared metadata helpers if appropriate

### Module: `packages/config`
- **Maps to capability**: Root workspace orchestration
- **Responsibility**: Centralize shared config where doing so reduces duplication without hiding app intent.
- **File structure**:
  ```text
  packages/config/
  ├── eslint/
  ├── ts/
  └── tailwind/
  ```
- **Exports**:
  - sharable config presets

---

## Dependency Chain

### Foundation Layer (Phase 0)
- **Workspace layout decision**: Defines app/package boundaries and migration target shape.
- **Root workspace scripts**: Provides monorepo orchestration entrypoints.

### Migration Layer (Phase 1)
- **Brand-site app relocation**: Depends on [Workspace layout decision, Root workspace scripts]
- **AOC app shell creation**: Depends on [Workspace layout decision, Root workspace scripts]
- **Shared package scaffolding**: Depends on [Workspace layout decision]

### Integration Layer (Phase 2)
- **Config/path refit**: Depends on [Brand-site app relocation, AOC app shell creation, Shared package scaffolding]
- **Asset/import cleanup**: Depends on [Brand-site app relocation, Shared package scaffolding]
- **Root and app-level validation**: Depends on [Config/path refit, Asset/import cleanup]

### Delivery Layer (Phase 3)
- **Domain-to-app deployment mapping**: Depends on [Root and app-level validation, AOC app shell creation]
- **AOC subdomain implementation runway**: Depends on [Domain-to-app deployment mapping]

---

## Development Phases

### Phase 0: Monorepo Design Decision
**Goal**: Lock the target structure before moving files.

**Entry Criteria**: Existing single-app repo is functioning and monorepo direction is approved.

**Tasks**:
- [ ] Define workspace layout and naming (depends on: none)
  - Acceptance criteria: `apps/*` and `packages/*` structure is agreed and documented.
  - Test strategy: Manual architecture review against current roadmap.
- [ ] Define root script strategy and package-manager expectations (depends on: none)
  - Acceptance criteria: root command model is documented for dev/build/lint.
  - Test strategy: Manual command review.

**Exit Criteria**: The migration target shape is explicit and non-ambiguous.

**Delivers**: A concrete repo structure to migrate into.

---

### Phase 1: Physical Restructure
**Goal**: Move the current repo into the new workspace shape and create the AOC app shell.

**Entry Criteria**: Phase 0 complete.

**Tasks**:
- [ ] Move the current brand site into `apps/web` (depends on: [Define workspace layout and naming])
  - Acceptance criteria: current Intrface site code lives under the new app boundary and still resolves.
  - Test strategy: run app-scoped lint/build/dev commands.
- [ ] Create initial `apps/aoc` shell (depends on: [Define workspace layout and naming])
  - Acceptance criteria: dedicated AOC app exists with minimal runnable structure.
  - Test strategy: run app-scoped startup/build command.
- [ ] Scaffold shared packages (depends on: [Define workspace layout and naming])
  - Acceptance criteria: package directories exist with valid workspace manifests.
  - Test strategy: workspace install/type resolution passes.

**Exit Criteria**: The repo is physically organized as a monorepo with two app entry points.

**Delivers**: `apps/web`, `apps/aoc`, and minimal shared packages.

---

### Phase 2: Integration Refit
**Goal**: Restore clean operation after the move.

**Entry Criteria**: Phase 1 complete.

**Tasks**:
- [ ] Update imports, paths, configs, and root scripts (depends on: [Move the current brand site into `apps/web`, Create initial `apps/aoc` shell, Scaffold shared packages])
  - Acceptance criteria: workspace commands resolve correctly from root and app boundaries.
  - Test strategy: root build/lint plus targeted app runs.
- [ ] Consolidate shared tokens/config where it reduces duplication (depends on: [Scaffold shared packages])
  - Acceptance criteria: only durable shared concerns are extracted.
  - Test strategy: ensure both apps can consume the shared exports without path hacks.

**Exit Criteria**: The monorepo works locally without broken imports or ad hoc glue.

**Delivers**: Stable workspace behavior and shared foundations.

---

### Phase 3: Delivery Readiness
**Goal**: Make the new structure usable for same-day AOC subdomain work.

**Entry Criteria**: Phase 2 complete.

**Tasks**:
- [ ] Define domain deployment mapping for `intrface.eu` and `aoc.intrface.eu` (depends on: [Update imports, paths, configs, and root scripts])
  - Acceptance criteria: each app has a clear deployment target and environment assumptions.
  - Test strategy: manual deployment-plan review.
- [ ] Confirm AOC app is ready for focused implementation (depends on: [Define domain deployment mapping for `intrface.eu` and `aoc.intrface.eu`])
  - Acceptance criteria: the team can begin AOC content and design work immediately.
  - Test strategy: create/run the first AOC app route successfully.

**Exit Criteria**: AOC subdomain work is unblocked and the repo structure no longer fights the roadmap.

**Delivers**: A monorepo ready for parallel brand-site and AOC-site development.

---

## Test Pyramid

```text
        /\
       /E2E\       ← 10%
      /------\
     /Integration\ ← 30%
    /------------\
   /  Unit Tests  \ ← 60%
  /----------------\
```

## Coverage Requirements
- Line coverage: 0% minimum for migration phase; prioritize smoke validation over artificial thresholds during restructure.
- Branch coverage: 0% minimum during migration.
- Function coverage: 0% minimum during migration.
- Statement coverage: 0% minimum during migration.

## Critical Test Scenarios

### Workspace execution
**Happy path**:
- Root install succeeds.
- Root lint/build commands execute for all configured apps.
- Expected: workspace is operable from repo root.

**Edge cases**:
- Shared package imports from both apps.
- App-local assets after relocation.
- Expected: no broken path resolution.

**Error cases**:
- Misconfigured workspace package names.
- Broken TS path aliases after moving directories.
- Expected: failures are surfaced early during lint/build.

**Integration points**:
- `apps/web` consuming shared branding/ui exports.
- `apps/aoc` booting with its own app boundary while sharing workspace tooling.
- Expected: shared code resolves cleanly without tight coupling.

## Test Generation Guidelines
Prefer practical migration validation over synthetic unit-test expansion. Focus on install, lint, build, app boot, workspace import resolution, and route smoke checks.

---

## System Components
- **Brand app (`apps/web`)**: parent Intrface public site.
- **AOC app (`apps/aoc`)**: dedicated AOC subdomain site.
- **Shared packages**: durable cross-app tokens, primitives, and config.
- **Workspace root**: top-level scripts, package-manager control, and CI entrypoints.

## Data Models
- **WorkspaceApp**
  - `name`: app identifier
  - `domain`: public domain/subdomain target
  - `type`: brand | product
  - `dependsOnPackages`: list of shared workspace packages
- **SharedPackage**
  - `name`: package identifier
  - `scope`: ui | branding | config
  - `consumers`: apps using the package

## Technology Stack
- Next.js apps within a shared workspace
- TypeScript
- Tailwind CSS
- Workspace package manager (existing `pnpm-workspace.yaml`, with scripts aligned to the chosen package-manager workflow)

**Decision: Monorepo with app-level separation**
- **Rationale**: Keeps control centralized while giving AOC its own public product surface and preserving room for future sibling apps.
- **Trade-offs**: Requires migration effort and slightly more workspace/tooling complexity now.
- **Alternatives considered**: keep one app and overload routing; create a separate repo immediately.

**Decision: Shared foundations, not shared sameness**
- **Rationale**: Brand tokens and durable primitives should be reusable, but each app must keep its own storytelling and product identity.
- **Trade-offs**: Some duplication may remain intentionally.
- **Alternatives considered**: force all UI through a single package; keep everything app-local.

---

## Technical Risks
**Risk**: Migration breaks the currently working site.
- **Impact**: High
- **Likelihood**: Medium
- **Mitigation**: Move in phases, validate root/app commands after each stage, keep commits tightly scoped.
- **Fallback**: Pause after `apps/web` relocation and restore missing pieces before touching AOC-specific work.

**Risk**: Shared packages are over-abstracted too early.
- **Impact**: Medium
- **Likelihood**: High
- **Mitigation**: Only extract stable, clearly cross-app concerns.
- **Fallback**: Re-inline app-specific code and keep packages minimal.

## Dependency Risks
**Risk**: Deployment assumptions differ between root app and subdomain app.
- **Impact**: Medium
- **Likelihood**: Medium
- **Mitigation**: document domain-to-app mapping during migration rather than after it.
- **Fallback**: ship apps independently while retaining the same workspace.

## Scope Risks
**Risk**: The migration expands into full AOC-site implementation before the structure is stable.
- **Impact**: High
- **Likelihood**: High
- **Mitigation**: keep this initiative scoped to restructure + runnable AOC shell.
- **Fallback**: cut nonessential extraction work and stabilize the workspace first.

---

## References
- `.taskmaster/templates/example_prd_rpg.txt`
- `/home/ceii/dev/agent-ops-cockpit/README.md`
- `/home/ceii/dev/intrface-site/design.md`

## Glossary
- **Brand app**: the parent `intrface.eu` site.
- **AOC app**: the dedicated `aoc.intrface.eu` public surface.
- **Workspace package**: a reusable internal package inside the monorepo.

## Open Questions
- Which package manager command surface should be canonical during the migration: `pnpm`, `bun`, or mixed compatibility?
- Should i18n remain only in the brand app initially, or be scaffolded in AOC from day one?
- Which shared packages are truly needed on day one versus later?
