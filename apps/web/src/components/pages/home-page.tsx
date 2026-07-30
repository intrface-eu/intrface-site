import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { StatBand, type Stat } from "@/components/case";
import { HeroProof, type HeroArtifact } from "@/components/home/hero-proof";
import { LiveSiteRow, type LiveSite } from "@/components/home/live-site-row";
import { SystemLedger, type FeaturedSystem, type SystemStat } from "@/components/home/system-ledger";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn } from "@/components/site/fade-in";
import { ProcessSteps, type ProcessStep } from "@/components/site/process-steps";
import { TactileButton } from "@/components/site/tactile-button";
import { PaperShaderSurface } from "@/components/visual/paper-shader-surface";
import { Link, getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  AOC_REPO_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/site/config";

/**
 * Screenshot slug, message key, live URL, and the language chips. The copy
 * sits in the messages file.
 *
 * Only sites the client has been handed belong here. Others exist but are
 * still in delivery — see `docs/site-revamp-contract.md`, which names them and
 * says why they must not appear on this site yet. Do not add one back without
 * the owner saying so.
 */
const LIVE_SITES = [
  {
    slug: "velum",
    key: "velum",
    url: "https://velum-winebar.com",
    languages: ["HR", "EN"],
  },
] as const;

/**
 * The three hero plates: a client site anyone can open, a platform of our own,
 * and the delivery system this page was built with. Capture, target, and
 * whether the link leaves the site — the copy sits in the messages file.
 *
 * Same roster rule as above: only Velum may be named or linked.
 */
const HERO_ARTIFACTS = [
  {
    key: "velum",
    src: "/proof/sites/velum-desktop.png",
    href: "https://velum-winebar.com",
    external: true,
    priority: true,
  },
  {
    key: "voyager",
    src: "/proof/voyager/voyager-tz-vrsar-profile.png",
    href: "/work/voyager",
  },
  {
    key: "aoc",
    src: "/proof/hero/aoc-agent-pane.png",
    href: AOC_REPO_URL,
    external: true,
  },
] as const;

const FEATURED_SYSTEMS = [
  { key: "voyager", href: "/work/voyager" },
  { key: "polis", href: "/work/polis" },
  { key: "funda", href: "/work/funda" },
] as const;

export async function HomePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const path = (href: string) => getPathname({ href, locale });

  const thesisColumns = t.raw("thesis.columns") as { label: string; text: string }[];
  const clientPipeline = t.raw("proof.pipeline") as string[];
  const methodSteps = t.raw("method.steps") as ProcessStep[];
  const deliveryStats = t.raw("method.stats") as Stat[];
  const contactTopics = t.raw("contact.topics") as string[];
  const contactHelps = t.raw("contact.helps") as string[];

  const heroArtifacts: HeroArtifact[] = HERO_ARTIFACTS.map((artifact) => ({
    ...artifact,
    name: t(`hero.proof.${artifact.key}.name`),
    status: t(`hero.proof.${artifact.key}.status`),
    meta: t(`hero.proof.${artifact.key}.meta`),
    alt: t(`hero.proof.${artifact.key}.alt`),
  }));

  const liveSites: LiveSite[] = LIVE_SITES.map((site) => ({
    slug: site.slug,
    url: site.url,
    name: t(`proof.sites.${site.key}.name`),
    place: t(`proof.sites.${site.key}.place`),
    kind: t(`proof.sites.${site.key}.kind`),
    description: t(`proof.sites.${site.key}.description`),
    alt: t(`proof.sites.${site.key}.alt`),
    facts: [
      { label: t("proof.languagesLabel"), value: site.languages.join(" · ") },
      {
        label: t("proof.markupLabel"),
        value: (t.raw(`proof.sites.${site.key}.notes`) as string[]).join(", "),
      },
    ],
  }));

  const featuredSystems: FeaturedSystem[] = FEATURED_SYSTEMS.map((system) => ({
    name: t(`systems.${system.key}.name`),
    status: t(`systems.${system.key}.status`),
    claim: t(`systems.${system.key}.claim`),
    stats: t.raw(`systems.${system.key}.stats`) as SystemStat[],
    linkLabel: t(`systems.${system.key}.linkLabel`),
    // SystemLedger renders the locale-aware `Link`, so the raw route goes in —
    // prefixing here produced /en/en/work/voyager.
    href: system.href,
  }));

  return (
    <main className="bg-paper text-ink">
      {/* HERO — one sentence, then the evidence for it. Paper, halftone
          landmark in the corner, three real captures along the bottom edge of
          the first screen. */}
      <section className="relative overflow-hidden border-b border-rule tone-paper">
        <div className="halftone-field" aria-hidden="true" />
        <div className="section-shell relative flex min-h-[calc(100svh-4rem)] flex-col gap-10 py-8 sm:py-12 lg:gap-12">
          {/* The claim centres in whatever height is left over the evidence
              strip, so the free space reads as air on both sides of it rather
              than as a gap that opened under the headline. */}
          <div className="my-auto">
            <FadeIn>
              <p className="type-section-label">{t("hero.eyebrow")}</p>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="type-display mt-4 sm:mt-5">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <FadeIn delay={160}>
                <p className="type-body-lg max-w-xl font-medium">{t("hero.lead")}</p>
              </FadeIn>
              <FadeIn delay={240}>
                <div className="flex flex-wrap gap-3">
                  <TactileButton
                    className="text-base"
                    href={path("/work")}
                    trailingIcon={<IconArrowRight className="h-4 w-4" />}
                  >
                    {t("hero.seeWork")}
                  </TactileButton>
                  <TactileButton className="text-base" href="#contact" variant="secondary">
                    {t("hero.talk")}
                  </TactileButton>
                </div>
              </FadeIn>
            </div>
          </div>

          <div>
            <FadeIn delay={300}>
              <p className="type-section-label mb-3">{t("hero.proofLabel")}</p>
            </FadeIn>
            <HeroProof artifacts={heroArtifacts} baseDelay={340} />
          </div>
        </div>
      </section>

      {/* THESIS — raised paper, editorial, no cards */}
      <section className="scroll-mt-24 border-b border-rule tone-raised" id="thesis">
        <div className="section-shell py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("thesis.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-4 max-w-xl">{t("thesis.title")}</h2>
              </FadeIn>
            </div>
            <div>
              <FadeIn delay={160}>
                <div className="type-body-lg grid gap-5">
                  <p>{t("thesis.p1")}</p>
                  <p>{t("thesis.p2")}</p>
                </div>
              </FadeIn>
              {/* The cell padding lives on the FadeIn wrapper, not inside it. On the
                  inner div `first:`/`last:` both matched every cell — each one is the
                  only child of its own wrapper — so `sm:px-5` was cancelled on all
                  three and the text sat flush against the divider. */}
              <div className="mt-10 grid gap-0 divide-y divide-rule border-y border-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {thesisColumns.map((item, index) => (
                  <FadeIn
                    className="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0"
                    delay={220 + index * 70}
                    key={item.label}
                  >
                    <div className="h-full">
                      <h3 className="type-title text-ink">{item.label}</h3>
                      <p className="type-body-sm mt-2">{item.text}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF — paper, the live site as a framed receipt, pipeline above it */}
      <section className="scroll-mt-24 border-b border-rule tone-paper" id="live">
        <div className="section-shell py-20 sm:py-28">
          <div className="max-w-3xl">
            <FadeIn>
              <p className="type-section-label">{t("proof.label")}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="type-heading mt-4">{t("proof.title")}</h2>
            </FadeIn>
            <FadeIn delay={180}>
              <p className="type-body-lg mt-5">{t("proof.intro")}</p>
            </FadeIn>
          </div>

          <FadeIn delay={240}>
            <ol className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-rule py-4">
              {clientPipeline.map((step, index) => (
                <li className="flex items-center gap-3" key={step}>
                  <span className="type-meta">{step}</span>
                  {index < clientPipeline.length - 1 ? (
                    <IconArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                  ) : null}
                </li>
              ))}
            </ol>
          </FadeIn>

          <div className="mt-14">
            {liveSites.map((site, index) => (
              <LiveSiteRow
                index={index}
                key={site.slug}
                liveLabel={t("proof.liveIn", { place: site.place })}
                site={site}
              />
            ))}
          </div>

          {/* The honest closer: more sites exist, none of them are ours to
              show until the client has been handed the work. No names, no
              URLs, no captures — see docs/site-revamp-contract.md. */}
          <FadeIn delay={80}>
            <div className="mt-14 grid gap-8 border-t border-rule pt-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
              <div>
                <p className="type-section-label">{t("proof.inDeliveryLabel")}</p>
                <p className="type-body mt-3">{t("proof.inDelivery")}</p>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full text-base font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                href="/work/client-sites"
              >
                {t("proof.howWeShip")}
                <IconArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SYSTEMS — ink band, ledger with honest status labels */}
      <section className="scroll-mt-24 border-y border-rule tone-ink" id="systems">
        <div className="section-shell py-20 sm:py-28">
          <div className="max-w-3xl">
            <FadeIn>
              <p className="type-section-label">{t("systems.label")}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="type-heading mt-4 text-white">{t("systems.title")}</h2>
            </FadeIn>
            <FadeIn delay={180}>
              <p className="type-body-lg mt-5">{t("systems.intro")}</p>
            </FadeIn>
          </div>

          <div className="mt-14">
            <SystemLedger systems={featuredSystems} />
          </div>
        </div>
      </section>

      {/* METHOD — raised paper, the delivery system in the open */}
      <section className="scroll-mt-24 border-b border-rule tone-raised" id="method">
        <div className="section-shell py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("method.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-4 max-w-lg">{t("method.title")}</h2>
              </FadeIn>
              <FadeIn delay={180}>
                <p className="type-body mt-5 max-w-lg">{t("method.body")}</p>
              </FadeIn>
              <FadeIn delay={260}>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <TactileButton
                    href={path("/method")}
                    trailingIcon={<IconArrowRight className="h-4 w-4" />}
                    variant="secondary"
                  >
                    {t("method.readMethod")}
                  </TactileButton>
                  <a
                    className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    href={AOC_REPO_URL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t("method.readSource")}
                    <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={240}>
              <ProcessSteps steps={methodSteps} />
            </FadeIn>
          </div>

          <StatBand className="mt-16" columns={3} stats={deliveryStats} tone="raised" />
        </div>
      </section>

      {/* CONTACT — ink band, form on a paper panel */}
      <section className="relative scroll-mt-24 overflow-hidden bg-ink text-white" id="contact">
        <PaperShaderSurface className="opacity-[.14]" variant="contact" />
        <div className="section-shell relative py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <FadeIn>
                <p className="type-meta text-[color:var(--ink-inverse-label)]">{t("contact.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-5 text-white">{t("contact.title")}</h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="type-body-lg mt-7 max-w-xl text-[color:var(--ink-inverse-muted)]">
                  {t("contact.intro")}
                </p>
              </FadeIn>
              {/* The same three prompts /about carries. Without them this column
                  stopped at the intro and left the form standing on its own. */}
              <FadeIn delay={260}>
                <div className="mt-10 border-t border-white/15 pt-6">
                  <p className="type-meta text-[color:var(--ink-inverse-label)]">
                    {t("contact.helpsLabel")}
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {contactHelps.map((help) => (
                      <li
                        className="type-body-sm flex gap-3 text-[color:var(--ink-inverse-muted)]"
                        key={help}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[.6em] h-1 w-1 shrink-0 rounded-full bg-white/45"
                        />
                        {help}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              {/* Who answers, and when — the reassurance an SME buyer looks for
                  before typing anything into the form. */}
              <FadeIn delay={320}>
                <div className="mt-8 border-t border-white/15 pt-6">
                  <p className="type-body text-[color:var(--ink-inverse)]">
                    {t("contact.person")}
                  </p>
                  <p className="type-body-sm mt-2 text-[color:var(--ink-inverse-muted)]">
                    {t("contact.reply")}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={380}>
                <p className="type-body-sm mt-8 text-[color:var(--ink-inverse-muted)]">
                  {t.rich("contact.mailNote", {
                    email: CONTACT_EMAIL,
                    mail: (chunks) => (
                      <a
                        className="font-semibold text-white underline underline-offset-4"
                        href={`mailto:${CONTACT_EMAIL}`}
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </FadeIn>
              <FadeIn delay={420}>
                <p className="type-body-sm mt-2 text-[color:var(--ink-inverse-muted)]">
                  {t.rich("contact.phoneNote", {
                    phone: CONTACT_PHONE_DISPLAY,
                    tel: (chunks) => (
                      <a
                        className="font-semibold text-white underline underline-offset-4"
                        href={`tel:${CONTACT_PHONE_TEL}`}
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </FadeIn>
              <FadeIn delay={460}>
                <p className="type-caption mt-6 text-[color:var(--ink-inverse-muted)]">
                  {t("contact.dataNote")}
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={250}>
              <div className="rounded-[var(--radius-xl)] border border-rule bg-paper p-6 text-ink shadow-[var(--shadow-elevated)] sm:p-8">
                <ContactForm locale={locale} topics={contactTopics} />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
