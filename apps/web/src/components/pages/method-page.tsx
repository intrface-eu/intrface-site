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
              <h1 className="type-display mt-6 max-w-3xl">{t("hero.title")}</h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="type-body-lg mt-7 max-w-2xl font-medium">{t("hero.lead")}</p>
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

      {/* EVIDENCE — three screenshots, plainly captioned */}
      <CaseSection
        intro={t("evidence.intro")}
        label={t("evidence.label")}
        title={t("evidence.title")}
        tone="raised"
      >
        <div className="grid gap-12">
          <EvidenceFrame
            alt={t("evidence.cockpit.alt")}
            aspect="16/9"
            caption={t("evidence.cockpit.caption")}
            label={t("evidence.cockpit.label")}
            sizes="(min-width: 1024px) 76rem, 100vw"
            src="/proof/aoc/aoc-cockpit-hero.png"
          />

          <div className="grid gap-12 lg:grid-cols-2">
            <EvidenceFrame
              alt={t("evidence.ledger.alt")}
              aspect="16/9"
              caption={t("evidence.ledger.caption")}
              label={t("evidence.ledger.label")}
              sizes="(min-width: 1024px) 37rem, 100vw"
              src="/proof/aoc/aoc-taskmaster.png"
            />
            <EvidenceFrame
              alt={t("evidence.repos.alt")}
              aspect="16/9"
              caption={t("evidence.repos.caption")}
              label={t("evidence.repos.label")}
              sizes="(min-width: 1024px) 37rem, 100vw"
              src="/proof/aoc/aoc-yazi-navigation.png"
            />
          </div>
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
            <li key={reason.title}>
              <FadeIn delay={80 + index * 70}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-6">
                  <span className="font-mono text-sm font-semibold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-.03em] text-ink sm:text-xl">
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
                <h2 className="type-heading mt-5 max-w-2xl">{t("next.title")}</h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="type-body-lg mt-6 max-w-2xl">{t("next.body")}</p>
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
