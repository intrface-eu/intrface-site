import Image from "next/image";

export type MobileShotProps = {
  /** Path under `/proof/voyager/`. Expects a 390×844 capture. */
  src: string;
  /** Describe what the screen shows, not that it is a screenshot. */
  alt: string;
  /** Small label above the frame. */
  label?: string;
  /** One line under the frame. */
  caption?: string;
  className?: string;
};

/**
 * A phone-shaped evidence frame. `EvidenceFrame` crops to landscape aspects,
 * which would cut a 390×844 capture in half — this keeps the whole screen.
 */
export function MobileShot({ src, alt, label, caption, className = "" }: MobileShotProps) {
  return (
    <figure className={className}>
      {label ? <p className="type-section-label mb-3">{label}</p> : null}

      <div className="mx-auto w-full max-w-[18rem] rounded-[var(--radius-xl)] border border-rule bg-card p-2 shadow-[var(--shadow-elevated)]">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[var(--radius-lg)]">
          <Image alt={alt} className="object-cover object-top" fill sizes="(min-width: 1024px) 18rem, 70vw" src={src} />
        </div>
      </div>

      {caption ? (
        <figcaption className="type-body mt-4 text-sm leading-6">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
