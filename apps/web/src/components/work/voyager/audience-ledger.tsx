import type { ComponentType } from "react";
import { FadeIn } from "@/components/site/fade-in";

export type AudienceRow = {
  /** Who this row is for: "Visitors", "Businesses", "Tourist boards". */
  role: string;
  /** Tabler icon component. */
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** One line. What this audience gets — no sub-paragraph. */
  line: string;
};

/**
 * Three audiences on one hairline ledger, one line each. Deliberately not a
 * card grid — the point is that these sit on the same data model.
 */
export function AudienceLedger({ rows, className = "" }: { rows: readonly AudienceRow[]; className?: string }) {
  return (
    <div className={`divide-y divide-rule border-y border-rule ${className}`}>
      {rows.map((row, index) => {
        const Icon = row.icon;

        return (
          <FadeIn
            className="grid gap-3 py-7 lg:grid-cols-[13rem_1fr] lg:items-baseline lg:gap-12"
            delay={index * 80}
            key={row.role}
          >
            <div className="flex items-center gap-3">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
              <p className="type-meta text-ink">{row.role}</p>
            </div>

            <p className="type-body-lg max-w-2xl">{row.line}</p>
          </FadeIn>
        );
      })}
    </div>
  );
}
