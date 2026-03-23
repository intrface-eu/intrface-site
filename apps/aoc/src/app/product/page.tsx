import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { productFlow, productSections } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Product",
  description: "How AOC works: context, memory, tasks, runtime, and the cockpit that keeps them together.",
};

export default function ProductPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Product overview"
        title="AOC combines context, memory, tasks, and runtime into one cockpit."
        body="The public explanation should stay readable, but the underlying system is real: the workspace is organized around persistent project continuity and terminal-native operation."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {productSections.map((section) => (
            <div key={section.title} className="panel-inset rounded-2xl p-5">
              <p className="data-label mb-2">module</p>
              <h3 className="text-lg font-medium">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{section.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Workflow"
        title="The system is designed to keep the operator in one serious surface."
        body="AOC is easiest to understand as a loop: enter the project, operate inside the cockpit, retain continuity, and keep work moving without scattering state across tools."
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {productFlow.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">step 0{index + 1}</p>
              <p className="text-sm leading-7 text-white/92">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="/install">
            Start with install
          </Link>
          <a className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="https://github.com/intrface-eu/agent-ops-cockpit">
            Read the repository
          </a>
        </div>
      </SectionCard>
    </main>
  );
}
