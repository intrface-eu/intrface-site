import type { Metadata } from "next";
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
    detail: "Yazi-based file navigation",
  },
  {
    title: "Agent",
    detail: "PI runtime inside the project",
  },
  {
    title: "Pulse",
    detail: "session telemetry and runtime awareness",
  },
  {
    title: "Taskmaster",
    detail: "active work tracking without leaving the cockpit",
  },
] as const;

export default function AocHomePage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Terminal-first / local-first / operator-native"
        title="AOC is the serious public face of the way we actually build with machines."
        body="AOC is a terminal-first AI workspace for structured, strategic, and local-first compatible agentic coding. It is built for developers who want continuity, memory, task awareness, and operator control instead of GUI clutter, subscription logic, and disposable chat sessions."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black shadow-[0_0_30px_rgba(157,255,157,0.16)]"
                href="https://github.com/intrface-eu/agent-ops-cockpit"
              >
                View repository
              </a>
              <Link
                className="rounded-full border border-[var(--panel-border-strong)] bg-white/2 px-5 py-3 text-sm font-medium text-white"
                href="/install"
              >
                Install AOC
              </Link>
              <Link
                className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white"
                href="/learn"
              >
                Learn the approach
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {homepage.highlights.map((item, index) => (
                <div key={item} className="panel-inset rounded-2xl p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">0{index + 1}</p>
                  <p className="text-sm leading-6 text-white/92">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-inset rounded-[24px] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Workspace preview</p>
              <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs text-[var(--muted)]">
                live model
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {workspacePanels.map((panel) => (
                <div key={panel.title} className="rounded-2xl border border-white/8 bg-black/25 p-4">
                  <p className="data-label mb-2">panel</p>
                  <h3 className="text-base font-medium text-white">{panel.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{panel.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-[var(--panel-border)] bg-black/25 p-4">
              <p className="data-label mb-2">why this matters</p>
              <p className="text-sm leading-7 text-[var(--muted-strong)]">
                AOC exists because AI-assisted development breaks down when context is stateless, workflow is
                fragmented, and the machine is treated like a chat toy instead of a strategic coding partner.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Why AOC"
        title="A different thesis from browser-chat coding"
        body="AOC is not trying to be another glossy AI coding GUI. It is for people who want a machine-collaboration workflow that is portable, disciplined, and grounded in the terminal."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {homepage.pillars.map((item) => (
            <div key={item.title} className="panel-inset rounded-2xl p-5">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Product proof"
        title="Built from real daily development practice"
        body="AOC is not speculative portfolio fiction. The public site is grounded in the actual workspace, repo, and routines used to develop Intrface projects."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {homepage.proof.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">signal 0{index + 1}</p>
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Choose your path"
        title="Use AOC, learn the method, or bring it into team practice"
        body="The AOC public site is designed to serve different intents without blurring them together."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {homepage.audience.map((item) => (
            <div key={item.title} className="panel-inset rounded-2xl p-5">
              <p className="data-label mb-2">path</p>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
              <Link href={item.cta} className="mt-5 inline-flex text-sm font-medium text-[var(--accent)]">
                Continue →
              </Link>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Next step"
        title="Explore the product, learn the method, or work with Intrface directly."
        body="AOC is both a real environment and a serious way to approach agentic coding. Choose the path that matches your intent and keep the workflow grounded in the machine."
      >
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="/product">
            Explore the product
          </Link>
          <Link className="rounded-full border border-[var(--panel-border-strong)] px-5 py-3 text-sm font-medium text-white" href="/learn">
            Learn with AOC
          </Link>
          <Link className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="/consulting">
            Discuss consulting
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
