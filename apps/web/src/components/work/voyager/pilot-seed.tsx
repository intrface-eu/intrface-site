import type { ComponentType } from "react";
import { FadeIn } from "@/components/site/fade-in";

export type SeedItem = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** What kind of content is loaded. */
  label: string;
  /** One line naming the actual thing in the database. */
  detail: string;
};

/** What is already in the database for the first destination. */
export function PilotSeed({ items, className = "" }: { items: readonly SeedItem[]; className?: string }) {
  return (
    <div className={`grid gap-x-12 gap-y-8 sm:grid-cols-2 ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <FadeIn className="flex gap-4" delay={index * 70} key={item.label}>
            <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <h3 className="text-base font-semibold tracking-[-.025em] text-ink">{item.label}</h3>
              <p className="type-body mt-1.5 text-sm leading-6">{item.detail}</p>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
