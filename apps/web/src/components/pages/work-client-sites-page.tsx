import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CaseHero, CaseSection, StatBand, type Stat } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { PipelineSteps, type PipelineStep } from "@/components/work/client-sites/pipeline-steps";
import { SiteShowcase, type SiteEntry } from "@/components/work/client-sites/site-showcase";

/** Capture paths, live URL, and the language chips. Copy comes from messages. */
const SITE_SHAPE = [
  {
    key: "cannaclean",
    languages: ["HR", "EN"],
    href: "https://cannaclean.pages.dev",
    hrefLabel: "cannaclean.pages.dev",
    desktop: "/proof/sites/cannaclean-desktop.png",
    mobile: "/proof/sites/cannaclean-mobile.png",
  },
  {
    key: "velum",
    languages: ["HR", "EN"],
    href: "https://velum-winebar.pages.dev",
    hrefLabel: "velum-winebar.pages.dev",
    desktop: "/proof/sites/velum-desktop.png",
    mobile: "/proof/sites/velum-mobile.png",
  },
  {
    key: "astyleMarine",
    languages: ["HR", "EN"],
    href: "https://astyle-marine.pages.dev",
    hrefLabel: "astyle-marine.pages.dev",
    desktop: "/proof/sites/astyle-marine-desktop.png",
    mobile: "/proof/sites/astyle-marine-mobile.png",
  },
  {
    key: "vrsarBoatTours",
    languages: ["EN", "HR", "IT", "DE"],
    href: "https://vrsar-private-boat-tours.pages.dev",
    hrefLabel: "vrsar-private-boat-tours.pages.dev",
    desktop: "/proof/sites/vrsar-boat-tours-desktop.png",
    mobile: "/proof/sites/vrsar-boat-tours-mobile.png",
  },
] as const;

export async function WorkClientSitesPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkClientSites" });

  const sites: SiteEntry[] = SITE_SHAPE.map((site) => ({
    languages: site.languages,
    href: site.href,
    hrefLabel: site.hrefLabel,
    name: t(`sites.${site.key}.name`),
    place: t(`sites.${site.key}.place`),
    line: t(`sites.${site.key}.line`),
    notes: t.raw(`sites.${site.key}.notes`) as string[],
    desktop: { src: site.desktop, alt: t(`sites.${site.key}.desktopAlt`) },
    mobile: { src: site.mobile, alt: t(`sites.${site.key}.mobileAlt`) },
  }));

  return (
    <main className="bg-paper text-ink">
      <CaseHero
        claim={t("hero.claim")}
        eyebrow={t("hero.eyebrow")}
        name={t("hero.name")}
        status={t("hero.status")}
        statusTone="accent"
        tags={t.raw("hero.tags") as string[]}
      />

      <section className="tone-raised border-b border-rule">
        <div className="section-shell py-12 sm:py-14">
          <StatBand columns={3} stats={t.raw("stats") as Stat[]} tone="raised" />
        </div>
      </section>

      <CaseSection
        intro={t("showcase.intro")}
        label={t("showcase.label")}
        title={t("showcase.title")}
        tone="paper"
      >
        <div className="divide-y divide-rule">
          {sites.map((site, index) => (
            <SiteShowcase index={index} key={site.name} priority={index === 0} site={site} />
          ))}
        </div>
      </CaseSection>

      <CaseSection
        intro={t("pipeline.intro")}
        label={t("pipeline.label")}
        title={t("pipeline.title")}
        tone="ink"
      >
        <PipelineSteps steps={t.raw("pipeline.steps") as PipelineStep[]} />

        <div className="mt-14 border-t border-rule pt-8">
          <p className="type-section-label">{t("pipeline.alsoLabel")}</p>
          <p className="type-body mt-3 max-w-2xl">{t("pipeline.alsoBody")}</p>
        </div>
      </CaseSection>

      <section className="tone-raised">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <h2 className="type-heading max-w-2xl">{t("next.title")}</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="type-body-lg mt-6 max-w-2xl">{t("next.body")}</p>
          </FadeIn>
          <FadeIn delay={180}>
            <Link className={tactileButtonClasses("primary", "mt-9")} href="/about#contact">
              {t("next.cta")}
              <IconArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
