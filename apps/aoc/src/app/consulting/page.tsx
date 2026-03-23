import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { consultingOffers, consultingOutcomes } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Use AOC as a basis for team enablement, local-first workflow strategy, and structured agentic coding adoption.",
};

export default function ConsultingPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Consulting"
        title="Use AOC as the basis for team enablement and workflow design."
        body="Intrface can use AOC as a concrete operating model for teams that want more disciplined, local-first, and continuity-aware agentic coding practices."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {consultingOffers.map((item) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Expected outcomes"
        title="The goal is not just tool adoption. It is operator maturity."
        body="AOC becomes valuable when teams use it to create a clearer, more durable way of working with machines."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {consultingOutcomes.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent-secondary)]">outcome 0{index + 1}</p>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="mailto:hello@intrface.eu?subject=AOC%20consulting">
            Discuss consulting
          </a>
          <Link className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="/learn">
            See the learning path
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
