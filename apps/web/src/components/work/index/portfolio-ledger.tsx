import { IconArrowRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";
import { Link } from "@/i18n/navigation";

export type LedgerFigure = {
  /** Already formatted: "~365,000", "2–4", "10". */
  value: string;
  /** What it counts. Uppercase tracked label. */
  label: string;
};

export type LedgerEntry = {
  /** Row number, zero-padded: "01". */
  index: string;
  name: string;
  /** Route under the current locale, e.g. `/work/voyager`. */
  href: string;
  /** Honest status: "Pre-launch", "Open source · AGPL", "Live · Vrsar". */
  status: string;
  /** `true` marks something running in the world. */
  live?: boolean;
  /** One line. What it does, in plain words. */
  claim: string;
  /** One or two hard numbers. Never more. */
  figures: readonly LedgerFigure[];
};

/**
 * The work index as a ledger, not a card grid: one hairline row per system,
 * numbers right-aligned so they read down the column.
 */
export function PortfolioLedger({ entries }: { entries: readonly LedgerEntry[] }) {
  return (
    <div className="border-b border-rule">
      {entries.map((entry, index) => (
        <FadeIn delay={index * 70} key={entry.name}>
          <Link
            className="group block border-t border-rule py-9 transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none sm:py-11"
            href={entry.href}
          >
            <div className="grid gap-6 lg:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,20rem)] lg:items-start lg:gap-10">
              {/* A row number is a label, not a measurement — mono is reserved for
                  things you could do arithmetic on. */}
              <span className="type-meta tabular-nums">{entry.index}</span>

              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <h2 className="type-heading inline-flex items-center gap-2">
                    {entry.name}
                    {/* These rows go to our own case pages, so the arrow points
                        along the page, not out of the site. */}
                    <IconArrowRight
                      aria-hidden="true"
                      className="h-[.6em] w-[.6em] text-accent transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    />
                  </h2>

                  <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-white/72 px-3 py-1.5">
                    <span
                      aria-hidden="true"
                      className={
                        entry.live
                          ? "h-1.5 w-1.5 rounded-full bg-accent"
                          : "h-1.5 w-1.5 rounded-full border border-ink-muted"
                      }
                    />
                    <span className="type-caption">{entry.status}</span>
                  </span>
                </div>

                <p className="type-body mt-4">{entry.claim}</p>
              </div>

              {/* One figure per line at `lg` so every row's numbers align down
                  the column instead of wrapping differently per label length. */}
              <dl className="flex flex-wrap gap-x-10 gap-y-5 lg:grid lg:justify-items-end lg:gap-y-6">
                {entry.figures.map((figure) => (
                  <div key={figure.label} className="lg:text-right">
                    <dd className="type-data text-2xl font-semibold leading-none tracking-[-.04em]">
                      {figure.value}
                    </dd>
                    <dt className="type-caption mt-2.5">{figure.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
