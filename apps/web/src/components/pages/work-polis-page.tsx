import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { CaseHero } from "@/components/case";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function WorkPolisPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkPolis" });
  const grid = await getTranslations({ locale, namespace: "HomeGrid.common" });
  const show = await getTranslations({ locale, namespace: "Showcase" });

  return (
    <main className="bg-paper text-ink">
      <CaseHero claim={t("domain")} name={t("name")} status={t("status")} />
      <div className="section-shell py-12 sm:py-16">
        {/* The same note home and /work give Polis. */}
        <p className="type-body-lg text-ink-muted">{show("polisNote")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={tactileButtonClasses("secondary")} href="/">
            <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
            {grid("backToGrid")}
          </Link>
          <Link className={tactileButtonClasses("primary")} href="/services?need=public-service#start">
            {t("contact")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
