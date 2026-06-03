import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { FundaArtifact, RoleMapArtifact } from "@/components/visual/product-artifacts";
import { IconArrowRight, IconCalendarDue, IconChecklist, IconFileText, IconScale } from "@tabler/icons-react";

const fundaLinks = {
  github: "https://github.com/intrface-eu/Funda",
  contact: "mailto:hello@intrface.eu?subject=Funda%20platform",
  projects: "/#products",
} as const;

export async function FundaPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "FundaPage" });

  const roles = [
    t("roles.items.0"),
    t("roles.items.1"),
    t("roles.items.2"),
    t("roles.items.3"),
    t("roles.items.4"),
  ] as const;

  const capabilities = [
    t("capabilities.items.0"),
    t("capabilities.items.1"),
    t("capabilities.items.2"),
    t("capabilities.items.3"),
    t("capabilities.items.4"),
    t("capabilities.items.5"),
  ] as const;

  const system = [
    t("system.items.0"),
    t("system.items.1"),
    t("system.items.2"),
    t("system.items.3"),
  ] as const;

  const tech = [
    t("tech.items.0"),
    t("tech.items.1"),
    t("tech.items.2"),
    t("tech.items.3"),
    t("tech.items.4"),
    t("tech.items.5"),
  ] as const;

  const workflow = [
    { label: "Opportunity match", icon: IconScale, value: "92%" },
    { label: "Eligibility evidence", icon: IconChecklist, value: "ready" },
    { label: "Documents", icon: IconFileText, value: "12" },
    { label: "Deadline", icon: IconCalendarDue, value: "tracked" },
  ] as const;

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-rule bg-[#f8f0ec]">
        <div className="pointer-events-none absolute inset-0 halftone-field opacity-35 [--halftone-color:#9f1239] [--halftone-size:34px]" data-drift="true" aria-hidden="true" />
        <div className="section-shell relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label text-rose-700">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta">Funda — funding operations</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            </div>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#capabilities" className="artifact-button inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">
                {t("hero.primaryCta")}
              </a>
              <a href={fundaLinks.github} target="_blank" rel="noreferrer" className="artifact-button inline-flex items-center justify-center rounded-full border border-rose-950/10 bg-white/70 px-6 py-3 text-sm font-medium text-foreground hover:bg-white">
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
          <FundaArtifact />
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-rose-700">{t("platform.label")}</p>
              <h2 className="type-heading max-w-md">{t("platform.title")}</h2>
              <p className="type-body max-w-lg">{t("platform.body")}</p>
            </div>
            <RoleMapArtifact roles={roles} />
          </div>
        </div>
      </section>

      <section id="capabilities" className="scroll-mt-24 border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-rose-700">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
              <p className="type-body max-w-lg">{t("capabilities.body")}</p>
            </div>
            <div className="grid gap-4">
              <div className="surface-artifact rounded-[2rem] p-5 [--artifact-accent:#e11d48]">
                <div className="grid gap-3 sm:grid-cols-4">
                  {workflow.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-[1.25rem] border border-rose-950/10 bg-white/75 p-4">
                        <Icon className="h-5 w-5 text-rose-700" />
                        <p className="mt-4 text-sm font-semibold text-rose-950">{item.label}</p>
                        <p className="mt-2 text-xs uppercase tracking-[.16em] text-rose-700">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {capabilities.map((item) => (
                <div key={item} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#e11d48]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label text-rose-700">{t("system.label")}</p>
              <h2 className="type-heading max-w-md">{t("system.title")}</h2>
              <p className="type-body max-w-lg">{t("system.body")}</p>
            </div>
            <div className="surface-artifact relative overflow-hidden rounded-[2rem] p-6 [--artifact-accent:#e11d48] [--ripple-color:#e11d48]">
              <span className="ripple-ring right-8 top-8 h-28 w-28" data-pulse="true" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">{t("system.panelLabel")}</p>
              <div className="mt-5 grid gap-3">
                {system.map((item, index) => (
                  <div key={item} className="relative rounded-xl border border-rose-950/10 bg-white/72 px-4 py-4 text-sm tracking-[-0.01em] text-rose-950">
                    <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600/10 text-xs font-semibold text-rose-700">{index + 1}</span>
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
              <p className="type-section-label text-rose-700">{t("tech.label")}</p>
              <h2 className="type-heading max-w-md">{t("tech.title")}</h2>
              <p className="type-body max-w-lg">{t("tech.body")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tech.map((item) => (
                <div key={item} className="artifact-card rounded-2xl px-5 py-4 text-base tracking-[-0.02em] text-foreground [--artifact-accent:#e11d48]">
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
              <a href={fundaLinks.contact} className="artifact-button inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground">
                {t("finalCta.primaryCta")}
                <IconArrowRight className="h-4 w-4" />
              </a>
              <Link href={fundaLinks.projects} className="artifact-button inline-flex items-center justify-center rounded-full border border-background/20 bg-background/8 px-5 py-3 text-sm font-medium text-background hover:border-background/40 hover:bg-background/12">
                {t("finalCta.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
