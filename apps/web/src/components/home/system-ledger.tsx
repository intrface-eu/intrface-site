import { IconArrowRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";
import { Link } from "@/i18n/navigation";

export type FeaturedSystem = {
  name: string;
  /** The canonical status label from the contract, character-for-character:
   *  "Pre-launch", "Open source · AGPL · pre-deployment", "Active build". */
  status: string;
  /** The canonical product line: "The interface for a place." */
  interfaceLine: string;
  /** The two sides the product sits between: "visitor ↔ place". Every row
   *  carries one, set the same way — that repetition is the argument. */
  pair: string;
  /** One line. What the product does. */
  claim: string;
  /** Short spec fields — a standard, a licence, a capability figure. Set in
   *  mono, because that is what they are: identifiers and counts. Empty for a
   *  product with no approved numbers yet. */
  spec: readonly string[];
  /** Locale-aware path to the case page. Absent when there is no case page —
   *  the row then renders without a link rather than with a dead one. */
  href?: string;
  linkLabel?: string;
};

/**
 * A hairline ledger, not a card grid. Sits on an ink band (`.tone-ink`), which
 * flips the hairline and muted-text tokens to their dark-band floors.
 *
 * The name column is deliberately narrow: it holds a name, a status label and
 * the pair. No volume metrics here — how many lines of TypeScript a product
 * contains is not something a buyer can act on, and the case page is where
 * that detail belongs.
 */
export function SystemLedger({
  systems,
  pairLabel,
}: {
  systems: readonly FeaturedSystem[];
  pairLabel: string;
}) {
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
              <p className="lg:mt-4">
                <span className="type-meta">{pairLabel}</span>{" "}
                <span className="type-artifact text-[color:var(--ink-inverse-muted)]">
                  {system.pair}
                </span>
              </p>
            </div>

            <div>
              <p className="type-title text-white">{system.interfaceLine}</p>
              <p className="type-body-lg mt-3">{system.claim}</p>

              {system.spec.length > 0 ? (
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
              ) : null}

              {system.href && system.linkLabel ? (
                <Link
                  className="mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  href={system.href}
                >
                  {system.linkLabel}
                  <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
