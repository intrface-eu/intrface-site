import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { learnAudience, learnTracks } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Learn",
  description: "Learn serious agentic coding through AOC as a terminal-first, continuity-aware development environment.",
};

export default function LearnPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Learn"
        title="AOC is also a serious teaching surface for modern agentic coding."
        body="This path is for people who want to learn how to work with coding agents strategically, not just how to prompt them."
      >
        <div className="grid gap-4">
          {learnTracks.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">track 0{index + 1}</p>
              <p className="text-sm leading-7 text-white/92">{item}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Who this is for"
        title="Learning AOC means learning a better operating model."
        body="The education angle is not about memorizing tool commands. It is about developing a practical human-machine workflow that can hold up under real coding pressure."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {learnAudience.map((item) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="/consulting">
            Explore enablement
          </Link>
          <Link className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="/install">
            Try AOC directly
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
