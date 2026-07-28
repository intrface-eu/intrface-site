import Image from "next/image";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { FadeIn } from "@/components/site/fade-in";
import { Link } from "@/i18n/navigation";

export type HeroArtifact = {
  /** Stable key; also the React key. */
  key: string;
  /** What the thing is called. One line at every width. */
  name: string;
  /** Where it actually stands — "Live", "Pre-launch", "Open source". */
  status: string;
  /** The link label under the plate. A host, a case, a repo. */
  meta: string;
  /** Describes what the capture shows, not that it is a screenshot. */
  alt: string;
  /** Path under /public. */
  src: string;
  /** Locale-less route for internal links, absolute URL for external ones. */
  href: string;
  external?: boolean;
  /** True for the plate that is visible first on a phone. */
  priority?: boolean;
};

/**
 * The hero evidence strip: three real captures, each one a link you can open
 * and check. Caption above the plate on a hairline — a contact sheet, not a
 * card grid.
 *
 * The plate keeps its own aspect box, so the images reserve their space before
 * they load and the first screen never shifts. Below `sm` the strip is a
 * snapping scroller rather than three unreadable thumbnails.
 */
export function HeroProof({
  artifacts,
  baseDelay = 0,
}: {
  artifacts: readonly HeroArtifact[];
  /** Stagger offset, so the strip reveals after the label above it. */
  baseDelay?: number;
}) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-5 overflow-x-auto px-6 pb-1 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
      {artifacts.map((artifact, index) => {
        const Arrow = artifact.external ? IconArrowUpRight : IconArrowRight;

        const body = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-title text-ink">{artifact.name}</span>
              <span className="type-meta shrink-0">{artifact.status}</span>
            </div>

            <div className="proof-plate-frame mt-3 overflow-hidden rounded-[var(--radius-md)]">
              <div className="relative aspect-[16/9]">
                <Image
                  alt={artifact.alt}
                  className="object-cover object-top"
                  fill
                  priority={artifact.priority}
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 30vw, 74vw"
                  src={artifact.src}
                />
              </div>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors group-hover:text-accent">
              {artifact.meta}
              <Arrow aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            </span>
          </>
        );

        const linkClass =
          "proof-plate group block rounded-[var(--radius-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

        return (
          <FadeIn
            className="w-[74vw] shrink-0 snap-start border-t border-rule pt-3 sm:w-auto"
            delay={baseDelay + index * 90}
            key={artifact.key}
          >
            {artifact.external ? (
              <a className={linkClass} href={artifact.href} rel="noreferrer" target="_blank">
                {body}
              </a>
            ) : (
              <Link className={linkClass} href={artifact.href}>
                {body}
              </Link>
            )}
          </FadeIn>
        );
      })}
    </div>
  );
}
