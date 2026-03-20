import Link from "next/link";
import {
  aocArchitecture,
  aocCapabilities,
  aocEvolution,
  aocLinks,
  aocPainPoints,
  aocQuickStart,
  aocWorkspace,
} from "@/lib/site/aoc-content";

export default function AocPage() {
  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">Flagship Product</p>
            <div className="space-y-4">
              <p className="type-meta">AOC — Agent Ops Cockpit</p>
              <h1 className="type-display max-w-5xl">
                A terminal-first AI workspace for agentic development.
              </h1>
            </div>
            <p className="type-body-lg max-w-3xl">
              AOC unifies context-aware operation, project memory, integrated
              task management, and a Zellij-based workspace into one terminal
              environment for AI-assisted development.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={aocLinks.github}
                target="_blank"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                View on GitHub
              </Link>
              <Link
                href="#quick-start"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                Install AOC
              </Link>
              <Link
                href="#architecture"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                Explore Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Why AOC</p>
              <h2 className="type-heading max-w-md">
                Built for the real failure modes of AI-assisted development.
              </h2>
              <p className="type-body max-w-lg">
                AOC is grounded in a practical problem: most AI development
                workflows lose continuity fast. Context disappears, decisions go
                unrecorded, and work gets scattered across too many surfaces.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {aocPainPoints.map((point) => (
                <article
                  key={point}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <p className="text-lg font-medium tracking-[-0.02em] text-foreground">
                    {point}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="type-section-label">Distributed Cognitive Architecture</p>
            <h2 className="type-heading">
              Three persistent project layers that give the workspace memory and continuity.
            </h2>
            <p className="type-body">
              These are not abstract marketing labels. AOC persists project state
              in concrete repo artifacts so agents and operators can continue work
              across sessions with more context intact.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {aocArchitecture.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-rule bg-card p-6"
              >
                <p className="type-meta">{item.path}</p>
                <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground">
                  {item.title}
                </h3>
                <p className="type-body mt-4">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Unified Workspace</p>
              <h2 className="type-heading max-w-md">
                One cockpit, organized around real terminal-native tools.
              </h2>
              <p className="type-body max-w-lg">
                AOC brings together file navigation, agent operation, task
                management, and utility panes inside a persistent Zellij layout
                instead of pushing work across disconnected windows.
              </p>
            </div>
            <div className="rounded-2xl border border-rule bg-foreground p-6 text-background">
              <p className="text-sm uppercase tracking-[0.18em] text-background/65">
                Workspace Composition
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {aocWorkspace.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-background/12 bg-background/4 px-4 py-4 text-sm tracking-[-0.01em]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Core Capabilities</p>
              <h2 className="type-heading max-w-md">
                A rigorous operator surface, not a generic AI wrapper.
              </h2>
            </div>
            <div className="grid gap-3">
              {aocCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quick-start" className="border-b border-rule bg-panel scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">How It Works</p>
              <h2 className="type-heading max-w-md">
                Install once, launch inside a project, continue with persistent state.
              </h2>
              <p className="type-body max-w-lg">
                The practical flow is straightforward: install AOC, verify the
                environment, run it inside a project, and operate from a cockpit
                that keeps context, memory, and tasks close to the work.
              </p>
            </div>
            <div className="rounded-2xl border border-rule bg-card p-6">
              <p className="type-meta">Quick Start</p>
              <div className="mt-5 space-y-3">
                {aocQuickStart.map((command, index) => (
                  <div key={command} className="rounded-xl border border-rule bg-background p-4">
                    <p className="type-meta">Step {index + 1}</p>
                    <code className="mt-2 block overflow-x-auto font-mono text-sm text-foreground">
                      {command}
                    </code>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={aocLinks.docs}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel"
                >
                  Read Documentation
                </Link>
                <Link
                  href={aocLinks.github}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel"
                >
                  View Repository
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Roadmap / Evolution</p>
              <h2 className="type-heading max-w-md">
                AOC is evolving as a durable workspace system.
              </h2>
              <p className="type-body max-w-lg">
                The trajectory is visible in the product itself: stronger
                workspace foundations, deeper continuity systems, better runtime
                control, and more robust workflows for serious coding projects.
              </p>
            </div>
            <div className="grid gap-4">
              {aocEvolution.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <p className="type-body">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">
                Final CTA
              </p>
              <h2 className="type-heading max-w-2xl text-background">
                Explore the repository, read the docs, or install AOC and work from the cockpit.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">
                AOC is already legible as a real product: a terminal-first AI
                workspace grounded in context, memory, tasks, and operator flow.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-start">
              <Link
                href={aocLinks.github}
                target="_blank"
                className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                View on GitHub
              </Link>
              <Link
                href={aocLinks.docs}
                target="_blank"
                className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
