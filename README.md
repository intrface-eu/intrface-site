# Intrface Workspace

Monorepo for Intrface public web surfaces — powered by Turborepo, Bun, and Next.js.

## Architecture

```
intrface-site/
├── apps/
│   ├── web/          # intrface.eu — brand and portfolio site
│   ├── aoc/          # aoc.intrface.eu — AOC product surface
│   └── convex/       # Convex backend — contact forms, email, data
├── packages/
│   ├── branding/     # shared brand constants and product themes
│   ├── ui/           # shared UI primitives
│   └── config/       # shared config utilities
├── turbo.json        # Turborepo pipeline
└── package.json      # workspace root
```

## Quick Start

```bash
# Install dependencies
bun install

# Start all dev servers (Turborepo TUI)
bun dev

# Or start individual services
bun dev:web      # intrface.eu     → http://localhost:3000
bun dev:aoc      # aoc.intrface.eu → http://localhost:3001
bun dev:convex   # Convex backend  → convex dev
```

## Turborepo Tasks

| Command | Description |
|---------|-------------|
| `bun dev` | Start all dev servers in the TUI |
| `bun dev:web` | Start only the web app |
| `bun dev:aoc` | Start only the AOC app |
| `bun dev:convex` | Start only the Convex dev server |
| `bun build` | Build all apps |
| `bun build:web` | Build only the web app |
| `bun build:aoc` | Build only the AOC app |
| `bun lint` | Lint all packages |
| `bun check-types` | Type-check all packages |
| `bun clean` | Clean all build artifacts and caches |

## Technology Stack

- **Build System**: Turborepo 2.x with TUI
- **Runtime**: Bun
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **TypeScript**: strict mode
- **Backend**: Convex (realtime database + serverless functions)
- **Email**: Resend (transactional email for contact forms)
- **i18n**: next-intl

## Convex Backend

The `apps/convex` workspace handles:
- Contact form submissions (`contactSubmissions` table)
- Resend email integration for transactional notifications

To activate:
1. `cd apps/convex && cp .env.example .env`
2. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to your Convex dashboard
3. Run `bun dev:convex`

## Design Philosophy

- **Product truth first** — every page is grounded in real implementation
- **Outcome-led minimalism** — strong hierarchy, clean spacing, no decorative noise
- **Shared foundations, not sameness** — tokens and primitives are shared, storytelling is independent
- **Terminal-native aesthetic** for AOC, **warm editorial** for the brand site
