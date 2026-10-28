import type { Metadata } from "next";
import { SectionCard } from "@/components/site-shell";
import { installNotes, installSteps, repositoryUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Install",
  description: "Install AOC, check the machine with aoc-doctor, and open a project workspace.",
};

export default function InstallPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Install"
        title="Install AOC, check the machine, open the workspace."
        body="Four commands take a machine from nothing to a project workspace."
      >
        <div className="grid gap-4">
          {installSteps.map((item, index) => (
            <div key={item} className="panel-inset rounded-2xl p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">step 0{index + 1}</p>
              <p className="text-sm leading-7 text-white/92">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href={`${repositoryUrl}#install`}>
            Read install docs
          </a>
          <a className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href={repositoryUrl}>
            View repository
          </a>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Practical notes"
        title="What the installer needs and what it touches."
        body="Read this before you run it."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {installNotes.map((item) => (
            <div key={item} className="panel-inset rounded-2xl p-5 text-sm leading-7 text-white/92">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
