import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import type { AppLocale } from "@/i18n/routing";
import { ProjectPreviews } from "@/components/home/hero-proof";
import { PortfolioLedger, type LedgerEntry } from "@/components/work/index/portfolio-ledger";

const OTHER_PRODUCTS = [
  { key: "polis", href: "/work/polis" },
  { key: "funda", href: "/work/funda" },
  { key: "midiflow" },
  { key: "patchbay" },
] as const;

export async function WorkIndexPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkIndex" });
  const entries: LedgerEntry[] = OTHER_PRODUCTS.map((entry) => ({
    ...("href" in entry ? { href: entry.href } : {}),
    name: t(`entries.${entry.key}.name`),
    status: t(`entries.${entry.key}.status`),
    interfaceLine: t(`entries.${entry.key}.interface`),
    pair: t(`entries.${entry.key}.pair`),
  }));

  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-12 sm:pb-12 sm:pt-16">
        <h1 className="type-display">{t("title")}</h1>
        <p className="type-body-lg mt-5">{t("lead")}</p>
      </header>
      <section aria-label={t("selectedWork")} className="section-shell pb-16 sm:pb-24">
        <ProjectPreviews locale={locale} priority />
      </section>
      <section className="border-t border-rule">
        <div className="section-shell py-16 sm:py-20">
          <h2 className="type-heading mb-8 sm:mb-10">{t("otherProducts")}</h2>
          <PortfolioLedger entries={entries} pairLabel={t("pairLabel")} />
        </div>
      </section>
      {/* The same way out as every project page: the form on /services. */}
      <section className="border-t border-rule">
        <div className="section-shell flex flex-wrap items-center justify-between gap-6 py-12 sm:py-16">
          <h2 className="type-heading">{t("contactTitle")}</h2>
          <Link className={tactileButtonClasses("primary")} href="/services#start" locale={locale}>
            {t("contact")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
