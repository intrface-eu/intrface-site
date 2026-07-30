import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CaseHero, CaseNav, CaseSection, StatBand, type Stat } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { PipelineSteps, type PipelineStep } from "@/components/work/client-sites/pipeline-steps";
import { SiteShowcase, type SiteEntry } from "@/components/work/client-sites/site-showcase";

/**
 * Capture paths, live URL, and the language chips. Copy comes from messages.
 *
 * Only sites the client has been handed belong here. Others exist but are
 * still in delivery — see `docs/site-revamp-contract.md`, which names them and
 * says why they must not be named, linked, or shown on this site yet. Do not
 * add one back without the owner saying so.
 */
const SITE_SHAPE = [
  {
    key: "velum",
    languages: ["HR", "EN"],
    href: "https://velum-winebar.com",
    hrefLabel: "velum-winebar.com",
    desktop: "/proof/sites/velum-desktop.png",
    mobile: "/proof/sites/velum-mobile.png",
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

        {/* More sites exist. None of them are ours to name, link, or show
            until the client has been handed the work. */}
        <FadeIn>
          <div className="mt-4 border-t border-rule pt-8 lg:mt-10">
            <p className="type-section-label">{t("showcase.inDeliveryLabel")}</p>
            <p className="type-body mt-3">{t("showcase.inDelivery")}</p>
          </div>
        </FadeIn>
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
          <p className="type-body mt-3">{t("pipeline.alsoBody")}</p>
        </div>
      </CaseSection>

      <section className="tone-raised">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <h2 className="type-heading">{t("next.title")}</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="type-body-lg mt-6">{t("next.body")}</p>
          </FadeIn>
          <FadeIn delay={180}>
            {/* `?topic=` preselects the matching chip on arrival, so the form
                does not start on a topic this page is not about. */}
            <Link
              className={tactileButtonClasses("primary", "mt-9")}
              href="/about?topic=client-site#contact"
            >
              {t("next.cta")}
              <IconArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <CaseNav current="clientSites" />
    </main>
  );
}
