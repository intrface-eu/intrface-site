import { IconArrowRight, IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { CaseHero, CaseSection, HonestNote, StatBand, type Stat } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { LabelTaxonomy } from "@/components/work/polis/label-taxonomy";
import { TrustPipelineDiagram } from "@/components/work/polis/trust-pipeline-diagram";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const REPO_URL = "https://github.com/basicalex/polis";

type EngineeringEntry = { title: string; body: string; why: string };

export async function WorkPolisPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkPolis" });
  const engineering = t.raw("engineering.entries") as EngineeringEntry[];

  return (
    <main className="bg-paper text-ink">
      <CaseHero
        claim={t("hero.claim")}
        eyebrow={t("hero.eyebrow")}
        name={t("hero.name")}
        status={t("hero.status")}
        tags={t.raw("hero.tags") as string[]}
      />

      <section className="tone-paper border-b border-rule">
        <div className="section-shell py-14 sm:py-16">
          <StatBand columns={4} stats={t.raw("stats") as Stat[]} />

          <FadeIn>
            <a
              className={tactileButtonClasses("secondary", "mt-10")}
              href={REPO_URL}
              rel="noreferrer"
              target="_blank"
            >
              <IconBrandGithub aria-hidden="true" className="h-4 w-4" />
              <span>{t("readSourceRepo")}</span>
              <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </FadeIn>
        </div>
      </section>

      <CaseSection
        intro={t("whatItIs.intro")}
        label={t("whatItIs.label")}
        title={t("whatItIs.title")}
        tone="raised"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <FadeIn>
            <h3 className="text-lg font-semibold tracking-[-.02em]">{t("whatItIs.surfacesTitle")}</h3>
            <p className="type-body mt-3 max-w-xl text-sm leading-6">{t("whatItIs.surfacesBody")}</p>
          </FadeIn>
          <FadeIn delay={80}>
            <h3 className="text-lg font-semibold tracking-[-.02em]">{t("whatItIs.addressTitle")}</h3>
            <p className="type-body mt-3 max-w-xl text-sm leading-6">{t("whatItIs.addressBody")}</p>
          </FadeIn>
        </div>
      </CaseSection>

      <CaseSection
        intro={t("engineering.intro")}
        label={t("engineering.label")}
        title={t("engineering.title")}
        tone="paper"
      >
        <ol className="divide-y divide-rule border-y border-rule">
          {engineering.map((item, index) => (
            <FadeIn delay={index * 60} key={item.title}>
              <li className="grid gap-x-10 gap-y-4 py-8 lg:grid-cols-[4rem_1fr]">
                <span className="font-mono text-[0.8rem] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="max-w-2xl">
                  <h3 className="text-lg font-semibold tracking-[-.02em]">{item.title}</h3>
                  <p className="type-body mt-3 text-sm leading-6">{item.body}</p>
                  <p className="mt-3 text-sm leading-6 text-ink">
                    <span className="type-meta mr-2">{t("engineering.whyLabel")}</span>
                    {item.why}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>

        <FadeIn>
          <p className="type-body mt-10 max-w-2xl">{t("engineering.closing")}</p>
        </FadeIn>
      </CaseSection>

      <CaseSection
        intro={t("honesty.intro")}
        label={t("honesty.label")}
        title={t("honesty.title")}
        tone="ink"
      >
        <FadeIn>
          <LabelTaxonomy />
        </FadeIn>

        <FadeIn delay={120}>
          <p className="type-body mt-10 max-w-2xl">{t("honesty.closing")}</p>
        </FadeIn>
      </CaseSection>

      <CaseSection
        intro={t("evidence.intro")}
        label={t("evidence.label")}
        title={t("evidence.title")}
        tone="raised"
      >
        <FadeIn>
          <TrustPipelineDiagram />
        </FadeIn>
      </CaseSection>

      <CaseSection
        aside={
          <FadeIn delay={80}>
            <HonestNote label={t("next.noteLabel")}>
              <p>{t("next.noteP1")}</p>
              <p className="mt-3">{t("next.noteP2")}</p>
            </HonestNote>
          </FadeIn>
        }
        tone="paper"
      >
        <FadeIn>
          <h2 className="type-heading max-w-2xl">{t("next.title")}</h2>
          <p className="type-body-lg mt-5 max-w-xl">{t("next.body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={tactileButtonClasses("primary")} href="/about#contact">
              <span>{t("next.cta")}</span>
              <IconArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a className={tactileButtonClasses("secondary")} href={REPO_URL} rel="noreferrer" target="_blank">
              <IconBrandGithub aria-hidden="true" className="h-4 w-4" />
              <span>{t("next.readSource")}</span>
            </a>
          </div>
        </FadeIn>
      </CaseSection>
    </main>
  );
}
