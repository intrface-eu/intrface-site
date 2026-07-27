import { FadeIn } from "@/components/site/fade-in";

export type RuleClause = {
  /** The clause, in the words we actually operate by. */
  text: string;
  /** What it means in practice. One line. */
  detail: string;
};

export type OperatingRuleProps = {
  /** Small label above the rule. */
  label: string;
  /** The rule itself, set large. Keep it to one sentence. */
  rule: string;
  clauses: readonly RuleClause[];
  className?: string;
};

/**
 * The one rule the whole method rests on, given a band of its own so it cannot
 * be skimmed past.
 */
export function OperatingRule({ label, rule, clauses, className = "" }: OperatingRuleProps) {
  return (
    <section className={`tone-ink border-y border-rule ${className}`}>
      <div className="section-shell py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <FadeIn>
              <p className="type-section-label">{label}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="type-heading mt-5 max-w-2xl">{rule}</h2>
            </FadeIn>
          </div>

          <FadeIn delay={180}>
            <dl className="divide-y divide-rule border-y border-rule">
              {clauses.map((clause) => (
                <div className="py-5 first:pt-0 last:pb-0" key={clause.text}>
                  <dt className="text-base font-semibold tracking-[-.025em]">{clause.text}</dt>
                  <dd className="type-body mt-2 text-sm leading-6">{clause.detail}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
