import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { homepage, repositoryUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "AOC sets up Herdr, omp, Claude Code and Codex so one planning session can hand coding work to agents in the terminal.",
};

const startCommands = [
  {
    command: "curl -fsSL .../install/bootstrap.sh | bash",
    note: "install AOC, or run ./install.sh from a clone",
  },
  { command: "aoc-doctor", note: "check the machine; fix anything marked required" },
  { command: "aoc-init", note: "write the agent rules into the project" },
  { command: "aoc", note: "open the project's Herdr workspace" },
] as const;

const workspaceRoles = [
  {
    title: "Herdr",
    detail: "workspaces / tabs / panes / agent status",
    status: "workspace",
  },
  {
    title: "omp",
    detail: "coding agent, started by aoc-omp with project context",
    status: "worker",
  },
  {
    title: "Claude Code",
    detail: "plans, sends packets, reviews diffs, commits",
    status: "planner",
  },
  {
    title: "Codex",
    detail: "config and design skills from aoc-claude-install",
    status: "harness",
  },
] as const;

export default function AocHomePage() {
  return (
    <main className="flex flex-col gap-8">
      <section className="hero-shell overflow-hidden rounded-[32px] border border-[var(--panel-border)] px-6 py-8 sm:px-8 sm:py-10">
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
                Herdr workspace / omp workers / Claude planner
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl xl:text-6xl">
                One planning session, several coding agents, one terminal.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted-strong)] sm:text-xl">
                AOC sets up each repo for coding agents. It writes the rules they follow, opens a Herdr workspace, and
                lets a Claude Code session hand slices of work to omp agents in their own panes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black shadow-[0_0_30px_rgba(157,255,157,0.16)] transition hover:translate-y-[-1px] hover:opacity-95"
                href="/install"
              >
                Install AOC
              </Link>
              <a
                className="rounded-full border border-[var(--panel-border-strong)] bg-white/2 px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={repositoryUrl}
              >
                View repository
              </a>
              <Link
                className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)]"
                href="/learn"
              >
                Learn the approach
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {homepage.highlights.map((item, index) => (
                <div key={item} className="panel-inset interactive-panel rounded-2xl p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">0{index + 1}</p>
                  <p className="text-sm leading-6 text-white/92">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="panel-inset rounded-[24px] p-5">
                <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Why AOC matters</p>
                  <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs text-[var(--muted)]">
                    files, not chat
                  </span>
                </div>
                <p className="text-base leading-8 text-[var(--muted-strong)]">
                  Agents drift when their rules and memory live in chat history. AOC keeps the rules in the repo, the
                  memory in one folder per repo, and each worker in a pane you can watch.
                </p>
              </div>

              <div className="panel-inset rounded-[24px] p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">Operator signals</p>
                <div className="space-y-3 text-sm text-white/90">
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>rules in AGENTS.md</span>
                    <span className="signal-dot" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>memory in ~/.aoc/memory</span>
                    <span className="signal-dot" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>workers in Herdr panes</span>
                    <span className="signal-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:pt-4">
            <div className="screenshot-shell rounded-[28px] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Start</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">From a fresh machine to a project workspace</p>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs text-[var(--muted)]">
                  4 commands
                </span>
              </div>

              <ol className="space-y-3">
                {startCommands.map((step, index) => (
                  <li key={step.command} className="rounded-2xl border border-white/8 bg-black/30 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">0{index + 1}</p>
                    <code className="mt-1 block break-words font-mono text-sm text-[var(--accent)]">{step.command}</code>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-strong)]">{step.note}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {workspaceRoles.map((panel) => (
                <div key={panel.title} className="panel-inset interactive-panel rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="data-label">{panel.title}</p>
                    <span className="text-xs text-[var(--muted)]">{panel.status}</span>
                  </div>
                  <p className="text-sm leading-6 text-white/90">{panel.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <SectionCard
          eyebrow="Why AOC"
          title="Agents work in panes you can see, on rules you can read"
          body="AOC runs in the terminal. Each agent gets its own Herdr pane, and every rule it follows is a file in the repo or your home folder."
        >
          <div className="grid gap-4">
            {homepage.pillars.map((item) => (
              <div key={item.title} className="panel-inset interactive-panel rounded-2xl p-5">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <section className="comparison-shell rounded-[28px] p-6 sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Workflow contrast</p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            From one chat thread to a planner and its workers.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-black/22 p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#ff9a9a]">browser-chat mode</p>
              <ul className="space-y-3 text-sm leading-7 text-[var(--muted-strong)]">
                <li>Context disappears between sessions</li>
                <li>Open work lives somewhere else</li>
                <li>Architecture decisions are easy to lose</li>
                <li>One chat plans and types the code</li>
              </ul>
            </div>
            <div className="rounded-[24px] border border-[var(--panel-border-strong)] bg-[rgba(157,255,157,0.05)] p-5 shadow-[0_0_30px_rgba(157,255,157,0.08)]">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">AOC mode</p>
              <ul className="space-y-3 text-sm leading-7 text-white/92">
                <li>Project rules sit in AGENTS.md and load at start</li>
                <li>Work goes out as written packets with file scopes</li>
                <li>Memory sits in ~/.aoc/memory/&lt;repo&gt;/</li>
                <li>The planner reviews and commits every change</li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <SectionCard
        eyebrow="Product proof"
        title="Built from the setup Intrface works in"
        body="Every command named on this page ships in the public repository."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {homepage.proof.map((item, index) => (
            <div key={item} className="panel-inset interactive-panel rounded-2xl p-5 text-sm leading-7 text-white/92">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">signal 0{index + 1}</p>
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr] xl:items-start">
        <SectionCard
          eyebrow="Choose your path"
          title="Use AOC, learn the method, or bring it to your team"
          body="Pick the route that matches why you are here."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {homepage.audience.map((item) => (
              <div key={item.title} className="panel-inset interactive-panel rounded-2xl p-5">
                <p className="data-label mb-2">path</p>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                <Link href={item.cta} className="mt-5 inline-flex text-sm font-medium text-[var(--accent)] transition hover:translate-x-1">
                  Continue →
                </Link>
              </div>
            ))}
          </div>
        </SectionCard>

        <section className="panel-surface rounded-[28px] p-6 sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Next step</p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Read how each part works, or ask Intrface to set it up with you.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            The product page covers each command. Intrface also sets AOC up for teams and trains them on the planner-and-workers flow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black transition hover:translate-y-[-1px]" href="/product">
              Explore the product
            </Link>
            <Link className="rounded-full border border-[var(--panel-border-strong)] px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]" href="/learn">
              Learn with AOC
            </Link>
            <Link className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)]" href="/consulting">
              Discuss consulting
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
