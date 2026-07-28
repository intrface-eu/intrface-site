import { FadeIn } from "@/components/site/fade-in";

export type EngineeringEntry = {
  /** Short name for the decision. */
  title: string;
  /** At most two sentences: what was built and why it matters, in one breath. */
  body: string;
};

/**
 * A numbered ledger of engineering decisions, scannable in under a minute.
 * Sits on the ink band, so it inherits the inverse text floors.
 */
export function EngineeringLedger({
  entries,
  className = "",
}: {
  entries: readonly EngineeringEntry[];
  className?: string;
}) {
  return (
    <div className={`divide-y divide-rule border-y border-rule ${className}`}>
      {entries.map((entry, index) => (
        <FadeIn
          className="grid gap-4 py-8 lg:grid-cols-[1fr_1.2fr] lg:items-baseline lg:gap-14"
          delay={index * 80}
          key={entry.title}
        >
          <div className="flex gap-4">
            <span className="type-meta shrink-0 font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-xl font-semibold tracking-[-.035em]">{entry.title}</h3>
          </div>

          <p className="type-body max-w-2xl">{entry.body}</p>
        </FadeIn>
      ))}
    </div>
  );
}
