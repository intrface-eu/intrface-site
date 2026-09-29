import Image from "next/image";
import { IconArrowLeft } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const textLink =
  "type-caption inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const FEATURES = ["worlds", "links", "map", "search", "telegram", "sort", "collections"] as const;
const STEPS = ["send", "read", "find"] as const;
const REASONS = ["reasons", "unsure", "yours"] as const;

/* The ink drawings from Index's own About page, copied as they are. */
const DRAWINGS = {
  catalogue: { src: "/proof/projects/index/about-catalogue.webp", width: 1536, height: 860 },
  worlds: { src: "/proof/projects/index/about-worlds.webp", width: 1200, height: 555 },
  video: { src: "/proof/projects/index/about-video.webp", width: 1200, height: 469 },
} as const;

/**
 * "What is Index?": Index's About page, hosted here until Index opens. The
 * section rhythm follows the About page in the Index repo (what it is,
 * what you can do, how it works in three steps, why it holds, the scope at
 * the close) in this site's own type and paper. Coming soon: no link to the
 * product, no sign-in, no request for access, no source, no numbers.
 */
export async function IndexAboutPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "IndexAbout" });
  const grid = await getTranslations({ locale, namespace: "HomeGrid.common" });

  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-10 sm:pb-12 sm:pt-14">
        <Link className={textLink} href="/" locale={locale}>
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
          {grid("backToGrid")}
        </Link>
        <div className="mt-8 flex items-center gap-3">
          {/* Index's mark in its dark-scheme ink, on an ink plate. Decorative:
              the label beside it names the product. */}
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-ink">
            <Image alt="" className="h-6 w-auto" height={24} priority src="/proof/projects/index/logo.svg" unoptimized width={7} />
          </span>
          <p className="type-section-label">{t("eyebrow")}</p>
        </div>
        <h1 className="type-display mt-6">{t("title")}</h1>
        <p className="type-body-lg mt-5">{t("lede")}</p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-rule bg-white/72 px-3.5 py-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-ink-muted" />
          <span className="type-caption">{t("status")}</span>
        </p>
      </header>

      <div className="section-shell pb-16 sm:pb-20">
        <Image
          alt={t("catalogueAlt")}
          className="project-capture"
          {...DRAWINGS.catalogue}
          priority
          sizes="(min-width: 1280px) 1200px, calc(100vw - 3rem)"
        />
      </div>

      <Chapter label={t("can.label")} lede={t("can.lede")} title={t("can.title")}>
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <Image
              alt={t("can.worldsAlt")}
              className="project-capture lg:sticky lg:top-24"
              {...DRAWINGS.worlds}
              sizes="(min-width: 1280px) 460px, (min-width: 1024px) 36vw, calc(100vw - 3rem)"
            />
          </div>
          <dl className="lg:col-span-3">
            {FEATURES.map((key) => (
              <div className="border-t border-rule py-5 first:border-t-0 first:pt-0" key={key}>
                <dt className="type-title">{t(`can.features.${key}.title`)}</dt>
                <dd className="type-body mt-1">{t(`can.features.${key}.copy`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Chapter>

      <Chapter label={t("how.label")} title={t("how.title")}>
        <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((key, index) => (
            <li className="border-t border-ink/30 pt-4" key={key}>
              <p className="type-section-label">{t("how.step", { n: index + 1 })}</p>
              <h3 className="type-title mt-2">{t(`how.steps.${key}.title`)}</h3>
              <p className="type-body mt-2">{t(`how.steps.${key}.copy`)}</p>
            </li>
          ))}
        </ol>
        <Image
          alt={t("how.videoAlt")}
          className="project-capture mt-12"
          {...DRAWINGS.video}
          sizes="(min-width: 1280px) 1200px, calc(100vw - 3rem)"
        />
      </Chapter>

      <Chapter label={t("why.label")} title={t("why.title")}>
        <div className="max-w-[64ch]">
          {REASONS.map((key) => (
            <div className="border-t border-rule py-5 first:border-t-0 first:pt-0" key={key}>
              <h3 className="type-title">{t(`why.reasons.${key}.title`)}</h3>
              <p className="type-body mt-1">{t(`why.reasons.${key}.copy`)}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <section className="border-t border-rule">
        <div className="section-shell py-16 sm:py-20">
          <h2 className="type-heading">{t("close.title")}</h2>
          <p className="type-body-lg mt-4">{t("close.scope")}</p>
          <Link className={tactileButtonClasses("secondary", "mt-8")} href="/" locale={locale}>
            <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
            {grid("backToGrid")}
          </Link>
        </div>
      </section>
    </main>
  );
}

/** One section: a rule, a label, the claim, an optional lede, then the content. */
function Chapter({ label, title, lede, children }: { label: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule">
      <div className="section-shell py-16 sm:py-20">
        <p className="type-section-label">{label}</p>
        <h2 className="type-heading mt-3 max-w-[30ch] text-balance">{title}</h2>
        {lede ? <p className="type-body-lg mt-4">{lede}</p> : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
