import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type ProductVariant = "aoc" | "voyager" | "funda";

type FeaturedProduct = {
  variant: ProductVariant;
  name: string;
  href: "/aoc" | "/voyager" | "/funda";
  status: string;
  summary: string;
  cta: string;
};

function ProductVisual({
  name,
  variant,
  compact = false,
}: {
  name: string;
  variant: ProductVariant;
  compact?: boolean;
}) {
  const palette =
    variant === "aoc"
      ? {
          frame: "#11161f",
          glow: "rgba(16, 185, 129, 0.18)",
          accent: "#1f8f73",
          line: "rgba(226, 232, 240, 0.8)",
          tint: "linear-gradient(135deg, rgba(18, 25, 36, 0.96), rgba(8, 12, 20, 0.92))",
        }
      : variant === "voyager"
        ? {
            frame: "#102033",
            glow: "rgba(14, 165, 233, 0.16)",
            accent: "#1d82b8",
            line: "rgba(226, 232, 240, 0.78)",
            tint: "linear-gradient(135deg, rgba(15, 30, 46, 0.96), rgba(11, 19, 31, 0.92))",
          }
        : {
            frame: "#201718",
            glow: "rgba(244, 114, 182, 0.16)",
            accent: "#c3557f",
            line: "rgba(255, 241, 242, 0.8)",
            tint: "linear-gradient(135deg, rgba(34, 17, 23, 0.96), rgba(24, 14, 18, 0.92))",
          };

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-rule bg-card p-3 shadow-[0_12px_40px_rgba(10,10,11,0.05)]">
      <div
        className={`relative overflow-hidden rounded-[1.15rem] border border-white/50 ${compact ? "aspect-[16/10]" : "aspect-[16/11]"}`}
        style={{
          background: palette.tint,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 50px ${palette.glow}`,
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: compact ? "22px 22px" : "26px 26px",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background: `linear-gradient(180deg, ${palette.glow}, transparent)`,
          }}
        />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
          <div className="rounded-full border border-white/12 bg-black/18 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/78">
            {name}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
          </div>
        </div>

        {variant === "aoc" ? (
          <>
            <div className="absolute inset-y-16 left-4 w-[20%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute inset-y-16 right-4 w-[18%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute bottom-4 left-[24%] right-[22%] top-16 rounded-[1rem] border" style={{ borderColor: palette.accent }} />
            <div className="absolute left-[27%] right-[25%] top-[31%] h-2 rounded-full" style={{ background: palette.line }} />
            <div className="absolute left-[27%] right-[33%] top-[40%] h-2 rounded-full bg-white/40" />
            <div className="absolute left-[27%] right-[29%] top-[49%] h-2 rounded-full bg-white/28" />
            <div className="absolute bottom-7 left-[27%] right-[29%] h-10 rounded-[0.9rem] border border-white/10 bg-black/18" />
          </>
        ) : variant === "voyager" ? (
          <>
            <div className="absolute inset-4 rounded-[1rem] border border-white/12 bg-black/12" />
            <div className="absolute left-[10%] top-[18%] h-[52%] w-[48%] rounded-[999px] border border-white/18" />
            <div className="absolute left-[18%] top-[26%] h-[36%] w-[34%] rounded-[999px] border border-white/12" />
            <div className="absolute left-[42%] top-[30%] h-3 w-3 rounded-full" style={{ background: palette.accent }} />
            <div className="absolute left-[56%] top-[22%] h-[18%] w-[28%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute left-[56%] top-[44%] h-[30%] w-[28%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute bottom-[18%] left-[56%] right-[18%] h-2 rounded-full bg-white/42" />
          </>
        ) : (
          <>
            <div className="absolute left-4 right-4 top-16 h-12 rounded-[1rem] border border-white/12 bg-black/16" />
            <div className="absolute left-4 top-[43%] h-[34%] w-[44%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute right-4 top-[43%] h-[16%] w-[42%] rounded-[1rem] border border-white/12 bg-black/18" />
            <div className="absolute right-4 top-[64%] h-[13%] w-[42%] rounded-[1rem] border border-white/12 bg-black/12" />
            <div className="absolute left-[12%] top-[57%] h-2 w-[24%] rounded-full" style={{ background: palette.line }} />
            <div className="absolute right-[16%] top-[50%] h-2 w-[18%] rounded-full bg-white/40" />
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-[0.72rem] uppercase tracking-[0.16em] text-white/62">
          <span>visual</span>
          <span>placeholder</span>
        </div>
      </div>
    </div>
  );
}

export async function HomePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });

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

  const featuredProducts: readonly FeaturedProduct[] = [
    {
      variant: "aoc",
      name: "AOC",
      href: "/aoc",
      status: t("featuredProducts.status"),
      summary: t("featuredProducts.aoc.summary"),
      cta: t("featuredProducts.aoc.cta"),
    },
    {
      variant: "voyager",
      name: "Voyager",
      href: "/voyager",
      status: t("featuredProducts.status"),
      summary: t("featuredProducts.voyager.summary"),
      cta: t("featuredProducts.voyager.cta"),
    },
    {
      variant: "funda",
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

  const heroLead = featuredProducts[0];
  const heroSupport = featuredProducts.slice(1);

  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-18 sm:py-24 lg:py-28">
          <div className="grid gap-12 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
            <div className="max-w-5xl space-y-8">
              <p className="type-section-label">Intrface</p>
              <h1 className="type-display max-w-5xl">{t("hero.title")}</h1>
              <p className="type-body-lg max-w-3xl">{t("hero.body")}</p>

              <div className="flex flex-wrap gap-3 pt-1">
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

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                {proofItems.map((item) => (
                  <article key={item.label} className="rounded-2xl border border-rule bg-card p-5 shadow-[0_10px_30px_rgba(10,10,11,0.04)]">
                    <p className="type-meta">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/82">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-rule bg-panel/70 p-4 sm:p-6 shadow-[0_24px_80px_rgba(10,10,11,0.06)]">
              <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
                <div>
                  <p className="type-section-label">{t("featuredProducts.label")}</p>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-foreground/76">{t("featuredProducts.body")}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <article className="rounded-[1.8rem] border border-rule bg-card p-5 shadow-[0_16px_40px_rgba(10,10,11,0.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="type-meta">{heroLead.status}</p>
                      <h2 className="mt-3 text-[2rem] font-medium tracking-[-0.05em] text-foreground">{heroLead.name}</h2>
                    </div>
                    <Link href={heroLead.href} className="text-sm font-medium text-accent hover:opacity-80">
                      {heroLead.cta}
                    </Link>
                  </div>
                  <div className="mt-5">
                    <ProductVisual name={heroLead.name} variant={heroLead.variant} />
                  </div>
                  <p className="mt-5 text-sm leading-7 text-foreground/82">{heroLead.summary}</p>
                </article>

                <div className="grid gap-4 md:grid-cols-2">
                  {heroSupport.map((product) => (
                    <article key={product.name} className="rounded-[1.8rem] border border-rule bg-card p-5 shadow-[0_16px_40px_rgba(10,10,11,0.04)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="type-meta">{product.status}</p>
                          <h2 className="mt-3 text-[1.65rem] font-medium tracking-[-0.05em] text-foreground">{product.name}</h2>
                        </div>
                        <Link href={product.href} className="text-sm font-medium text-accent hover:opacity-80">
                          {product.cta}
                        </Link>
                      </div>
                      <div className="mt-5">
                        <ProductVisual name={product.name} variant={product.variant} compact />
                      </div>
                      <p className="mt-5 text-sm leading-7 text-foreground/82">{product.summary}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("whatWeDo.label")}</p>
              <h2 className="type-heading max-w-md">{t("whatWeDo.title")}</h2>
              <p className="type-body max-w-lg">{t("whatWeDo.body")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {operatingBlocks.map((block) => (
                <article key={block.title} className="rounded-2xl border border-rule bg-card p-6 shadow-[0_12px_36px_rgba(10,10,11,0.04)]">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">{block.title}</h3>
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
              <article key={product.name} className="flex h-full flex-col rounded-[2rem] border border-rule bg-card p-6 shadow-[0_16px_48px_rgba(10,10,11,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="type-meta">{product.status}</p>
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>

                <div className="mt-6">
                  <ProductVisual name={product.name} variant={product.variant} compact />
                </div>

                <h3 className="mt-6 text-3xl font-medium tracking-[-0.04em] text-foreground">{product.name}</h3>
                <p className="type-body mt-4 flex-1">{product.summary}</p>
                <Link href={product.href} className="mt-8 inline-flex text-sm font-medium text-accent hover:opacity-80">
                  {product.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("capabilities.label")}</p>
              <h2 className="type-heading max-w-md">{t("capabilities.title")}</h2>
              <p className="type-body max-w-lg">{t("capabilities.body")}</p>
            </div>

            <div className="rounded-[2rem] border border-rule bg-card p-6 shadow-[0_16px_48px_rgba(10,10,11,0.05)] sm:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {featuredProducts.map((product) => (
                  <div key={product.name} className="rounded-2xl border border-rule bg-background px-4 py-4">
                    <p className="type-meta">{product.status}</p>
                    <p className="mt-2 text-xl font-medium tracking-[-0.03em] text-foreground">{product.name}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-px bg-rule" />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {capabilities.map((capability) => (
                  <div key={capability} className="rounded-2xl border border-rule bg-background px-5 py-4 text-base tracking-[-0.02em] text-foreground">
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">{t("whyIntrface.label")}</p>
              <h2 className="type-heading max-w-md">{t("whyIntrface.title")}</h2>
              <p className="type-body max-w-lg">{t("whyIntrface.body")}</p>
            </div>

            <div className="grid gap-4">
              {proofItems.map((item) => (
                <article key={item.label} className="rounded-2xl border border-rule bg-card p-6 shadow-[0_12px_36px_rgba(10,10,11,0.04)]">
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
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">{t("finalCta.label")}</p>
              <h2 className="type-heading max-w-2xl text-background">{t("finalCta.title")}</h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">{t("finalCta.body")}</p>
            </div>

            <div className="rounded-[2rem] border border-background/12 bg-background/4 p-6 sm:p-7">
              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
                >
                  {t("finalCta.primaryCta")}
                </a>
                <Link
                  href="/aoc"
                  className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6"
                >
                  {featuredProducts[0].cta}
                </Link>
              </div>

              <div className="mt-5 h-px bg-background/10" />

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link href="/voyager" className="rounded-xl border border-background/12 px-4 py-4 text-sm text-background/86 transition-colors hover:bg-background/6">
                  {featuredProducts[1].cta}
                </Link>
                <Link href="/funda" className="rounded-xl border border-background/12 px-4 py-4 text-sm text-background/86 transition-colors hover:bg-background/6">
                  {featuredProducts[2].cta}
                </Link>
                <a
                  href="mailto:hello@intrface.eu"
                  className="sm:col-span-2 rounded-xl border border-background/12 px-4 py-4 text-sm font-medium text-background transition-colors hover:bg-background/6"
                >
                  hello@intrface.eu
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
