import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { EvidenceFrame } from "@/components/case";
import { FadeIn } from "@/components/site/fade-in";

export type SiteEntry = {
  /** Business name as it appears on the live site. */
  name: string;
  /** Town, and the region if it helps. */
  place: string;
  /** One line. What the business does. */
  line: string;
  /** Language codes in the order the site offers them. */
  languages: readonly string[];
  /** What we built into the markup: "LocalBusiness JSON-LD", "hreflang". */
  notes: readonly string[];
  /** Live URL, including protocol. */
  href: string;
  /** How the URL should read on the page. */
  hrefLabel: string;
  desktop: { src: string; alt: string };
  mobile: { src: string; alt: string };
};

/**
 * One live site: the desktop capture at size, the phone capture beside it,
 * and the facts in a column. Sides alternate down the page.
 */
export async function SiteShowcase({
  site,
  index,
  priority = false,
}: {
  site: SiteEntry;
  index: number;
  priority?: boolean;
}) {
  const t = await getTranslations("WorkClientSites.showcase");
  const mediaFirst = index % 2 === 0;

  // The template flips with the order so the captures keep one width down the
  // page instead of shrinking on every second row.
  return (
    <article
      className={`grid gap-10 py-14 first:pt-0 lg:items-center lg:gap-14 lg:py-20 ${
        mediaFirst
          ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
          : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
      }`}
    >
      <FadeIn className={mediaFirst ? "lg:order-1" : "lg:order-2"}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:gap-5">
          <EvidenceFrame
            alt={site.desktop.alt}
            aspect="16/10"
            href={site.href}
            priority={priority}
            sizes="(min-width: 1024px) 38rem, (min-width: 640px) 78vw, 74vw"
            src={site.desktop.src}
          />

          <div className="w-[86px] overflow-hidden rounded-[var(--radius-md)] border border-rule bg-card p-1.5 shadow-[var(--shadow-elevated)] sm:w-[118px] sm:p-2">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[.7rem]">
              <Image
                alt={site.mobile.alt}
                className="object-cover object-top"
                fill
                sizes="(min-width: 640px) 118px, 86px"
                src={site.mobile.src}
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn className={mediaFirst ? "lg:order-2" : "lg:order-1"} delay={80}>
        <p className="type-section-label">{site.place}</p>

        <h3 className="type-subheading mt-4">{site.name}</h3>

        <p className="type-body mt-4 max-w-md">{site.line}</p>

        <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <dt className="type-meta">{t("languagesLabel")}</dt>
            <dd className="type-data mt-2 text-sm font-semibold tracking-[.06em]">
              {site.languages.join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="type-meta">{t("markupLabel")}</dt>
            <dd className="type-body-sm mt-2 leading-6">{site.notes.join(", ")}</dd>
          </div>
        </dl>

        <a
          className="mt-8 inline-flex items-center gap-2 border-b border-accent/40 pb-1 font-mono text-sm font-semibold text-accent transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
          href={site.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {site.hrefLabel}
          <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </FadeIn>
    </article>
  );
}
