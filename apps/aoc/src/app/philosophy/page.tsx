import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { philosophyPoints, philosophyPrinciples } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "The worldview behind AOC: structured, terminal-native, local-first compatible human-machine coding.",
};

export default function PhilosophyPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Philosophy"
        title="AOC is built on a disciplined view of human-machine coding."
        body="The goal is not to chat more. The goal is to work better with machines through continuity, structure, and operator control."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {philosophyPoints.map((point) => (
            <div key={point.title} className="panel-inset rounded-2xl p-5">
              <p className="data-label mb-2">principle</p>
              <h3 className="text-lg font-medium">{point.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{point.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Core stance"
        title="This is the operating doctrine underneath AOC."
        body="These principles shape both the product and the way Intrface uses it in practice."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {philosophyPrinciples.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">signal 0{index + 1}</p>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="/product">
            See the system
          </Link>
          <Link className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="/learn">
            Learn the approach
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
