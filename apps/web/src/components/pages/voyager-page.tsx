import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { voyagerLinks } from "@/lib/site/voyager-content";
import { voyagerAgents } from "@/lib/site/voyager/product-model";
import { AgentSystemGrid, AtlasLayerStack, type PublicAgent } from "@/components/voyager";
import { ScoutJourneyArtifact, VoyagerArtifact } from "@/components/visual/product-artifacts";
import type { AppLocale } from "@/i18n/routing";
import { IconBuildingCommunity, IconLanguage, IconMap2, IconRoute, IconUsersGroup } from "@tabler/icons-react";

export async function VoyagerPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "VoyagerPage" });

  const audience = [
    { title: t("audience.items.0.title"), text: t("audience.items.0.text") },
    { title: t("audience.items.1.title"), text: t("audience.items.1.text") },
    { title: t("audience.items.2.title"), text: t("audience.items.2.text") },
    { title: t("audience.items.3.title"), text: t("audience.items.3.text") },
  ] as const;

  const agents = voyagerAgents.map((agent, index) => ({
    ...agent,
    summary: t(`agents.items.${index}.summary`),
  })) satisfies PublicAgent[];

  const scoutPillars = [t("scout.items.0"), t("scout.items.1"), t("scout.items.2"), t("scout.items.3")] as const;
  const mapLayer = [t("map.items.0"), t("map.items.1"), t("map.items.2"), t("map.items.3")] as const;
  const operations = [t("operations.items.0"), t("operations.items.1"), t("operations.items.2"), t("operations.items.3")] as const;
  const stakeholders = [t("stakeholders.items.0"), t("stakeholders.items.1"), t("stakeholders.items.2"), t("stakeholders.items.3"), t("stakeholders.items.4")] as const;
  const proof = [
    { label: t("proof.items.0.label"), text: t("proof.items.0.text") },
    { label: t("proof.items.1.label"), text: t("proof.items.1.text") },
    { label: t("proof.items.2.label"), text: t("proof.items.2.text") },
  ] as const;
  const tech = [t("tech.items.0"), t("tech.items.1"), t("tech.items.2"), t("tech.items.3"), t("tech.items.4"), t("tech.items.5")] as const;

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-rule bg-[#eaf3e4]">
        <div className="pointer-events-none absolute inset-0 halftone-field opacity-35 [--halftone-color:#065f46] [--halftone-size:34px]" data-drift="true" aria-hidden="true" />
        <div className="section-shell relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label text-emerald-700">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta">Voyager — tourism intelligence</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            </div>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#platform" className="artifact-button inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
                {t("hero.primaryCta")}
              </a>
              <a href="#architecture" className="artifact-button inline-flex items-center justify-center rounded-full border border-emerald-950/10 bg-white/70 px-5 py-3 text-sm font-medium text-foreground hover:bg-white">
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
          <VoyagerArtifact />
        </div>
      </section>

      <section id="platform" className="scroll-mt-24 border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.25fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("platform.label")}</p>
              <h2 className="type-heading max-w-md">{t("platform.title")}</h2>
              <p className="type-body max-w-lg">{t("platform.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {audience.map((item) => (
                <article key={item.title} className="artifact-card rounded-2xl p-6 [--artifact-accent:#10b981]">
                  <IconUsersGroup className="h-6 w-6 text-emerald-700" />
                  <h3 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-foreground">{item.title}</h3>
                  <p className="type-body mt-4">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-24 border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.2fr] lg:items-start">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("agents.label")}</p>
              <h2 className="type-heading max-w-2xl">{t("agents.title")}</h2>
              <p className="type-body max-w-2xl">{t("agents.body")}</p>
            </div>
            <AgentSystemGrid agents={agents} />
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("scout.label")}</p>
              <h2 className="type-heading max-w-md">{t("scout.title")}</h2>
              <p className="type-body max-w-lg">{t("scout.body")}</p>
            </div>
            <div className="grid gap-5">
              <ScoutJourneyArtifact />
              <div className="grid gap-3 sm:grid-cols-2">
                {scoutPillars.map((item) => (
                  <div key={item} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#10b981]">
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
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("map.label")}</p>
              <h2 className="type-heading max-w-md">{t("map.title")}</h2>
              <p className="type-body max-w-lg">{t("map.body")}</p>
            </div>
            <div className="grid gap-5">
              <AtlasLayerStack />
              <div className="grid gap-3 sm:grid-cols-2">
                {mapLayer.map((item) => (
                  <div key={item} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#10b981]">
                    <IconMap2 className="mb-3 h-5 w-5 text-emerald-700" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("operations.label")}</p>
              <h2 className="type-heading max-w-md">{t("operations.title")}</h2>
              <p className="type-body max-w-lg">{t("operations.body")}</p>
            </div>
            <div className="surface-artifact relative overflow-hidden rounded-[2rem] p-6 [--artifact-accent:#10b981] [--ripple-color:#10b981]">
              <span className="ripple-ring left-8 top-8 h-28 w-28" data-pulse="true" />
              <div className="grid gap-3 sm:grid-cols-2">
                {operations.map((item, index) => (
                  <div key={item} className="relative rounded-[1.25rem] border border-emerald-950/10 bg-white/74 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-xs text-emerald-700">{index + 1}</span>
                      {item}
                    </div>
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
              <p className="type-section-label text-emerald-700">{t("stakeholders.label")}</p>
              <h2 className="type-heading max-w-md">{t("stakeholders.title")}</h2>
              <p className="type-body max-w-lg">{t("stakeholders.body")}</p>
            </div>
            <div className="surface-artifact rounded-[2rem] p-5 [--artifact-accent:#10b981]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stakeholders.map((item) => (
                  <div key={item} className="rounded-[1.2rem] border border-emerald-950/10 bg-white/74 p-4 text-sm font-semibold text-emerald-950">
                    <IconBuildingCommunity className="mb-4 h-5 w-5 text-emerald-700" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("proof.label")}</p>
              <h2 className="type-heading max-w-md">{t("proof.title")}</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {proof.map((item) => (
                <article key={item.label} className="artifact-card rounded-2xl p-6 [--artifact-accent:#10b981]">
                  <p className="type-meta text-emerald-700">{item.label}</p>
                  <p className="type-body mt-4">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-emerald-700">{t("tech.label")}</p>
              <h2 className="type-heading max-w-md">{t("tech.title")}</h2>
              <p className="type-body max-w-lg">{t("tech.body")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tech.map((item) => (
                <div key={item} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#10b981]">
                  <IconLanguage className="mb-3 h-5 w-5 text-emerald-700" />
                  {item}
                </div>
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
              <a href={voyagerLinks.contact} className="artifact-button inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground">
                {t("finalCta.primaryCta")}
                <IconRoute className="h-4 w-4" />
              </a>
              <Link href={voyagerLinks.projects} className="artifact-button inline-flex items-center justify-center rounded-full border border-background/20 bg-background/8 px-5 py-3 text-sm font-medium text-background hover:border-background/40 hover:bg-background/12">
                {t("finalCta.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
