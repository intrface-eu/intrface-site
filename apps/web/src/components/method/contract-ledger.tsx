import { FadeIn } from "@/components/site/fade-in";

export type ContractArtifact = {
  /** The file, as it appears in the repository. */
  file: string;
  /** What it holds, in one line. */
  description: string;
};

export type ContractLedgerProps = {
  title: string;
  artifacts: readonly ContractArtifact[];
  className?: string;
};

/**
 * The contract as it exists on disk. Files, not concepts — a reader can check
 * every line of this against one of the screenshots below.
 */
export function ContractLedger({ title, artifacts, className = "" }: ContractLedgerProps) {
  return (
    <FadeIn className={className} delay={120}>
      <div className="artifact-card rounded-[var(--radius-lg)] p-6 sm:p-7">
        <h3 className="type-section-label">{title}</h3>

        <dl className="mt-5 divide-y divide-rule border-t border-rule">
          {artifacts.map((artifact) => (
            <div className="py-4 last:pb-0" key={artifact.file}>
              <dt className="type-data text-sm font-semibold text-ink">
                {artifact.file}
              </dt>
              <dd className="type-body-sm mt-1.5">{artifact.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </FadeIn>
  );
}
