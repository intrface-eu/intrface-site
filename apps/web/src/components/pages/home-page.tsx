import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function HomePage() {
  const t = await getTranslations("HomePage");

  const operatingBlocks = [
    {
      title: t("operatingBlocks.buildProducts.title"),
      text: t("operatingBlocks.buildProducts.text"),
    },
    {
      title: t("operatingBlocks.designSystems.title"),
      text: t("operatingBlocks.designSystems.text"),
    },
    {
      title: t("operatingBlocks.operationalizeAi.title"),
      text: t("operatingBlocks.operationalizeAi.text"),
    },
    {
      title: t("operatingBlocks.platformLeverage.title"),
      text: t("operatingBlocks.platformLeverage.text"),
    },
  ] as const;

  const featuredProducts = [
    {
      name: "AOC",
      href: "/aoc",
      status: t("featuredProducts.status"),
      summary: t("featuredProducts.aoc.summary"),
      cta: t("featuredProducts.aoc.cta"),
    },
    {
      name: "Voyager",
      href: "/voyager",
      status: t("featuredProducts.status"),
      summary: t("featuredProducts.voyager.summary"),
      cta: t("featuredProducts.voyager.cta"),
    },
    {
      name: "Funda",
      href: "/funda",
      status: t("featuredProducts.status"),
      summary: t("featuredProducts.funda.summary"),
      cta: t("featuredProducts.funda.cta"),
    },
  ] as const;

  const capabilities = [
    t("capabilities.items.0"),
    t("capabilities.items.1"),
    t("capabilities.items.2"),
    t("capabilities.items.3"),
    t("capabilities.items.4"),
    t("capabilities.items.5"),
  ] as const;

  const proofItems = [
    {
      label: t("proof.publicProductTruth.label"),
      text: t("proof.publicProductTruth.text"),
    },
    {
      label: t("proof.systemThinking.label"),
      text: t("proof.systemThinking.text"),
    },
    {
      label: t("proof.staticFirstClarity.label"),
      text: t("proof.staticFirstClarity.text"),
    },
  ] as const;

  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-32">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">Intrface</p>
            <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
            <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t("hero.primaryCta")}
              </a>
              <a
                href="#contact"
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
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("whatWeDo.label")}</p>
              <h2 className="type-heading max-w-md">{t("whatWeDo.title")}</h2>
              <p className="type-body max-w-lg">{t("whatWeDo.body")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {operatingBlocks.map((block) => (
                <article
                  key={block.title}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">
                    {block.title}
                  </h3>
                  <p className="type-body mt-3">{block.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="type-section-label">{t("featuredProducts.label")}</p>
              <h2 className="type-heading max-w-2xl">{t("featuredProducts.title")}</h2>
            </div>
            <p className="type-body max-w-xl">{t("featuredProducts.body")}</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="flex h-full flex-col rounded-2xl border border-rule bg-card p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="type-meta">{product.status}</p>
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>
                <h3 className="mt-6 text-3xl font-medium tracking-[-0.04em] text-foreground">
                  {product.name}
                </h3>
                <p className="type-body mt-4 flex-1">{product.summary}</p>
                <Link
                  href={product.href}
                  className="mt-8 inline-flex text-sm font-medium text-accent hover:opacity-80"
                >
                  {product.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
              <p className="type-body max-w-lg">{t("capabilities.body")}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl border border-rule bg-background px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("whyIntrface.label")}</p>
              <h2 className="type-heading max-w-md">{t("whyIntrface.title")}</h2>
              <p className="type-body max-w-lg">{t("whyIntrface.body")}</p>
            </div>

            <div className="grid gap-4">
              {proofItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <p className="type-meta">{item.label}</p>
                  <p className="type-body mt-3">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-foreground text-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">
                {t("finalCta.label")}
              </p>
              <h2 className="type-heading max-w-2xl text-background">{t("finalCta.title")}</h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">
                {t("finalCta.body")}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-start">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                {t("finalCta.primaryCta")}
              </a>
              <a
                href="mailto:hello@intrface.eu"
                className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6"
              >
                hello@intrface.eu
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
