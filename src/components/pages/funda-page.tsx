import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const fundaLinks = {
  github: "https://github.com/intrface-eu/Funda",
  contact: "mailto:hello@intrface.eu?subject=Funda%20platform",
  projects: "/#projects",
} as const;

export async function FundaPage() {
  const t = await getTranslations("FundaPage");

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

  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">{t("hero.label")}</p>
            <div className="space-y-4">
              <p className="type-meta">Funda</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            </div>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t("hero.primaryCta")}
              </a>
              <a
                href={fundaLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("platform.label")}</p>
              <h2 className="type-heading max-w-md">{t("platform.title")}</h2>
              <p className="type-body max-w-lg">{t("platform.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <article key={role} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="text-lg font-medium tracking-[-0.02em] text-foreground">{role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
              <p className="type-body max-w-lg">{t("capabilities.body")}</p>
            </div>
            <div className="grid gap-3">
              {capabilities.map((item) => (
                <div key={item} className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground">
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
              <p className="type-section-label">{t("system.label")}</p>
              <h2 className="type-heading max-w-md">{t("system.title")}</h2>
              <p className="type-body max-w-lg">{t("system.body")}</p>
            </div>
            <div className="rounded-2xl border border-rule bg-foreground p-6 text-background">
              <p className="text-sm uppercase tracking-[0.18em] text-background/65">{t("system.panelLabel")}</p>
              <div className="mt-5 grid gap-3">
                {system.map((item) => (
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
              <p className="type-section-label">{t("tech.label")}</p>
              <h2 className="type-heading max-w-md">{t("tech.title")}</h2>
              <p className="type-body max-w-lg">{t("tech.body")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tech.map((item) => (
                <div key={item} className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground">
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
              <a href={fundaLinks.contact} className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90">
                {t("finalCta.primaryCta")}
              </a>
              <Link href={fundaLinks.projects} className="inline-flex items-center justify-center rounded-md border border-background/20 bg-background/8 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/12">
                {t("finalCta.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
