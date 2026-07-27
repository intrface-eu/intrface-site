import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CaseHero, CaseSection, HonestNote, StatBand, type Stat } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { MatchFlow, type MatchStep } from "@/components/work/funda/match-flow";

type Surface = { name: string; note: string };

export async function WorkFundaPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkFunda" });
  const surfaces = t.raw("whatItDoes.surfaces") as Surface[];

  return (
    <main className="bg-paper text-ink">
      <CaseHero
        claim={t("hero.claim")}
        eyebrow={t("hero.eyebrow")}
        name={t("hero.name")}
        status={t("hero.status")}
        tags={t.raw("hero.tags") as string[]}
      />

      <section className="tone-raised border-b border-rule">
        <div className="section-shell py-12 sm:py-14">
          <StatBand columns={3} stats={t.raw("stats") as Stat[]} tone="raised" />
        </div>
      </section>

      <CaseSection
        aside={<HonestNote>{t("whatItDoes.note")}</HonestNote>}
        intro={t("whatItDoes.intro")}
        label={t("whatItDoes.label")}
        title={t("whatItDoes.title")}
        tone="paper"
      >
        <p className="type-body max-w-2xl">{t("whatItDoes.body")}</p>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-rule bg-rule sm:grid-cols-2">
          {surfaces.map((surface) => (
            <div className="bg-paper p-5" key={surface.name}>
              <dt className="text-base font-semibold tracking-[-.02em]">{surface.name}</dt>
              <dd className="type-body mt-1.5 text-sm leading-6">{surface.note}</dd>
            </div>
          ))}
        </dl>
      </CaseSection>

      <CaseSection
        intro={t("matching.intro")}
        label={t("matching.label")}
        title={t("matching.title")}
        tone="raised"
      >
        <MatchFlow steps={t.raw("matching.steps") as MatchStep[]} />
      </CaseSection>

      <CaseSection label={t("shows.label")} title={t("shows.title")} tone="ink">
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="type-body max-w-xl">{t("shows.p1")}</p>
          <p className="type-body max-w-xl">{t("shows.p2")}</p>
        </div>
      </CaseSection>

      <section className="tone-paper">
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
