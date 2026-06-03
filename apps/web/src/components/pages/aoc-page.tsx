import { getTranslations } from "next-intl/server";
import { aocLinks } from "@/lib/site/aoc-content";
import type { AppLocale } from "@/i18n/routing";
import { AocArtifact, TerminalFlowArtifact } from "@/components/visual/product-artifacts";
import { IconArrowRight, IconBrain, IconChecklist, IconCode, IconFileText, IconLayoutDashboard } from "@tabler/icons-react";

export async function AocPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "AocPage" });

  const painPoints = [
    t("painPoints.items.0"),
    t("painPoints.items.1"),
    t("painPoints.items.2"),
    t("painPoints.items.3"),
  ] as const;

  const architecture = [
    {
      title: t("architecture.items.context.title"),
      path: ".aoc/context.md",
      description: t("architecture.items.context.description"),
      icon: IconFileText,
    },
    {
      title: t("architecture.items.memory.title"),
      path: ".aoc/memory.md",
      description: t("architecture.items.memory.description"),
      icon: IconBrain,
    },
    {
      title: t("architecture.items.tasks.title"),
      path: "tasks.json / Taskmaster",
      description: t("architecture.items.tasks.description"),
      icon: IconChecklist,
    },
  ] as const;

  const workspace = [
    t("workspace.items.0"),
    t("workspace.items.1"),
    t("workspace.items.2"),
    t("workspace.items.3"),
    t("workspace.items.4"),
  ] as const;

  const capabilities = [
    t("capabilities.items.0"),
    t("capabilities.items.1"),
    t("capabilities.items.2"),
    t("capabilities.items.3"),
    t("capabilities.items.4"),
    t("capabilities.items.5"),
    t("capabilities.items.6"),
  ] as const;

  const quickStart = [
    "curl -fsSL https://raw.githubusercontent.com/basicalex/agent-ops-cockpit/main/install/bootstrap.sh | bash",
    "aoc-doctor",
    "cd ~/your-project && aoc",
  ] as const;

  const evolution = [
    t("evolution.items.0"),
    t("evolution.items.1"),
    t("evolution.items.2"),
    t("evolution.items.3"),
  ] as const;

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-rule bg-[#07111f] text-background">
        <div className="pointer-events-none absolute inset-0 halftone-field opacity-20 [--halftone-color:#7dd3fc] [--halftone-size:24px]" data-drift="true" aria-hidden="true" />
        <div className="section-shell relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label text-sky-300">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta text-sky-200/70">AOC — Agent Ops Cockpit</p>
              <h1 className="type-display max-w-5xl text-background">{t("hero.title")}</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 tracking-[-.015em] text-background/75 sm:text-xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={aocLinks.github} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground">
                {t("hero.primaryCta")}
                <IconArrowRight className="h-4 w-4" />
              </a>
              <a href="#quick-start" className="artifact-button inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[.06] px-5 py-3 text-sm font-medium text-background hover:bg-white/[.1]">
                {t("hero.secondaryCta")}
              </a>
              <a href="#architecture" className="artifact-button inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[.06] px-5 py-3 text-sm font-medium text-background hover:bg-white/[.1]">
                {t("hero.tertiaryCta")}
              </a>
            </div>
          </div>
          <AocArtifact />
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("painPoints.label")}</p>
              <h2 className="type-heading max-w-md">{t("painPoints.title")}</h2>
              <p className="type-body max-w-lg">{t("painPoints.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((point) => (
                <article key={point} className="artifact-card rounded-2xl p-6 [--artifact-accent:#0ea5e9]">
                  <p className="text-lg font-medium tracking-[-0.02em] text-foreground">{point}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-24 border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("architecture.label")}</p>
              <h2 className="type-heading">{t("architecture.title")}</h2>
              <p className="type-body">{t("architecture.body")}</p>
            </div>
            <div className="surface-artifact-dark rounded-[2rem] p-5 [--artifact-accent:#0ea5e9]">
              <div className="grid gap-4 lg:grid-cols-3">
                {architecture.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-[1.35rem] border border-white/10 bg-white/[.06] p-5 text-background">
                      <Icon className="h-6 w-6 text-sky-300" />
                      <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-sky-200/70">{item.path}</p>
                      <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-background">{item.title}</h3>
                      <p className="mt-4 text-sm leading-6 text-background/68">{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("workspace.label")}</p>
              <h2 className="type-heading max-w-md">{t("workspace.title")}</h2>
              <p className="type-body max-w-lg">{t("workspace.body")}</p>
            </div>
            <div className="surface-artifact-dark rounded-[2rem] p-6 [--artifact-accent:#0ea5e9]">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-200/70"><IconLayoutDashboard className="h-5 w-5" /> {t("workspace.compositionLabel")}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {workspace.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[.06] px-4 py-4 text-sm tracking-[-0.01em] text-background/78">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
            </div>
            <div className="grid gap-3">
              {capabilities.map((capability) => (
                <div key={capability} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#0ea5e9]">
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quick-start" className="scroll-mt-24 border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("quickStart.label")}</p>
              <h2 className="type-heading max-w-md">{t("quickStart.title")}</h2>
              <p className="type-body max-w-lg">{t("quickStart.body")}</p>
            </div>
            <div className="grid gap-5">
              <TerminalFlowArtifact />
              <div className="rounded-2xl border border-rule bg-card p-6">
                <p className="type-meta">{t("quickStart.panelLabel")}</p>
                <div className="mt-5 space-y-3">
                  {quickStart.map((command, index) => (
                    <div key={command} className="rounded-xl border border-rule bg-background p-4">
                      <p className="type-meta">{t("quickStart.stepLabel", { index: index + 1 })}</p>
                      <code className="mt-2 block overflow-x-auto font-mono text-sm text-foreground">{command}</code>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={aocLinks.docs} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center rounded-full border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel">
                    {t("quickStart.docsCta")}
                  </a>
                  <a href={aocLinks.github} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center rounded-full border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel">
                    {t("quickStart.repoCta")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-sky-700">{t("evolution.label")}</p>
              <h2 className="type-heading max-w-md">{t("evolution.title")}</h2>
              <p className="type-body max-w-lg">{t("evolution.body")}</p>
            </div>
            <div className="grid gap-4">
              {evolution.map((item) => (
                <article key={item} className="artifact-card rounded-2xl p-6 [--artifact-accent:#0ea5e9]">
                  <p className="type-body">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">{t("finalCta.label")}</p>
              <h2 className="type-heading max-w-2xl text-background">{t("finalCta.title")}</h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">{t("finalCta.body")}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-start">
              <a href={aocLinks.github} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground">
                {t("finalCta.primaryCta")}
                <IconCode className="h-4 w-4" />
              </a>
              <a href={aocLinks.docs} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center rounded-full border border-background/20 bg-background/8 px-5 py-3 text-sm font-medium text-background hover:border-background/40 hover:bg-background/12">
                {t("finalCta.secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
