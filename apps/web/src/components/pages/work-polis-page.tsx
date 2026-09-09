import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { CaseHero } from "@/components/case";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function WorkPolisPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkPolis" });

  return (
    <main className="bg-paper text-ink">
      <CaseHero claim={t("domain")} name={t("name")} status={t("status")} />
      <div className="section-shell flex flex-wrap gap-3 py-12 sm:py-16">
        <Link className={tactileButtonClasses("secondary")} href="/work">
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t("backToWork")}
        </Link>
        <Link className={tactileButtonClasses("primary")} href="/about#contact">
          {t("contact")}
          <IconArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
