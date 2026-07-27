import {
  IconArrowRight,
  IconBeach,
  IconBuildingBank,
  IconBuildingStore,
  IconBus,
  IconCalendarEvent,
  IconMapPin,
  IconRoute,
} from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

import { CaseHero, CaseSection, EvidenceFrame, HonestNote, StatBand, type Stat } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";
import { TactileButton } from "@/components/site/tactile-button";
import {
  AudienceLedger,
  EngineeringLedger,
  MobileShot,
  PilotSeed,
  type AudienceRow,
  type EngineeringEntry,
  type SeedItem,
} from "@/components/work/voyager";
import type { AppLocale } from "@/i18n/routing";

/** Icons stay in code; the row copy comes from messages, in this order. */
const AUDIENCE_ICONS = [IconMapPin, IconBuildingStore, IconBuildingBank] as const;
const SEED_ICONS = [IconRoute, IconBeach, IconBus, IconCalendarEvent] as const;

export async function WorkVoyagerPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkVoyager" });
  const contactHref = `/${locale}/about#contact`;

  const audiences: AudienceRow[] = (
    t.raw("whatItIs.audiences") as Omit<AudienceRow, "icon">[]
  ).map((row, index) => ({ ...row, icon: AUDIENCE_ICONS[index] }));

  const pilotSeed: SeedItem[] = (t.raw("pilot.items") as Omit<SeedItem, "icon">[]).map(
    (item, index) => ({ ...item, icon: SEED_ICONS[index] }),
  );

  return (
    <main className="bg-paper text-ink">
      <CaseHero
        claim={t("hero.claim")}
        eyebrow={t("hero.eyebrow")}
        name={t("hero.name")}
        status={t("hero.status")}
        tags={t.raw("hero.tags") as string[]}
      />

      <CaseSection label={t("scale.label")} tone="raised">
        <p className="type-body-lg -mt-4 max-w-2xl">{t("scale.intro")}</p>
        {/* One panel, two rows: the eight figures are one count of the same repo. */}
        <StatBand
          className="mt-10"
          columns={4}
          stats={[
            ...(t.raw("scale.scaleStats") as Stat[]),
            ...(t.raw("scale.buildStats") as Stat[]),
          ]}
          tone="ink"
        />
      </CaseSection>

      <CaseSection
        id="what-it-is"
        intro={t("whatItIs.intro")}
        label={t("whatItIs.label")}
        title={t("whatItIs.title")}
        tone="paper"
      >
        <AudienceLedger rows={audiences} />
      </CaseSection>

      <CaseSection
        id="engineering"
        intro={t("engineering.intro")}
        label={t("engineering.label")}
        title={t("engineering.title")}
        tone="ink"
      >
        <EngineeringLedger entries={t.raw("engineering.entries") as EngineeringEntry[]} />
      </CaseSection>

      <CaseSection
        id="evidence"
        intro={t("evidence.intro")}
        label={t("evidence.label")}
        title={t("evidence.title")}
        tone="raised"
      >
        <div className="space-y-14">
          <EvidenceFrame
            alt={t("evidence.explore.alt")}
            aspect="16/10"
            caption={t("evidence.explore.caption")}
            label={t("evidence.explore.label")}
            priority
            sizes="(min-width: 1024px) 68rem, 100vw"
            src="/proof/voyager/voyager-explore-map.png"
          />

          <div className="grid gap-12 lg:grid-cols-2">
            <EvidenceFrame
              alt={t("evidence.board.alt")}
              aspect="16/10"
              caption={t("evidence.board.caption")}
              label={t("evidence.board.label")}
              sizes="(min-width: 1024px) 33rem, 100vw"
              src="/proof/voyager/voyager-tourist-board-profile.png"
            />

            <EvidenceFrame
              alt={t("evidence.host.alt")}
              aspect="16/10"
              caption={t("evidence.host.caption")}
              label={t("evidence.host.label")}
              sizes="(min-width: 1024px) 33rem, 100vw"
              src="/proof/voyager/voyager-ai-desk-officer.png"
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            <EvidenceFrame
              alt={t("evidence.events.alt")}
              aspect="16/10"
              caption={t("evidence.events.caption")}
              label={t("evidence.events.label")}
              sizes="(min-width: 1024px) 42rem, 100vw"
              src="/proof/voyager/voyager-agency-events.png"
            />

            <MobileShot
              alt={t("evidence.phone.alt")}
              caption={t("evidence.phone.caption")}
              label={t("evidence.phone.label")}
              src="/proof/voyager/voyager-mobile-profile.png"
            />
          </div>
        </div>
      </CaseSection>

      <CaseSection
        id="pilot"
        intro={t("pilot.intro")}
        label={t("pilot.label")}
        title={t("pilot.title")}
        tone="paper"
      >
        <PilotSeed items={pilotSeed} />
      </CaseSection>

      <CaseSection
        aside={
          <HonestNote>
            <p>{t("status.noteP1")}</p>
            <p className="mt-3">{t("status.noteP2")}</p>
          </HonestNote>
        }
        id="status"
        label={t("status.label")}
        title={t("status.title")}
        tone="raised"
      >
        <p className="type-body max-w-2xl">{t("status.p1")}</p>
        <p className="type-body mt-4 max-w-2xl">{t("status.p2")}</p>
      </CaseSection>

      <section className="tone-ink border-t border-rule">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <p className="type-section-label">{t("next.label")}</p>
          </FadeIn>
          <FadeIn delay={80}>
            <h2 className="type-heading mt-4 max-w-2xl">{t("next.title")}</h2>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="type-body-lg mt-6 max-w-2xl">{t("next.body")}</p>
          </FadeIn>
          <FadeIn delay={240}>
            <TactileButton
              className="mt-9"
              href={contactHref}
              trailingIcon={<IconArrowRight className="h-4 w-4" />}
              variant="secondary"
            >
              {t("next.cta")}
            </TactileButton>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
