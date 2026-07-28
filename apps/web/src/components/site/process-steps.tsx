export type ProcessStep = {
  label: string;
  description: string;
  /**
   * Accepted for backward compatibility and ignored. The method describes how we
   * work, not where a given project stands, so every step renders the same.
   */
  status?: "complete" | "active" | "pending";
};

export function ProcessSteps({ steps }: { steps: readonly ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <ol className="grid gap-3">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const number = String(index + 1).padStart(2, "0");

        return (
          <li className="artifact-card relative grid grid-cols-[3rem_1fr] gap-4 rounded-[var(--radius-lg)] p-5" key={step.label}>
            <div className="relative flex justify-center">
              <span className="type-data relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-white text-xs font-bold text-ink">
                {number}
              </span>
              {!isLast ? <span className="step-connector absolute top-11 h-[calc(100%+0.75rem)] w-px" /> : null}
            </div>
            <div className="pb-1">
              <h3 className="type-title text-ink">{step.label}</h3>
              <p className="type-body mt-2">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
