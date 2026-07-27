import type { ReactNode } from "react";
import { FadeIn } from "@/components/site/fade-in";

export type CaseTone = "paper" | "raised" | "ink";

export type CaseSectionProps = {
  id?: string;
  /** Section label, e.g. "Engineering". */
  label?: string;
  /** Section heading. Always an h2 — case pages keep one h1. */
  title?: string;
  /** Lead paragraph under the heading. */
  intro?: string;
  /** Band this section sits on. Alternate them; do not run two of the same in a row. */
  tone?: CaseTone;
  /** Optional narrower right column, e.g. an HonestNote or a stat aside. */
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const toneClasses: Record<CaseTone, string> = {
  paper: "tone-paper border-b border-rule",
  raised: "tone-raised border-b border-rule",
  ink: "tone-ink border-y border-rule",
};

export function CaseSection({
  id,
  label,
  title,
  intro,
  tone = "paper",
  aside,
  children,
  className = "",
}: CaseSectionProps) {
  const hasHeader = Boolean(label || title || intro);

  return (
    <section className={`scroll-mt-24 ${toneClasses[tone]} ${className}`} id={id}>
      <div className="section-shell py-20 sm:py-28">
        {hasHeader ? (
          <div className="max-w-3xl">
            {label ? (
              <FadeIn>
                <p className="type-section-label">{label}</p>
              </FadeIn>
            ) : null}
            {title ? (
              <FadeIn delay={80}>
                <h2 className="type-heading mt-4">{title}</h2>
              </FadeIn>
            ) : null}
            {intro ? (
              <FadeIn delay={160}>
                <p className="type-body-lg mt-5">{intro}</p>
              </FadeIn>
            ) : null}
          </div>
        ) : null}

        {children || aside ? (
          aside ? (
            <div className={`grid gap-10 lg:grid-cols-[1fr_.82fr] lg:items-start ${hasHeader ? "mt-12" : ""}`}>
              <div>{children}</div>
              <div>{aside}</div>
            </div>
          ) : (
            <div className={hasHeader ? "mt-12" : ""}>{children}</div>
          )
        ) : null}
      </div>
    </section>
  );
}
