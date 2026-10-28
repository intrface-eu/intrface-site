import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/site-shell";
import { productFlow, productSections, repositoryUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Product",
  description: "How AOC works: project rules, the Herdr workspace, omp agents, orchestration, memory and harness setup.",
};

export default function ProductPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Product overview"
        title="AOC sets up the rules, workspace and agents for each project."
        body="Each part below is a command or file that ships in the repository."
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
        title="One project, one planner, several workers."
        body="Set the project up once, open the workspace, plan, hand off, review."
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
          <a className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href={repositoryUrl}>
            Read the repository
          </a>
        </div>
      </SectionCard>
    </main>
  );
}
