import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { CaseSection, EvidenceFrame, HonestNote, StatBand, type Stat } from "@/components/case";
import { ContractLedger, OperatingRule, RepoCard, type ContractArtifact } from "@/components/method";
import { FadeIn } from "@/components/site/fade-in";
import { ProcessSteps, type ProcessStep } from "@/components/site/process-steps";
import { TactileButton } from "@/components/site/tactile-button";
import type { AppLocale } from "@/i18n/routing";
import { AOC_REPO_URL } from "@/lib/site/config";

/** The files as they appear in a repository. Never translated. */
const CONTRACT_FILES = ["AGENTS.md", "DESIGN.md", "context.md", "tasks.json"] as const;

type RuleClause = { text: string; detail: string };
type ClientReason = { title: string; text: string };

export async function MethodPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Method" });
  const contactHref = `/${locale}/about#contact`;

  const artifactCopy = t.raw("howItWorks.artifacts") as string[];
  const contractArtifacts: ContractArtifact[] = CONTRACT_FILES.map((file, index) => ({
    file,
    description: artifactCopy[index],
  }));

  const clientReasons = t.raw("why.reasons") as ClientReason[];

  return (
    <main className="bg-paper text-ink">
      {/* HERO — the claim, and the link that backs it */}
      <section className="border-b border-rule tone-paper">
        <div className="section-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <FadeIn>
              <p className="type-section-label">{t("hero.label")}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="type-display mt-6">{t("hero.title")}</h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="type-body-lg mt-7 font-medium">{t("hero.lead")}</p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="mt-9 flex flex-wrap gap-3">
                <TactileButton
                  className="text-base"
                  href={AOC_REPO_URL}
                  rel="noreferrer"
                  target="_blank"
                  trailingIcon={<IconBrandGithub className="h-4 w-4" />}
                >
                  {t("hero.readRepo")}
                </TactileButton>
                <TactileButton className="text-base" href="#how-it-works" variant="secondary">
                  {t("hero.howItWorks")}
                </TactileButton>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={220}>
            <RepoCard
              chips={t.raw("hero.repoChips") as string[]}
              label={t("hero.repoLabel")}
              summary={t("hero.repoSummary")}
            />
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS — steps beside the contract as it exists on disk */}
      <CaseSection
        aside={
          <ContractLedger artifacts={contractArtifacts} title={t("howItWorks.contractTitle")} />
        }
        id="how-it-works"
        intro={t("howItWorks.intro")}
        label={t("howItWorks.label")}
        title={t("howItWorks.title")}
        tone="raised"
      >
        <ProcessSteps steps={t.raw("howItWorks.steps") as ProcessStep[]} />
      </CaseSection>

      {/* THE RULE — one ink band, one sentence */}
      <OperatingRule
        clauses={t.raw("rule.clauses") as RuleClause[]}
        label={t("rule.label")}
        rule={t("rule.rule")}
      />

      {/* NUMBERS — what is public, and what it produced */}
      <CaseSection
        intro={t("numbers.intro")}
        label={t("numbers.label")}
        title={t("numbers.title")}
        tone="paper"
      >
        <StatBand columns={3} stats={t.raw("numbers.systemStats") as Stat[]} />
        <StatBand className="mt-10" columns={2} stats={t.raw("numbers.outputStats") as Stat[]} tone="ink" />
      </CaseSection>

      {/* EVIDENCE — three details cut from the captures at native resolution.
          The whole 4384x2402 frame in a web column is a texture; each plate
          shows only the region that carries the claim, at a scale where the
          words are readable. Column widths and crop widths are chosen together
          — see the note on EvidenceCrop. */}
      <CaseSection
        intro={t("evidence.intro")}
        label={t("evidence.label")}
        title={t("evidence.title")}
        tone="raised"
      >
        <div className="grid gap-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,.44fr)_minmax(0,.56fr)] lg:items-start">
            <EvidenceFrame
              alt={t("evidence.cockpit.alt")}
              caption={t("evidence.cockpit.caption")}
              crop={{
                src: "/proof/aoc/aoc-cockpit-rules.png",
                width: 1120,
                height: 1240,
                narrow: { src: "/proof/aoc/aoc-cockpit-rules-sm.png", width: 915, height: 850 },
                sizes: "(min-width: 1024px) 31rem, 94vw",
                narrowSizes: "94vw",
                context: "top-right",
              }}
              label={t("evidence.cockpit.label")}
              src="/proof/aoc/aoc-cockpit-hero.png"
            />

            <EvidenceFrame
              alt={t("evidence.repos.alt")}
              caption={t("evidence.repos.caption")}
              crop={{
                src: "/proof/aoc/aoc-contract-dirs.png",
                width: 1420,
                height: 1268,
                narrow: { src: "/proof/aoc/aoc-contract-dirs-sm.png", width: 430, height: 430 },
                sizes: "(min-width: 1024px) 39rem, 94vw",
                narrowSizes: "94vw",
              }}
              label={t("evidence.repos.label")}
              src="/proof/aoc/aoc-yazi-navigation.png"
            />
          </div>

          <EvidenceFrame
            alt={t("evidence.ledger.alt")}
            caption={t("evidence.ledger.caption")}
            crop={{
              src: "/proof/aoc/aoc-taskmaster-rows.png",
              width: 2800,
              height: 1190,
              narrow: { src: "/proof/aoc/aoc-taskmaster-rows-sm.png", width: 1010, height: 576 },
              sizes: "(min-width: 1280px) 74rem, 94vw",
              narrowSizes: "94vw",
            }}
            label={t("evidence.ledger.label")}
            src="/proof/aoc/aoc-taskmaster.png"
          />
        </div>
      </CaseSection>

      {/* WHY IT MATTERS — client-side reasons, with the caveat right beside them */}
      <CaseSection
        aside={
          <HonestNote label={t("why.noteLabel")}>
            <p>{t("why.noteP1")}</p>
            <p className="mt-3">{t("why.noteP2")}</p>
          </HonestNote>
        }
        intro={t("why.intro")}
        label={t("why.label")}
        title={t("why.title")}
        tone="paper"
      >
        <ol className="divide-y divide-rule border-y border-rule">
          {clientReasons.map((reason, index) => (
            /* The padding sits on the row that carries the hairline, not on a
               wrapper inside it, so the last line of each reason keeps a real
               inset from the rule below it. */
            <li className="py-7" key={reason.title}>
              <FadeIn delay={80 + index * 70}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
                  <span className="type-data text-sm font-semibold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-title text-ink">
                      {reason.title}
                    </h3>
                    <p className="type-body mt-2">{reason.text}</p>
                  </div>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </CaseSection>

      {/* CTA */}
      <section className="tone-ink border-t border-rule">
        <div className="section-shell py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("next.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-5">{t("next.title")}</h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="type-body-lg mt-6">{t("next.body")}</p>
              </FadeIn>
            </div>

            <FadeIn delay={260}>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <TactileButton
                  className="text-base"
                  href={contactHref}
                  trailingIcon={<IconArrowRight className="h-4 w-4" />}
                  variant="secondary"
                >
                  {t("next.cta")}
                </TactileButton>
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                  href={AOC_REPO_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  <IconBrandGithub aria-hidden="true" className="h-4 w-4" stroke={1.75} />
                  github.com/basicalex/agent-ops-cockpit
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}

