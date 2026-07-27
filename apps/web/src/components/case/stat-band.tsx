import { FadeIn } from "@/components/site/fade-in";
import type { CaseTone } from "@/components/case/case-section";

export type Stat = {
  /** The number, already formatted: "1,336", "~365,000", "20 months". */
  value: string;
  /** What it counts. Uppercase tracked label. */
  label: string;
  /** Optional qualifier — say "first-party", "seeded", "simulated" here. */
  note?: string;
};

export type StatBandProps = {
  stats: readonly Stat[];
  /**
   * `paper` and `raised` render a hairline ledger straight onto the band.
   * `ink` renders a self-contained dark panel and can sit on any background.
   */
  tone?: CaseTone;
  /** Columns at `sm` and up. Below that the band stacks. */
  columns?: 2 | 3 | 4;
  className?: string;
};

const toneClasses: Record<CaseTone, string> = {
  paper: "border-y border-rule",
  raised: "border-y border-rule",
  ink: "tone-ink rounded-[var(--radius-lg)] border border-rule px-6 py-6 sm:px-8",
};

export function StatBand({ stats, tone = "paper", columns = 3, className = "" }: StatBandProps) {
  if (stats.length === 0) return null;

  return (
    <dl className={`stat-ledger ${toneClasses[tone]} ${className}`} data-cols={columns}>
      {stats.map((stat, index) => (
        <FadeIn className="flex flex-col" delay={index * 60} key={stat.label}>
          <dd className="order-1 font-mono text-4xl font-semibold leading-none tracking-[-.04em] tabular-nums sm:text-5xl">
            {stat.value}
          </dd>
          <dt className="type-meta order-2 mt-3">{stat.label}</dt>
          {stat.note ? <dd className="type-body order-3 mt-2 text-sm leading-6">{stat.note}</dd> : null}
        </FadeIn>
      ))}
    </dl>
  );
}
