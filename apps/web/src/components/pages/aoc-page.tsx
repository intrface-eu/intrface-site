import { getTranslations } from "next-intl/server";
import { aocLinks } from "@/lib/site/aoc-content";
import type { AppLocale } from "@/i18n/routing";

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
    },
    {
      title: t("architecture.items.memory.title"),
      path: ".aoc/memory.md",
      description: t("architecture.items.memory.description"),
    },
    {
      title: t("architecture.items.tasks.title"),
      path: "tasks.json / Taskmaster",
      description: t("architecture.items.tasks.description"),
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
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta">AOC — Agent Ops Cockpit</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            </div>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={aocLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t("hero.primaryCta")}
              </a>
              <a
                href="#quick-start"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                {t("hero.secondaryCta")}
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                {t("hero.tertiaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("painPoints.label")}</p>
              <h2 className="type-heading max-w-md">{t("painPoints.title")}</h2>
              <p className="type-body max-w-lg">{t("painPoints.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((point) => (
                <article key={point} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="text-lg font-medium tracking-[-0.02em] text-foreground">{point}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="type-section-label">{t("architecture.label")}</p>
            <h2 className="type-heading">{t("architecture.title")}</h2>
            <p className="type-body">{t("architecture.body")}</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {architecture.map((item) => (
              <article key={item.title} className="rounded-2xl border border-rule bg-card p-6">
                <p className="type-meta">{item.path}</p>
                <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground">{item.title}</h3>
                <p className="type-body mt-4">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("workspace.label")}</p>
              <h2 className="type-heading max-w-md">{t("workspace.title")}</h2>
              <p className="type-body max-w-lg">{t("workspace.body")}</p>
            </div>
            <div className="rounded-2xl border border-rule bg-foreground p-6 text-background">
              <p className="text-sm uppercase tracking-[0.18em] text-background/65">{t("workspace.compositionLabel")}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {workspace.map((item) => (
                  <div key={item} className="rounded-xl border border-background/12 bg-background/4 px-4 py-4 text-sm tracking-[-0.01em]">
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
              <p className="type-section-label">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
            </div>
            <div className="grid gap-3">
              {capabilities.map((capability) => (
                <div key={capability} className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground">
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quick-start" className="border-b border-rule bg-panel scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("quickStart.label")}</p>
              <h2 className="type-heading max-w-md">{t("quickStart.title")}</h2>
              <p className="type-body max-w-lg">{t("quickStart.body")}</p>
            </div>
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
                <a
                  href={aocLinks.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel"
                >
                  {t("quickStart.docsCta")}
                </a>
                <a
                  href={aocLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-rule bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-panel"
                >
                  {t("quickStart.repoCta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("evolution.label")}</p>
              <h2 className="type-heading max-w-md">{t("evolution.title")}</h2>
              <p className="type-body max-w-lg">{t("evolution.body")}</p>
            </div>
            <div className="grid gap-4">
              {evolution.map((item) => (
                <article key={item} className="rounded-2xl border border-rule bg-card p-6">
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
              <a
                href={aocLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                {t("finalCta.primaryCta")}
              </a>
              <a
                href={aocLinks.docs}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-background/20 bg-background/8 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/12"
              >
                {t("finalCta.secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
