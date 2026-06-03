import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { FadeIn } from "@/components/site/fade-in";
import {
  CapabilityConstellation,
  ProductArtifact,
  ProductWorldsMosaic,
} from "@/components/visual/product-artifacts";
import { HalftoneDots } from "@/components/visual/halftone-dots";
import {
  IconArrowRight,
  IconBrain,
  IconBuildingBank,
  IconMap2,
  IconRoute,
  IconSearch,
  IconTerminal2,
} from "@tabler/icons-react";

type ProductVariant = "voyager" | "funda" | "aoc";

type Product = {
  variant: ProductVariant;
  name: string;
  href: "/voyager" | "/funda" | "/aoc";
  domain: string;
  summary: string;
  proof: string;
  cta: string;
  thesis: string;
  bullets: readonly string[];
};

const productTheme: Record<
  ProductVariant,
  {
    eyebrow: string;
    accent: string;
    soft: string;
    text: string;
    icon: React.ElementType;
  }
> = {
  voyager: {
    eyebrow: "text-emerald-700",
    accent: "#10b981",
    soft: "bg-emerald-600/10",
    text: "text-emerald-700",
    icon: IconMap2,
  },
  funda: {
    eyebrow: "text-rose-700",
    accent: "#e11d48",
    soft: "bg-rose-600/10",
    text: "text-rose-700",
    icon: IconBuildingBank,
  },
  aoc: {
    eyebrow: "text-sky-700",
    accent: "#0ea5e9",
    soft: "bg-sky-600/10",
    text: "text-sky-700",
    icon: IconTerminal2,
  },
};

export async function HomePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  const products: readonly Product[] = [
    {
      variant: "voyager",
      name: "Voyager",
      href: "/voyager",
      domain: t("products.voyager.domain"),
      summary: t("products.voyager.summary"),
      proof: t("products.voyager.proof"),
      cta: t("products.voyager.cta"),
      thesis: "Tourism intelligence presented as a live operational atlas.",
      bullets: ["Geospatial discovery", "Scout and guardian agents", "Multilingual place context"],
    },
    {
      variant: "funda",
      name: "Funda",
      href: "/funda",
      domain: t("products.funda.domain"),
      summary: t("products.funda.summary"),
      proof: t("products.funda.proof"),
      cta: t("products.funda.cta"),
      thesis: "Funding workflows that turn eligibility into visible progress.",
      bullets: ["Opportunity matching", "Application workspace", "Role-aware review"],
    },
    {
      variant: "aoc",
      name: "AOC",
      href: "/aoc",
      domain: t("products.aoc.domain"),
      summary: t("products.aoc.summary"),
      proof: t("products.aoc.proof"),
      cta: t("products.aoc.cta"),
      thesis: "An operator cockpit for serious agentic engineering practice.",
      bullets: ["Persistent context", "Memory and tasks", "Terminal-native workflow"],
    },
  ] as const;

  const capabilities = [
    { icon: IconBrain, title: "AI agents and orchestration", text: "Agent behavior is shown as a product capability, not as a generic AI badge." },
    { icon: IconRoute, title: "Realtime workflow state", text: "Maps, applications, and tasks expose the transitions that matter to operators." },
    { icon: IconSearch, title: "Search, RAG, and memory", text: "The interface makes retrieval and persistence visible where decisions happen." },
    { icon: IconMap2, title: "Geospatial systems", text: "Voyager anchors the portfolio in live place, route, and entity views." },
    { icon: IconBuildingBank, title: "Institutional roles", text: "Funda supports applicants, consultants, admins, directors, and superusers." },
    { icon: IconTerminal2, title: "Operator tools", text: "AOC turns repo context and task state into a terminal-native cockpit." },
  ] as const;

  const inquiryItems = [
    t("inquiry.items.general"),
    t("inquiry.items.voyager"),
    t("inquiry.items.funda"),
    t("inquiry.items.aoc"),
  ] as const;

  return (
    <main className="bg-[#f5f1eb] text-[var(--intrface-ink)]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-[-12rem] top-[-16rem] h-[42rem] w-[42rem] rounded-full bg-emerald-700/8 blur-[100px]" />
          <div className="absolute bottom-[-20rem] left-[-16rem] h-[42rem] w-[42rem] rounded-full bg-rose-700/8 blur-[100px]" />
          <div className="absolute inset-x-0 top-20 h-80 halftone-field opacity-25 [--halftone-color:var(--intrface-ink)] [--halftone-size:34px]" data-drift="true" />
        </div>
        <div className="section-shell relative grid gap-14 py-24 sm:py-32 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-36">
          <div className="max-w-5xl">
            <FadeIn>
              <p className="type-section-label">Intrface product systems</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="mt-6 max-w-5xl text-[3.5rem] font-semibold leading-[0.9] tracking-[-0.07em] sm:text-[5.4rem] lg:text-[6.4rem]">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="mt-8 max-w-3xl text-xl font-medium leading-relaxed text-slate-700 sm:text-2xl">
                {t("hero.body")}
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#products" className="artifact-button rounded-full bg-[var(--intrface-ink)] px-8 py-4 text-sm font-semibold text-white shadow-xl">
                  {t("hero.primaryCta")}
                </a>
                <a href="#inquiry" className="artifact-button inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-8 py-4 text-sm font-semibold text-[var(--intrface-ink)] hover:bg-white">
                  {t("hero.secondaryCta")}
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={180}>
            <div className="relative">
              <HalftoneDots variant="ink" density="coarse" className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] opacity-45" />
              <ProductWorldsMosaic />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 border-b border-black/10">
        <div className="section-shell py-20 sm:py-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <FadeIn><p className="type-section-label">{t("products.label")}</p></FadeIn>
              <FadeIn delay={100}><h2 className="type-heading mt-4 max-w-2xl">{t("products.title")}</h2></FadeIn>
            </div>
            <FadeIn delay={200}><p className="max-w-xl text-base leading-7 text-slate-600">{t("products.body")}</p></FadeIn>
          </div>

          <div className="mt-12 grid gap-8">
            {products.map((product, index) => {
              const theme = productTheme[product.variant];
              const Icon = theme.icon;
              const reverse = index % 2 === 1;
              return (
                <FadeIn key={product.name} delay={100}>
                  <article
                    className="grid gap-8 overflow-hidden rounded-[2.75rem] border border-black/10 bg-white/62 p-5 shadow-[0_34px_100px_-70px_rgba(15,23,41,.55)] lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:p-8"
                    style={{ "--artifact-accent": theme.accent } as React.CSSProperties}
                  >
                    <div className={reverse ? "lg:order-2" : undefined}>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.soft}`}>
                          <Icon className={`h-6 w-6 ${theme.text}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-[.2em] ${theme.eyebrow}`}>{product.domain}</p>
                          <h3 className="mt-1 text-4xl font-semibold tracking-[-.055em] text-[var(--intrface-ink)] sm:text-5xl">{product.name}</h3>
                        </div>
                      </div>
                      <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 tracking-[-.035em] text-slate-950">{product.thesis}</p>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">{product.summary}</p>
                      <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        {product.bullets.map((bullet) => (
                          <div key={bullet} className="rounded-2xl border border-black/8 bg-white/72 px-4 py-3 text-sm font-medium text-slate-700">
                            {bullet}
                          </div>
                        ))}
                      </div>
                      <div className="mt-7 rounded-[1.4rem] border border-black/8 bg-white/62 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{t("products.proofLabel")}</p>
                        <p className="mt-3 text-base leading-7 text-slate-700">{product.proof}</p>
                      </div>
                      <Link href={product.href} className={`artifact-button mt-7 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold ${theme.text}`}>
                        {product.cta}
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className={reverse ? "lg:order-1" : undefined}>
                      <ProductArtifact variant={product.variant} />
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fbf8f2]">
        <div className="section-shell py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[.86fr_1.14fr] lg:items-start">
            <div>
              <FadeIn><p className="type-section-label">{t("principles.label")}</p></FadeIn>
              <FadeIn delay={100}><h2 className="type-heading mt-4 max-w-lg">{t("principles.title")}</h2></FadeIn>
              <FadeIn delay={200}><p className="mt-5 max-w-lg text-base leading-7 text-slate-600">{t("principles.body")}</p></FadeIn>
              <FadeIn delay={250}><div className="mt-8"><CapabilityConstellation /></div></FadeIn>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((capability, i) => {
                const Icon = capability.icon;
                return (
                  <FadeIn key={capability.title} delay={100 + i * 60}>
                    <article className="artifact-card h-full rounded-[2rem] p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/5">
                        <Icon className="h-5 w-5 text-slate-800" />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold tracking-[-.035em]">{capability.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{capability.text}</p>
                    </article>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="scroll-mt-24 bg-[var(--intrface-ink)] text-white">
        <div className="section-shell py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <FadeIn><p className="text-xs font-semibold uppercase tracking-[.24em] text-white/45">{t("inquiry.label")}</p></FadeIn>
              <FadeIn delay={100}><h2 className="mt-5 max-w-3xl text-[3rem] font-semibold leading-[.98] tracking-[-.055em] sm:text-[4.2rem]">{t("inquiry.title")}</h2></FadeIn>
              <FadeIn delay={200}><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{t("inquiry.body")}</p></FadeIn>
            </div>
            <FadeIn delay={250}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-6">
                <div className="pointer-events-none absolute inset-0 halftone-field opacity-20 [--halftone-color:white] [--halftone-size:24px]" aria-hidden="true" />
                <div className="relative grid gap-3 sm:grid-cols-2">
                  {inquiryItems.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[.03] px-4 py-4 text-sm text-white/78">{item}</div>
                  ))}
                </div>
                <a href="mailto:hello@intrface.eu" className="artifact-button relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[var(--intrface-ink)]">
                  hello@intrface.eu
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
