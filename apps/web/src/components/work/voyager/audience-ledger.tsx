import type { ComponentType } from "react";
import { FadeIn } from "@/components/site/fade-in";

export type AudienceRow = {
  /** Who this row is for: "Visitors", "Businesses", "Tourist boards". */
  role: string;
  /** Tabler icon component. */
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** One line: what this audience gets. */
  headline: string;
  /** Two or three sentences of plain detail. */
  body: string;
};

/**
 * Three audiences on one hairline ledger. Deliberately not a card grid — the
 * point is that these sit on the same data model, not in separate boxes.
 */
export function AudienceLedger({ rows, className = "" }: { rows: readonly AudienceRow[]; className?: string }) {
  return (
    <div className={`divide-y divide-rule border-y border-rule ${className}`}>
      {rows.map((row, index) => {
        const Icon = row.icon;

        return (
          <FadeIn
            className="grid gap-4 py-9 lg:grid-cols-[13rem_1fr] lg:items-start lg:gap-12"
            delay={index * 80}
            key={row.role}
          >
            <div className="flex items-center gap-3">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
              <p className="type-meta text-ink">{row.role}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-.035em] text-ink">{row.headline}</h3>
              <p className="type-body mt-3 max-w-2xl">{row.body}</p>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
