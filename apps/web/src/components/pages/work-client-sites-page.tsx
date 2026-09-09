import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ProjectPreviews } from "@/components/home/hero-proof";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { CLIENT_PROJECTS } from "@/lib/site/projects";

export async function WorkClientSitesPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkClientSites" });
  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-12 sm:pb-12 sm:pt-16">
        <Link className="type-caption inline-flex items-center gap-2 text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" href="/work" locale={locale}>
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />{t("allWork")}
        </Link>
        <h1 className="type-display mt-8">{t("title")}</h1>
        <p className="type-body-lg mt-5">{t("lead")}</p>
      </header>
      <section aria-label={t("title")} className="section-shell pb-16 sm:pb-24">
        <ProjectPreviews locale={locale} priority projects={CLIENT_PROJECTS} />
      </section>
      <section className="border-t border-rule">
        <div className="section-shell flex flex-wrap items-center justify-between gap-6 py-12 sm:py-16">
          <h2 className="type-heading">{t("contactTitle")}</h2>
          <Link className={tactileButtonClasses("primary")} href="/about?topic=client-site#contact" locale={locale}>
            {t("contact")}<IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
