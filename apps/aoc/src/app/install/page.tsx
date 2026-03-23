import type { Metadata } from "next";
import { SectionCard } from "@/components/site-shell";
import { installNotes, installSteps } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Install",
  description: "Install AOC, verify the environment, and begin from a serious terminal-native cockpit.",
};

export default function InstallPage() {
  return (
    <main className="flex flex-col gap-8">
      <SectionCard
        eyebrow="Install"
        title="Start AOC, verify the environment, and begin from the cockpit."
        body="AOC is designed to get serious coding underway quickly, whether you are operating with a local model setup or another supported runtime path."
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
          <a className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black" href="https://github.com/intrface-eu/agent-ops-cockpit#installation">
            Read install docs
          </a>
          <a className="rounded-full border border-[var(--panel-border)] px-5 py-3 text-sm font-medium text-white" href="https://github.com/intrface-eu/agent-ops-cockpit">
            View repository
          </a>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Practical notes"
        title="The installation path is part of the product philosophy."
        body="AOC is meant to reduce friction into serious work, not replace it with another onboarding maze."
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
