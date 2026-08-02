# Project Context Snapshot

## Repository
- Name: intrface-site
- Root: ../intrface-site
- VCS: git
- Git branch: main

## Key Files
- README.md
- DESIGN.md
- package.json

## Project Structure (tree -L 2)
```
.
./AGENTS.md
./apps
./apps/aoc
./apps/convex
./apps/web
./bun.lock
./CLAUDE.md
./.cursorrules
./design.md
./DESIGN.md
./.gitignore
./package.json
./packages
./packages/branding
./packages/config
./packages/ui
./.pi
./.pi/agents
./.pi/extensions
./.pi/packages
./.pi/prompts
./.pi/prompts-optional
./.pi/settings.json
./.pi/skills
./pnpm-workspace.yaml
./README.md
./tsconfig.base.json
./.turbo
./.turbo/cache
./turbo.json
./.vercel
./.vercel/project.json
./.vercel/README.txt
```

## README Headings
# Intrface Workspace
## Architecture
## Quick Start
# Install dependencies
# Start all dev servers (Turborepo TUI)
# Or start individual services
## Turborepo Tasks
## Technology Stack
## Convex Backend
## Design Philosophy

## Design Contract
- Root DESIGN.md: present
- Use as visual/product design source before product-facing UI, docs-site, marketing, or media changes.

## Current Task Tag
```
master
```

## Active Workstreams (Tags)
```
master (7)
site-about (2)
site-aoc (2)
site-aoc-subdomain (7)
site-contact (2)
site-core (1)
site-funda (2)
site-homepage (2)
site-monorepo (1)
site-projects (2)
site-voyager (2)
```

## Task spec Location
- Directory: .taskmaster/docs/specs
- Resolve tag spec default with: aoc-task tag spec show --tag <tag>
- Resolve task spec override with: aoc-task spec show <id> --tag <tag>
- Effective precedence: task spec override -> tag spec default
