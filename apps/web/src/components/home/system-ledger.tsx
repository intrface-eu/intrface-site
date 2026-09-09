import { IconArrowRight } from "@tabler/icons-react";
import { PairMark } from "@/components/site/pair-mark";
import { Link } from "@/i18n/navigation";

export type FeaturedSystem = {
  id: string;
  name: string;
  status: string;
  interfaceLine: string;
  pair: string;
  href?: string;
  linkLabel?: string;
};

/** Five owned products, with current status and stable pair-ribbon targets. */
export function SystemLedger({ systems, pairLabel }: {
  systems: readonly FeaturedSystem[];
  pairLabel: string;
}) {
  return (
    <div className="home-system-index">
      {systems.map((system) => (
        <article className="home-system-row" id={system.id} key={system.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="type-subheading">
              {system.href ? (
                <Link className="home-system-link" href={system.href} aria-label={`${system.name}: ${system.linkLabel}`}>
                  {system.name}
                  <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : system.name}
            </h3>
            <p className="type-caption text-[color:var(--ink-inverse-label)]">{system.status}</p>
          </div>
          <p className="type-body-sm mt-3">{system.interfaceLine}</p>
          <p className="home-system-pair mt-3">
            <span className="type-meta">{pairLabel}</span>
            <PairMark className="text-[color:var(--ink-inverse-muted)]" pair={system.pair} />
          </p>
        </article>
      ))}
    </div>
  );
}
