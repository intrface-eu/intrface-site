import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { homepage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "AOC is a terminal-first AI workspace for structured, local-first compatible agentic coding, learning, and consulting.",
};

const workspacePanels = [
  {
    title: "Explorer",
    detail: "Yazi file navigation / repo tree / active selection",
    status: "repo-aware",
  },
  {
    title: "Agent",
    detail: "PI runtime / project context / active task thread",
    status: "running",
  },
  {
    title: "Pulse",
    detail: "session telemetry / model path / operator state",
    status: "live",
  },
  {
    title: "Taskmaster",
    detail: "work queue / subtasks / current execution lane",
    status: "synced",
  },
] as const;

const proofImages = [
  {
    src: "/proof/aoc-taskmaster.png",
    alt: "AOC Taskmaster pane showing active tasks inside the cockpit",
    title: "Taskmaster in the cockpit",
    body: "Structured work tracking stays inside the same environment as coding, navigation, and runtime operation.",
  },
  {
    src: "/proof/aoc-yazi-navigation.png",
    alt: "AOC Yazi navigation showing repo structure and continuity artifacts",
    title: "Repo-aware navigation",
    body: "Yazi exposes the real project structure, including .aoc and task artifacts, instead of hiding the machine behind a browser layer.",
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
                Terminal-first / local-first / operator-native
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl xl:text-6xl">
                A terminal-first AI workspace for serious agentic coding.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted-strong)] sm:text-xl">
                AOC keeps context, memory, tasks, and runtime control inside one disciplined workspace so work can
                continue across sessions, machines, and real projects without collapsing into disposable chat tabs.
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
                href="https://github.com/intrface-eu/agent-ops-cockpit"
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
                    continuity engine
                  </span>
                </div>
                <p className="text-base leading-8 text-[var(--muted-strong)]">
                  AI-assisted development breaks down when context is stateless, decisions disappear, and work tracking
                  lives in separate surfaces. AOC exists to keep the machine aligned with the project itself.
                </p>
              </div>

              <div className="panel-inset rounded-[24px] p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">Operator signals</p>
                <div className="space-y-3 text-sm text-white/90">
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>context in repo</span>
                    <span className="signal-dot" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>memory persisted</span>
                    <span className="signal-dot" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <span>tasks active</span>
                    <span className="signal-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:pt-4">
            <div className="screenshot-shell hover-lift rounded-[28px] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Live cockpit preview</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Actual AOC session with explorer, runtime, pulse, and work surface</p>
                </div>
                <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs text-[var(--muted)]">
                  real-session proof
                </span>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(5,8,13,0.98),rgba(8,12,19,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <Image
                  src="/proof/aoc-cockpit-hero.png"
                  alt="Full AOC cockpit session showing explorer, agent runtime, pulse, and task surface"
                  width={4384}
                  height={2402}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {workspacePanels.map((panel) => (
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
          title="A different thesis from browser-chat coding"
          body="AOC is not another glossy AI coding GUI. It is for people who want a machine-collaboration workflow that stays portable, disciplined, and grounded in the terminal."
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
            From stateless prompting to structured operator flow.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-black/22 p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#ff9a9a]">browser-chat mode</p>
              <ul className="space-y-3 text-sm leading-7 text-[var(--muted-strong)]">
                <li>Context disappears between sessions</li>
                <li>Tasks live somewhere else</li>
                <li>Architecture decisions are easy to lose</li>
                <li>The machine behaves like a disposable assistant</li>
              </ul>
            </div>
            <div className="rounded-[24px] border border-[var(--panel-border-strong)] bg-[rgba(157,255,157,0.05)] p-5 shadow-[0_0_30px_rgba(157,255,157,0.08)]">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">AOC mode</p>
              <ul className="space-y-3 text-sm leading-7 text-white/92">
                <li>Context is persisted in project artifacts</li>
                <li>Tasks stay inside the same cockpit</li>
                <li>Memory survives across active work cycles</li>
                <li>The machine operates as a strategic coding partner</li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
        <SectionCard
          eyebrow="Product proof"
          title="Built from real daily development practice"
          body="AOC is not speculative portfolio fiction. The public site should visibly reflect the workspace, repo, and operating discipline behind Intrface development."
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

        <section className="screenshot-shell rounded-[28px] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Proof gallery</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Actual operator surfaces</h2>
            </div>
            <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs text-[var(--muted)]">
              full-aspect captures
            </span>
          </div>

          <div className="grid gap-5">
            {proofImages.map((image) => (
              <article key={image.src} className="overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-black/18">
                <div className="border-b border-white/8 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">proof surface</p>
                  <h3 className="mt-2 text-xl font-medium text-white">{image.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">{image.body}</p>
                </div>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={4384}
                  height={2402}
                  className="h-auto w-full"
                />
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr] xl:items-start">
        <SectionCard
          eyebrow="Choose your path"
          title="Use AOC, learn the method, or bring it into team practice"
          body="The AOC public site should serve distinct intents without flattening them into the same CTA."
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
            Explore the product, learn the method, or work with Intrface directly.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            AOC is both a real environment and a serious approach to human-machine coding. Choose the path that matches your intent and keep the workflow grounded in the machine.
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
