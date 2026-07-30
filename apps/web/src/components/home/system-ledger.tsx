import { IconArrowRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";
import { Link } from "@/i18n/navigation";

export type FeaturedSystem = {
  name: string;
  /** One readiness word from one vocabulary: "In build", "Pre-launch",
   *  "Pre-deployment". Licence and stack belong in `spec`, not here — mixing
   *  the two is what made these three systems impossible to rank. */
  status: string;
  /** One line. What the system does. */
  claim: string;
  /** Short spec fields — a standard, a licence, a capability figure. Set in
   *  mono, because that is what they are: identifiers and counts. */
  spec: readonly string[];
  /** Locale-aware path to the case page. */
  href: string;
  linkLabel: string;
};

/**
 * A hairline ledger, not a card grid. Sits on an ink band (`.tone-ink`), which
 * flips the hairline and muted-text tokens to their dark-band floors.
 *
 * The name column is deliberately narrow: it holds a name and a status word,
 * and it used to be given nearly as much width as the column carrying the
 * claim, the figures and the link. No volume metrics here — how many lines of
 * TypeScript a system contains is not something a buyer can act on, and the
 * case page is where that detail belongs.
 */
export function SystemLedger({ systems }: { systems: readonly FeaturedSystem[] }) {
  if (systems.length === 0) return null;

  return (
    <div>
      {systems.map((system, index) => (
        <FadeIn delay={index * 80} key={system.name}>
          <article
            className={`grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] ${
              index === 0 ? "pb-9" : "border-t border-rule py-9"
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 lg:block">
              <h3 className="type-subheading text-white">{system.name}</h3>
              <p className="lg:mt-3">
                <span className="type-meta inline-block rounded-full border border-rule px-3 py-1.5">
                  {system.status}
                </span>
              </p>
            </div>

            <div>
              <p className="type-body-lg">{system.claim}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {system.spec.map((field) => (
                  <li
                    className="type-artifact rounded-full border border-rule px-3 py-1 text-[color:var(--ink-inverse-muted)]"
                    key={field}
                  >
                    {field}
                  </li>
                ))}
              </ul>

              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
