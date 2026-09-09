import { IconArrowRight } from "@tabler/icons-react";
import { PairMark } from "@/components/site/pair-mark";
import { Link } from "@/i18n/navigation";

export type LedgerEntry = {
  name: string;
  href?: string;
  status: string;
  interfaceLine: string;
  pair: string;
};

/** A compact companion index. Unpublished products never pretend to be links. */
export function PortfolioLedger({ entries, pairLabel }: {
  entries: readonly LedgerEntry[];
  pairLabel: string;
}) {
  return (
    <div className="border-b border-rule">
      {entries.map((entry) => {
        const body = (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
            <div>
              <h3 className="type-subheading inline-flex items-center gap-3 text-ink">
                {entry.name}
                {entry.href ? <IconArrowRight aria-hidden="true" className="h-4 w-4 text-accent" /> : null}
              </h3>
              <p className="type-caption mt-2">{entry.status}</p>
            </div>
            <div>
              <p className="type-body-sm">{entry.interfaceLine}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="type-meta">{pairLabel}</span>
                <PairMark pair={entry.pair} />
              </p>
            </div>
          </div>
        );
        return entry.href ? (
          <Link
            className="block border-t border-rule py-6 hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:py-8"
            href={entry.href}
            key={entry.name}
          >{body}</Link>
        ) : <div className="border-t border-rule py-6 sm:py-8" key={entry.name}>{body}</div>;
      })}
    </div>
  );
}
