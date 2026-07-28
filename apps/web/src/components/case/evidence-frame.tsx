import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

export type EvidenceAspect = "16/10" | "16/9" | "4/3" | "3/2" | "1/1";

export type EvidenceFrameProps = {
  /** Path under `/proof/<slug>/`. Leave unset and the frame shows a labelled placeholder. */
  src?: string;
  /** Describe what the screenshot shows, not that it is a screenshot. */
  alt: string;
  /** Shape of the frame. Also sizes the placeholder. */
  aspect?: EvidenceAspect;
  /** Small label above the frame, e.g. "Tourist board console". */
  label?: string;
  /** One line under the frame. What the reader should notice. */
  caption?: string;
  /** Links the frame out — a live site, a public repo. */
  href?: string;
  /** Text shown when `src` is missing. Defaults to the shared placeholder copy. */
  placeholder?: string;
  /** Set on the one frame above the fold. */
  priority?: boolean;
  /** Responsive width hint for the image loader. */
  sizes?: string;
  className?: string;
};

const aspectClasses: Record<EvidenceAspect, string> = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
};

export async function EvidenceFrame({
  src,
  alt,
  aspect = "16/10",
  label,
  caption,
  href,
  placeholder,
  priority = false,
  sizes = "(min-width: 1024px) 44rem, 100vw",
  className = "",
}: EvidenceFrameProps) {
  const t = await getTranslations("Common");
  const placeholderText = placeholder ?? t("screenshotPending");

  const frame = (
    <div
      className={`overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-card p-2 shadow-[var(--shadow-elevated)] sm:p-3 ${
        href ? "transition-colors group-hover:border-ink/25" : ""
      }`}
    >
      <div className={`relative overflow-hidden rounded-[var(--radius-md)] ${aspectClasses[aspect]}`}>
        {src ? (
          <Image alt={alt} className="object-cover" fill priority={priority} sizes={sizes} src={src} />
        ) : (
          <div className="flex h-full w-full items-center justify-center border border-rule bg-paper-raised">
            <p className="type-caption">{placeholderText}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <figure className={className}>
      {label ? <p className="type-section-label mb-3">{label}</p> : null}

      {href ? (
        <a
          className="group block rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {frame}
        </a>
      ) : (
        frame
      )}

      {caption ? (
        <figcaption className="type-body-sm mt-4">
          {caption}
          {href ? (
            <a
              className="ml-2 inline-flex items-center gap-1 font-semibold text-accent hover:underline"
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              {t("open")}
              <IconArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
