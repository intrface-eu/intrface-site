import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/site/fade-in";
import {
  PortfolioLedger,
  type LedgerEntry,
  type LedgerFigure,
} from "@/components/work/index/portfolio-ledger";

/** Row order, route, and the "running in the world" flag. Copy comes from messages. */
const ENTRY_SHAPE = [
  { index: "01", key: "voyager", href: "/work/voyager", live: false },
  { index: "02", key: "polis", href: "/work/polis", live: false },
  { index: "03", key: "funda", href: "/work/funda", live: false },
  { index: "04", key: "clientSites", href: "/work/client-sites", live: true },
] as const;

export async function WorkIndexPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkIndex" });

  const entries: LedgerEntry[] = ENTRY_SHAPE.map((entry) => ({
    index: entry.index,
    href: entry.href,
    live: entry.live,
    name: t(`entries.${entry.key}.name`),
    status: t(`entries.${entry.key}.status`),
    claim: t(`entries.${entry.key}.claim`),
    figures: t.raw(`entries.${entry.key}.figures`) as LedgerFigure[],
  }));

  const methodFigures = t.raw("method.figures") as LedgerFigure[];

  return (
    <main className="bg-paper text-ink">
      <section className="border-b border-rule tone-paper">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <p className="type-section-label">{t("label")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="type-display mt-6">{t("title")}</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="type-body-lg mt-7 font-medium">{t("lead")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="tone-raised">
        <div className="section-shell py-16 sm:py-20">
          <PortfolioLedger entries={entries} />
        </div>
      </section>

      <section className="tone-ink border-t border-rule">
        <div className="section-shell py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("method.label")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                <h2 className="type-heading mt-5">{t("method.title")}</h2>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="type-body mt-6 max-w-xl">{t("method.body")}</p>
              </FadeIn>
              <FadeIn delay={240}>
                <Link
                  className="type-meta mt-9 inline-flex items-center gap-2 border-b border-rule pb-1.5 transition-colors hover:border-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none"
                  href="/method"
                >
                  {t("method.link")}
                  <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </FadeIn>
            </div>

            <dl className="grid gap-8 sm:grid-cols-3 lg:gap-6">
              {methodFigures.map((figure, index) => (
                <FadeIn delay={index * 70} key={figure.label}>
                  <dd className="type-data text-3xl font-semibold leading-none tracking-[-.04em]">
                    {figure.value}
                  </dd>
                  <dt className="type-caption mt-3">{figure.label}</dt>
                </FadeIn>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
