import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { HeroProof, type HeroArtifact } from "@/components/home/hero-proof";
import { LiveSiteRow, type LiveSite } from "@/components/home/live-site-row";
import { SystemLedger, type FeaturedSystem } from "@/components/home/system-ledger";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn } from "@/components/site/fade-in";
import { ProcessSteps, type ProcessStep } from "@/components/site/process-steps";
import { TactileButton } from "@/components/site/tactile-button";
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

/**
 * The four files every repository we touch carries, as they are named on disk.
 * Filenames are not copy — they stay here and out of the message files.
 *
 * `sep` is the halftone separation each row is printed in: cyan, magenta,
 * yellow, key. Four files, four plates, one registered image — which is the
 * whole reason there is a dot screen in this hero at all.
 */
const CONTRACT_FILES = [
  { name: "AGENTS.md", sep: "c" },
  { name: "DESIGN.md", sep: "m" },
  { name: ".aoc/context.md", sep: "y" },
  { name: ".taskmaster/tasks/tasks.json", sep: "k" },
] as const;

export async function HomePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const path = (href: string) => getPathname({ href, locale });

  const thesisColumns = t.raw("thesis.columns") as { label: string; text: string }[];
  const clientPipeline = t.raw("proof.pipeline") as string[];
  const methodSteps = t.raw("method.steps") as ProcessStep[];
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
    spec: t.raw(`systems.${system.key}.spec`) as string[],
    linkLabel: t(`systems.${system.key}.linkLabel`),
    // SystemLedger renders the locale-aware `Link`, so the raw route goes in —
    // prefixing here produced /en/en/work/voyager.
    href: system.href,
  }));

  return (
    <main className="bg-paper text-ink">
      {/* HERO — one sentence, the two actions it argues for directly under it,
          and the contract plate beside them. Then the evidence.

          No `100svh` band: the old one centred the claim in leftover height,
          so a locale with a shorter headline was rewarded with more dead space,
          not less. Height is content plus padding now, at every length. */}
      <section className="border-b border-rule tone-paper">
        <div className="section-shell flex flex-col gap-12 py-10 sm:gap-14 sm:py-14 lg:gap-16 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-end lg:gap-16">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("hero.eyebrow")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 className="type-display mt-4 sm:mt-5">
                  {t("hero.title")}
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="type-body-lg mt-6 max-w-xl font-medium sm:mt-7">{t("hero.lead")}</p>
              </FadeIn>
              {/* Under the sentence that motivates them, not stranded in a
                  column 350px to the right of it. */}
              <FadeIn delay={240}>
                <div className="mt-7 flex flex-wrap gap-3">
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

            {/* The halftone, registered. Four files, four separations, the
                names in the type they are written in. */}
            <FadeIn delay={300}>
              <div className="contract-plate">
                <p className="type-meta">{t("hero.contract.label")}</p>
                <ul className="mt-4">
                  {CONTRACT_FILES.map((file) => (
                    <li className="contract-row" key={file.name}>
                      <span className="type-data contract-name">
                        {/* A path breaks after a slash or not at all. Without
                            these the longest one split mid-filename at 390px. */}
                        {file.name.split("/").map((segment, index, all) => (
                          <span key={segment}>
                            {segment}
                            {index < all.length - 1 ? (
                              <>
                                /<wbr />
                              </>
                            ) : null}
                          </span>
                        ))}
                      </span>
                      <span aria-hidden="true" className="contract-screen" data-sep={file.sep} />
                    </li>
                  ))}
                </ul>
                <p className="type-caption mt-4">{t("hero.contract.note")}</p>
              </div>
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={340}>
              <p className="type-section-label mb-3">{t("hero.proofLabel")}</p>
            </FadeIn>
            <HeroProof artifacts={heroArtifacts} baseDelay={380} />
          </div>
        </div>
      </section>

      {/* THESIS — raised paper, an editorial spread. Claim across the full
          measure, the argument set in two columns under it, three named
          consequences on a rule below that. Deliberately not the same
          asymmetric two-column grid the method band uses. */}
      <section className="scroll-mt-24 border-b border-rule tone-raised" id="thesis">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <p className="type-section-label">{t("thesis.label")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="type-heading mt-4">{t("thesis.title")}</h2>
          </FadeIn>

          <div className="mt-10 grid gap-x-14 gap-y-5 lg:grid-cols-2">
            <FadeIn delay={160}>
              <p className="type-body-lg">{t("thesis.p1")}</p>
            </FadeIn>
            <FadeIn delay={220}>
              <p className="type-body-lg">{t("thesis.p2")}</p>
            </FadeIn>
          </div>

          {/* Rule above each cell, gutters from the gap. The old vertical
              dividers gave the middle cell two insets and the outer two one
              each, so the third column ran flush into the shell edge. */}
          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {thesisColumns.map((item, index) => (
              <FadeIn
                className="border-t border-rule pt-5"
                delay={280 + index * 70}
                key={item.label}
              >
                <h3 className="type-title text-ink">{item.label}</h3>
                <p className="type-body-sm mt-2">{item.text}</p>
              </FadeIn>
            ))}
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
              {/* The arrow leads its step rather than trailing it. Trailing, a
                  wrapped line ended with an arrow pointing at nothing — which
                  is every line but the last at 390px. */}
              {clientPipeline.map((step, index) => (
                <li className="flex items-center gap-3" key={step}>
                  {index > 0 ? (
                    <IconArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                  ) : null}
                  <span className="type-meta">{step}</span>
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
          {/* The actions sit at the foot of the left column rather than
              directly under the paragraph, so the column ends where the steps
              end instead of stopping at 40% of the band. */}
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div className="flex flex-col">
              <FadeIn>
                <p className="type-section-label">{t("method.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-4 max-w-lg">{t("method.title")}</h2>
              </FadeIn>
              <FadeIn delay={180}>
                <p className="type-body mt-5 max-w-lg">{t("method.body")}</p>
              </FadeIn>
              <FadeIn className="mt-auto" delay={260}>
                <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-rule pt-8">
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
        </div>
      </section>

      {/* CONTACT — ink band, form on a paper panel. No shader: it ran a rAF
          loop behind the heading, the lead and the whole form to contribute one
          faint corner arc, which is the case DESIGN.md rules out. */}
      <section className="scroll-mt-24 bg-ink text-white" id="contact">
        <div className="section-shell py-20 sm:py-28">
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
