import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { StatBand, type Stat } from "@/components/case";
import { LiveSiteRow, type LiveSite } from "@/components/home/live-site-row";
import { SystemLedger, type FeaturedSystem, type SystemStat } from "@/components/home/system-ledger";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn } from "@/components/site/fade-in";
import { ProcessSteps, type ProcessStep } from "@/components/site/process-steps";
import { SystemMap, type SystemMapItem } from "@/components/site/system-map";
import { TactileButton } from "@/components/site/tactile-button";
import { PaperShaderSurface } from "@/components/visual/paper-shader-surface";
import { Link, getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { AOC_REPO_URL, CONTACT_EMAIL } from "@/lib/site/config";

/** Screenshot slug, message key, and live URL. The copy sits in the messages file. */
const LIVE_SITES = [
  { slug: "cannaclean", key: "cannaclean", url: "https://cannaclean.pages.dev" },
  { slug: "velum", key: "velum", url: "https://velum-winebar.pages.dev" },
  { slug: "astyle-marine", key: "astyleMarine", url: "https://astyle-marine.pages.dev" },
  {
    slug: "vrsar-boat-tours",
    key: "vrsarBoatTours",
    url: "https://vrsar-private-boat-tours.pages.dev",
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

  const liveSites: LiveSite[] = LIVE_SITES.map((site) => ({
    slug: site.slug,
    url: site.url,
    name: t(`proof.sites.${site.key}.name`),
    place: t(`proof.sites.${site.key}.place`),
    kind: t(`proof.sites.${site.key}.kind`),
    description: t(`proof.sites.${site.key}.description`),
    alt: t(`proof.sites.${site.key}.alt`),
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
      {/* HERO — paper, halftone landmark, orientation diagram */}
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-rule tone-paper">
        <div className="halftone-field" aria-hidden="true" />
        <div className="section-shell relative grid min-h-[calc(100svh-4rem)] gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_.9fr] lg:items-center lg:py-28">
          <div className="max-w-4xl">
            <FadeIn>
              <p className="type-section-label">{t("hero.eyebrow")}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="type-display mt-6 max-w-4xl">{t("hero.title")}</h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="type-body-lg mt-7 max-w-2xl font-medium">{t("hero.lead")}</p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="mt-9 flex flex-wrap gap-3">
                <TactileButton
                  className="min-w-[12rem] text-base"
                  href={path("/work")}
                  trailingIcon={<IconArrowRight className="h-4 w-4" />}
                >
                  {t("hero.seeWork")}
                </TactileButton>
                <TactileButton className="text-base" href={path("/method")} variant="secondary">
                  {t("hero.howWeBuild")}
                </TactileButton>
              </div>
            </FadeIn>
            <FadeIn delay={380}>
              <p className="mt-7 text-sm text-ink-muted">
                {t.rich("hero.openSource", {
                  repo: (chunks) => (
                    <a
                      className="font-semibold text-accent hover:underline"
                      href={AOC_REPO_URL}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={180}>
            <SystemMap
              ariaLabel={t("systemMap.ariaLabel")}
              core={t.raw("systemMap.core") as SystemMapItem}
              inputs={t.raw("systemMap.inputs") as SystemMapItem[]}
              output={t.raw("systemMap.output") as SystemMapItem}
              stages={{
                inputs: t("systemMap.stageInputs"),
                core: t("systemMap.stageCore"),
                output: t("systemMap.stageOutput"),
              }}
            />
          </FadeIn>
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
              <div className="mt-10 grid gap-0 divide-y divide-rule border-y border-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {thesisColumns.map((item, index) => (
                  <FadeIn delay={220 + index * 70} key={item.label}>
                    <div className="h-full py-5 sm:px-5 sm:py-2 sm:first:pl-0 sm:last:pr-0">
                      <h3 className="text-base font-semibold text-ink">{item.label}</h3>
                      <p className="type-body mt-2 text-sm">{item.text}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF — paper, four live sites as framed receipts */}
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
                  <span className="type-meta font-mono">{step}</span>
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

          <FadeIn delay={80}>
            <div className="mt-14 border-t border-rule pt-8">
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
                <h2 className="type-heading mt-5 max-w-2xl text-white">{t("contact.title")}</h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="type-body-lg mt-7 max-w-xl text-[color:var(--ink-inverse-muted)]">
                  {t("contact.intro")}
                </p>
              </FadeIn>
              <FadeIn delay={280}>
                <p className="mt-7 text-sm text-[color:var(--ink-inverse-muted)]">
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
