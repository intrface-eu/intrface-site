<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agent Ops Cockpit (AOC)
Use the AOC tools for context, memory, and tasks in this repo.

- **Context:** `.aoc/context.md` (auto-generated project map)
- **Memory:** use `aoc-mem read/search/add` via Bash tool (do not edit `.aoc/memory.md` directly)
- **Short-term memory:** use `aoc-stm` (draft), `aoc-stm handoff` (seal), and `aoc-stm resume`/`aoc-stm read` (resume) via Bash tool (do not read `.aoc/stm/current.md` directly)
- **Tasks:** use `tm` or `aoc-task` via Bash tool (do not edit `.taskmaster/tasks/tasks.json` directly)
- **Task PRDs:** tag-level defaults + task-level overrides via `aocPrd` (resolve with `aoc-task tag prd show --tag <tag>` and `aoc-task prd show <id> --tag <tag>`)
- **RTK routing (default-on for new AOC repos):** allowlisted commands route via RTK in AOC panes; manage with `aoc-rtk status|enable|disable|doctor|install --auto` and `.aoc/rtk.toml`

If AOC files are missing or stale, run `aoc-init` at the repo root.
