import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";

export type LiveSite = {
  /** Matches the capture filenames under `/proof/sites/<slug>-desktop.png`. */
  slug: string;
  name: string;
  /** Town the business operates in. */
  place: string;
  /** What the business does, in two or three words. */
  kind: string;
  /** One line. Say something verified about the build, not adjectives. */
  description: string;
  /** Describes the desktop capture: what the page shows, not that it is a screenshot. */
  alt: string;
  /** The live URL. Opens in a new tab. */
  url: string;
};

function displayHost(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function LiveSiteRow({
  site,
  index,
  liveLabel,
}: {
  site: LiveSite;
  index: number;
  /** Reads "Live · <town>". Built by the caller so the separator stays translatable. */
  liveLabel: string;
}) {
  const isFirst = index === 0;
  const isReversed = index % 2 === 1;

  return (
    <article
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
        isFirst ? "pb-12 sm:pb-16" : "border-t border-rule py-12 sm:py-16"
      }`}
    >
      <FadeIn className={isReversed ? "lg:order-2" : undefined}>
        <a
          className="group relative block rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          href={site.url}
          rel="noreferrer"
          target="_blank"
        >
          <div className="rounded-[var(--radius-lg)] border border-rule bg-card p-2 shadow-[var(--shadow-elevated)] transition-colors group-hover:border-ink/25 sm:p-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)]">
              <Image
                alt={site.alt}
                className="object-cover object-top"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 34rem, (min-width: 640px) 88vw, 92vw"
                src={`/proof/sites/${site.slug}-desktop.png`}
              />
            </div>
          </div>

          <div className="absolute -bottom-6 right-5 w-[18%] min-w-[4.75rem] max-w-[6.75rem] rounded-[var(--radius-md)] border border-rule bg-card p-1.5 shadow-[var(--shadow-elevated)] sm:right-8">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[var(--radius-md)]">
              <Image
                alt=""
                className="object-cover object-top"
                fill
                sizes="7rem"
                src={`/proof/sites/${site.slug}-mobile.png`}
              />
            </div>
          </div>
        </a>
      </FadeIn>

      <FadeIn className={isReversed ? "lg:order-1" : undefined} delay={90}>
        <p className="type-meta flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          {liveLabel}
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">{site.name}</h3>
        <p className="type-meta mt-2">{site.kind}</p>
        <p className="type-body mt-4 max-w-md">{site.description}</p>
        <a
          className="mt-6 inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          href={site.url}
          rel="noreferrer"
          target="_blank"
        >
          {displayHost(site.url)}
          <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </FadeIn>
    </article>
  );
}
