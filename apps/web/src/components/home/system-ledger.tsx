import { IconArrowRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";
import { Link } from "@/i18n/navigation";

export type SystemStat = {
  /** Already formatted: "365,000", "1,336", "55". */
  value: string;
  /** What it counts. Kept short — it renders as an uppercase tracked label. */
  label: string;
};

export type FeaturedSystem = {
  name: string;
  /** Honest status label: "Pre-launch platform", "Open source · AGPL", "In build". */
  status: string;
  /** One line. What the system does. */
  claim: string;
  stats: readonly SystemStat[];
  /** Locale-aware path to the case page. */
  href: string;
  linkLabel: string;
};

/**
 * A hairline ledger, not a card grid. Sits on an ink band (`.tone-ink`), which
 * flips the hairline and muted-text tokens to their dark-band floors.
 */
export function SystemLedger({ systems }: { systems: readonly FeaturedSystem[] }) {
  if (systems.length === 0) return null;

  return (
    <div>
      {systems.map((system, index) => (
        <FadeIn delay={index * 80} key={system.name}>
          <article
            className={`grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-12 ${
              index === 0 ? "pb-10" : "border-t border-rule py-10"
            }`}
          >
            <div>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">{system.name}</h3>
              <p className="mt-4">
                <span className="type-meta inline-block rounded-full border border-rule px-3.5 py-1.5">
                  {system.status}
                </span>
              </p>
            </div>

            <div>
              <p className="type-body-lg max-w-xl">{system.claim}</p>

              <dl className="mt-7 grid gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3">
                {system.stats.map((stat) => (
                  <div className="flex flex-col" key={stat.label}>
                    <dd className="order-1 font-mono text-2xl font-semibold leading-none tabular-nums text-white sm:text-3xl">
                      {stat.value}
                    </dd>
                    <dt className="type-meta order-2 mt-3">{stat.label}</dt>
                  </div>
                ))}
              </dl>

              <Link
                className="mt-7 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                href={system.href}
              >
                {system.linkLabel}
                <IconArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
