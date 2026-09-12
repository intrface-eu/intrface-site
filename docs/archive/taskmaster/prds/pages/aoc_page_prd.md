# AOC Product Page PRD

## Page Name
AOC Product Page

## Goal
Present AOC accurately as Agent Ops Cockpit: a terminal-first AI workspace for agentic development built around persistent context, memory, and task-aware workflows.

## Primary Audience
- Developers evaluating AOC
- Technical operators interested in agentic development workflows
- Open-source users and contributors
- Partners assessing Intrface’s strongest flagship product

## Secondary Audience
- Product-minded technical readers
- Visitors arriving from the Intrface homepage

## Source Documents / Repos
- `/home/ceii/dev/agent-ops-cockpit/README.md`
- Relevant docs in `/home/ceii/dev/agent-ops-cockpit/docs`
- `/home/ceii/dev/intrface-site/.taskmaster/docs/prds/intrface_site_prd_rpg.md`

## Key Message
AOC is a terminal-first AI workspace that unifies context-aware agents, project memory, integrated task management, and a Zellij-based operational layout for AI-assisted development.

## Page Job To Be Done
The page should help visitors understand:
1. what AOC stands for
2. what category of product it is
3. what problem it solves in AI-assisted development
4. how its distributed cognitive architecture works
5. what concrete features are included
6. how to try it or learn more

## Required Sections

### 1. Hero
Must include:
- AOC name
- explicit expansion: Agent Ops Cockpit
- terminal-first AI workspace framing
- supporting paragraph grounded in README language
- primary CTA to GitHub/docs/install
- secondary CTA to architecture/how-it-works

Must not include:
- Autonomous Operating Control
- fictional kernel/orchestration renaming

### 2. Why AOC
Must reflect README pain points:
- lost context
- manual copy-pasting
- no project memory
- fragmented workflow

### 3. Distributed Cognitive Architecture
This is a required signature section.
Must include the three persistent layers:
- Context (`.aoc/context.md`)
- Memory (`.aoc/memory.md`)
- Tasks (`tasks.json` / Taskmaster)

This section should make clear these are real persistent project layers, not abstract marketing labels.

### 4. Unified Workspace
Must show or describe the actual workspace composition:
- Yazi
- PI agent pane/runtime
- Taskmaster TUI
- widgets / workspace utilities
- Zellij layout foundation

### 5. Core Capabilities
Should include accurate product capabilities from the README, such as:
- PI-only runtime
- native Taskmaster TUI
- RLM large codebase analysis
- agent skills
- Yazi integration
- custom layouts / AOC modes
- persistent memory and context systems

### 6. How It Works
Recommended flow:
- install / initialize
- operate in the cockpit
- continue across sessions with persistent context, memory, and tasks

### 7. Product Proof
Use only defensible proof:
- screenshots
- architecture diagrams
- command examples
- OSS status
- actual install flow
- real workspace artifacts

Do not use invented performance metrics.

### 8. Quick Start / Installation
Must include actual installation guidance from the README, including:
- bootstrap install command
- local install option if appropriate
- `aoc-doctor`

### 9. Roadmap / Evolution
Should reflect real product evolution themes:
- workspace foundation
- context and memory systems
- PI runtime improvements
- task integration
- skills ecosystem
- layouts and large codebase workflows

### 10. Final CTA
Should invite visitors to:
- view GitHub
- read docs
- install AOC
- explore the architecture

## Required Proof
- Accurate acronym expansion
- README-grounded feature descriptions
- Real architecture and workspace references
- Real command examples where useful

## Required CTAs
- View on GitHub
- Read Documentation
- Install AOC
- Explore Architecture / How It Works

## Must-Avoid Misrepresentations
- Do not present AOC as “Autonomous Operating Control”
- Do not present AOC as a fictional autonomous control kernel
- Do not invent infrastructure claims unsupported by the README
- Do not use fake latency/performance/compliance metrics
- Do not obscure the actual product differentiator: context + memory + tasks in a unified terminal-native workspace

## Content Model Needs
The page should consume structured product content including:
- product metadata
- problem statement
- architecture pillars
- capabilities
- installation commands
- CTA links
- optional screenshots/assets

## Design Notes
- Use Google Sans Flex as the primary typeface
- Preserve the premium systems-oriented visual tone
- The page should feel rigorous and technical, but grounded and honest
- Product truth should govern every section label and CTA
- Strong diagrams are encouraged if they map directly to real AOC concepts

## Acceptance Criteria
- A visitor immediately understands AOC means Agent Ops Cockpit
- The page clearly positions AOC as a terminal-first AI workspace
- Distributed Cognitive Architecture is presented accurately
- Workspace composition reflects actual README components
- CTAs align with public product actions, not fictional operator language
- No invented system names replace real product concepts
