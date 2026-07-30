import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

export type EvidenceAspect = "16/10" | "16/9" | "4/3" | "3/2" | "1/1";

/** One image file cut out of a full capture, with the size it was cut at. */
export type EvidenceCropImage = {
  /** Path under `/proof/<slug>/` of the cut file. */
  src: string;
  /** Intrinsic pixels of that file. The frame takes exactly this ratio, so the
   *  browser never re-crops or letterboxes a region the cut already chose. */
  width: number;
  height: number;
  /** Overrides `alt` when this cut shows something different from the wide one. */
  alt?: string;
};

/**
 * A readable detail, shown instead of the whole capture.
 *
 * A 1440px page or a 4K terminal shrunk into a 550px plate is a texture, not
 * evidence. The fix is not a bigger frame — it is a smaller region. Cut the
 * part that carries the argument out of the original at native resolution and
 * show *that*, at a scale where the words are words.
 *
 * Two rules for choosing a cut:
 *
 * 1. Size it from the column it lands in. Rendered scale is
 *    `columnWidth / crop.width`; a 4x-DPR capture reads well at roughly 0.40–0.55.
 *    Below `md` the plate is ~324px wide, so the same cut would fall to a tenth
 *    of that — which is why `narrow` exists: it shows *less*, not smaller.
 * 2. Cut on content, not on ratio. A detail that ends mid-list reads as a zoom;
 *    a detail padded out to 16/9 reads as another small screenshot.
 *
 * Both cuts are in the DOM and both are fetched; only the matching one is
 * displayed. That is the cost of art direction without `<picture>`, and it is
 * small — these files are tens of KB after the loader converts them.
 */
export type EvidenceCrop = EvidenceCropImage & {
  /** Tighter cut of the same subject, shown below `md` (48rem). */
  narrow?: EvidenceCropImage;
  /** Width hint for the wide cut. Give the loader the real column, not `100vw`. */
  sizes?: string;
  /** Width hint for the narrow cut. */
  narrowSizes?: string;
  /**
   * Show the full capture as a small inset over the detail, in the named
   * corner. Off by default: at inset size the full capture proves nothing, so
   * it earns its place only where the reader needs to know which part of what
   * they are looking at — and only in a corner the detail leaves empty.
   */
  context?: "top-right" | "bottom-right";
};

export type EvidenceFrameProps = {
  /**
   * Path under `/proof/<slug>/` of the full capture. With `crop` set this is
   * demoted to the context inset and is not required. Leave both unset and the
   * frame shows a labelled placeholder.
   */
  src?: string;
  /** Describe what the screenshot shows, not that it is a screenshot. */
  alt: string;
  /** Shape of the frame. Ignored when `crop` is set — the cut carries its own. */
  aspect?: EvidenceAspect;
  /** A readable detail to show in place of the full capture. */
  crop?: EvidenceCrop;
  /** Small label above the frame, e.g. "Tourist board console". */
  label?: string;
  /** One line under the frame. What the reader should notice. */
  caption?: string;
  /** Links the frame out — a live site, a public repo. */
  href?: string;
  /** Text shown when there is no image. Defaults to the shared placeholder copy. */
  placeholder?: string;
  /** Set on the one frame above the fold. */
  priority?: boolean;
  /** Responsive width hint for the image loader. */
  sizes?: string;
  className?: string;
};

export async function EvidenceFrame({
  src,
  alt,
  aspect = "16/10",
  crop,
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

  /** The image plane. Same rounding in every variant, so the frame is one shape. */
  const plane = (child: React.ReactNode, ratio: string, visibility = "") => (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-md)] ${visibility}`}
      style={{ aspectRatio: ratio }}
    >
      {child}
    </div>
  );

  let body: React.ReactNode;

  if (crop) {
    const wide = (
      <Image
        alt={crop.alt ?? alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={crop.sizes ?? sizes}
        src={crop.src}
      />
    );

    body = (
      <>
        {crop.narrow
          ? plane(
              <Image
                alt={crop.narrow.alt ?? crop.alt ?? alt}
                className="object-cover"
                fill
                priority={priority}
                sizes={crop.narrowSizes ?? "100vw"}
                src={crop.narrow.src}
              />,
              `${crop.narrow.width} / ${crop.narrow.height}`,
              "md:hidden",
            )
          : null}
        {plane(wide, `${crop.width} / ${crop.height}`, crop.narrow ? "hidden md:block" : "")}
      </>
    );
  } else if (src) {
    body = plane(
      <Image alt={alt} className="object-cover" fill priority={priority} sizes={sizes} src={src} />,
      aspect.replace("/", " / "),
    );
  } else {
    body = plane(
      <div className="flex h-full w-full items-center justify-center border border-rule bg-paper-raised">
        <p className="type-caption">{placeholderText}</p>
      </div>,
      aspect.replace("/", " / "),
    );
  }

  const frame = (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-card p-2 shadow-[var(--shadow-elevated)] sm:p-3 ${
        href ? "transition-colors group-hover:border-ink/25" : ""
      }`}
    >
      {body}

      {/* Orientation only: which part of which screen the detail was cut from.
          Decorative alt — at this size it carries no information the detail
          above it does not already carry, and the caption names the screen. */}
      {crop?.context && src ? (
        <div
          className={`pointer-events-none absolute right-5 hidden w-[19%] max-w-[9rem] overflow-hidden rounded-[calc(var(--radius-md)/2)] border border-rule bg-card p-[3px] shadow-[var(--shadow-elevated)] sm:block ${
            crop.context === "top-right" ? "top-5" : "bottom-5"
          }`}
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(var(--radius-md)/3)]">
            <Image alt="" className="object-cover" fill sizes="9rem" src={src} />
          </div>
        </div>
      ) : null}
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
