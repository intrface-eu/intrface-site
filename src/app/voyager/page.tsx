import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { voyagerLinks } from "@/lib/site/voyager-content";

export default async function VoyagerPage() {
  const t = await getTranslations("VoyagerPage");

  const audience = [
    { title: t("audience.items.0.title"), text: t("audience.items.0.text") },
    { title: t("audience.items.1.title"), text: t("audience.items.1.text") },
    { title: t("audience.items.2.title"), text: t("audience.items.2.text") },
  ] as const;

  const agents = [
    { name: "Voyager", persona: t("agents.items.0.persona"), domain: t("agents.items.0.domain"), summary: t("agents.items.0.summary") },
    { name: "Nexus", persona: t("agents.items.1.persona"), domain: t("agents.items.1.domain"), summary: t("agents.items.1.summary") },
    { name: "Guardian", persona: t("agents.items.2.persona"), domain: t("agents.items.2.domain"), summary: t("agents.items.2.summary") },
  ] as const;

  const scoutPillars = [t("scout.items.0"), t("scout.items.1"), t("scout.items.2"), t("scout.items.3")] as const;
  const mapLayer = [t("map.items.0"), t("map.items.1"), t("map.items.2"), t("map.items.3")] as const;
  const operations = [t("operations.items.0"), t("operations.items.1"), t("operations.items.2"), t("operations.items.3")] as const;
  const stakeholders = [t("stakeholders.items.0"), t("stakeholders.items.1"), t("stakeholders.items.2"), t("stakeholders.items.3")] as const;
  const proof = [
    { label: t("proof.items.0.label"), text: t("proof.items.0.text") },
    { label: t("proof.items.1.label"), text: t("proof.items.1.text") },
    { label: t("proof.items.2.label"), text: t("proof.items.2.text") },
  ] as const;
  const tech = [t("tech.items.0"), t("tech.items.1"), t("tech.items.2"), t("tech.items.3"), t("tech.items.4"), t("tech.items.5")] as const;

  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta">Voyager</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            </div>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#platform" className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">{t("hero.primaryCta")}</a>
              <a href="#architecture" className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel">{t("hero.secondaryCta")}</a>
              <a href={voyagerLinks.contact} className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel">{t("hero.tertiaryCta")}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-b border-rule bg-panel scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("platform.label")}</p>
              <h2 className="type-heading max-w-md">{t("platform.title")}</h2>
              <p className="type-body max-w-lg">{t("platform.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {audience.map((item) => (
                <article key={item.title} className="rounded-2xl border border-rule bg-card p-6">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">{item.title}</h3>
                  <p className="type-body mt-3">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="type-section-label">{t("agents.label")}</p>
            <h2 className="type-heading">{t("agents.title")}</h2>
            <p className="type-body">{t("agents.body")}</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {agents.map((agent) => (
              <article key={agent.name} className="rounded-2xl border border-rule bg-card p-6">
                <p className="type-meta">{agent.persona} · {agent.domain}</p>
                <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground">{agent.name}</h3>
                <p className="type-body mt-4">{agent.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("scout.label")}</p>
              <h2 className="type-heading max-w-md">{t("scout.title")}</h2>
              <p className="type-body max-w-lg">{t("scout.body")}</p>
            </div>
            <div className="rounded-2xl border border-rule bg-foreground p-6 text-background">
              <p className="text-sm uppercase tracking-[0.18em] text-background/65">{t("scout.pillarsLabel")}</p>
              <div className="mt-5 grid gap-3">
                {scoutPillars.map((pillar) => (
                  <div key={pillar} className="rounded-xl border border-background/12 bg-background/4 px-4 py-4 text-sm tracking-[-0.01em]">{pillar}</div>
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
              <p className="type-section-label">{t("map.label")}</p>
              <h2 className="type-heading max-w-md">{t("map.title")}</h2>
              <p className="type-body max-w-lg">{t("map.body")}</p>
            </div>
            <div className="grid gap-3">
              {mapLayer.map((item) => (
                <div key={item} className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("operations.label")}</p>
              <h2 className="type-heading max-w-md">{t("operations.title")}</h2>
              <p className="type-body max-w-lg">{t("operations.body")}</p>
            </div>
            <div className="grid gap-3">
              {operations.map((item) => (
                <div key={item} className="rounded-2xl border border-rule bg-background px-5 py-4 text-base tracking-[-0.02em] text-foreground">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("stakeholders.label")}</p>
              <h2 className="type-heading max-w-md">{t("stakeholders.title")}</h2>
              <p className="type-body max-w-lg">{t("stakeholders.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stakeholders.map((item) => (
                <article key={item} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="text-2xl font-medium tracking-[-0.03em] text-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("proof.label")}</p>
              <h2 className="type-heading max-w-md">{t("proof.title")}</h2>
            </div>
            <div className="grid gap-4">
              {proof.map((item) => (
                <article key={item.label} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="type-meta">{item.label}</p>
                  <p className="type-body mt-3">{item.text}</p>
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
              <p className="type-section-label">{t("tech.label")}</p>
              <h2 className="type-heading max-w-md">{t("tech.title")}</h2>
              <p className="type-body max-w-lg">{t("tech.body")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tech.map((item) => (
                <div key={item} className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground">{item}</div>
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
              <a href={voyagerLinks.contact} className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90">{t("finalCta.primaryCta")}</a>
              <Link href={voyagerLinks.projects} className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6">{t("finalCta.secondaryCta")}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
