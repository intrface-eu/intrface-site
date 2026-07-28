import type { ReactNode } from "react";
import { FadeIn } from "@/components/site/fade-in";

export type Fact = {
  /** Uppercase tracked term, e.g. "Based". */
  term: string;
  /** Plain value. Keep it to one line. */
  value: ReactNode;
};

export type FactLedgerProps = {
  facts: readonly Fact[];
  className?: string;
};

/**
 * Hairline term/value rows. Use it for facts that are not numbers — the numeric
 * form lives in `StatBand`.
 */
export function FactLedger({ facts, className = "" }: FactLedgerProps) {
  if (facts.length === 0) return null;

  return (
    <dl className={`divide-y divide-rule border-y border-rule ${className}`}>
      {facts.map((fact, index) => (
        <FadeIn
          className="grid gap-1.5 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
          delay={index * 60}
          key={fact.term}
        >
          <dt className="type-meta sm:pt-1">{fact.term}</dt>
          <dd className="type-body text-ink">{fact.value}</dd>
        </FadeIn>
      ))}
    </dl>
  );
}
