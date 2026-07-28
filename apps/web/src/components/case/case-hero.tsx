import { FadeIn } from "@/components/site/fade-in";

export type CaseStatusTone = "neutral" | "accent";

export type CaseHeroProps = {
  /** Small label above the name, e.g. "Place intelligence". */
  eyebrow?: string;
  /** The system name. Rendered as the page h1. */
  name: string;
  /** One line. What the system does, in plain words. */
  claim: string;
  /** Honest status label, e.g. "Pre-launch", "Open source", "Live". */
  status: string;
  /** `accent` marks something running in the world; `neutral` marks everything else. */
  statusTone?: CaseStatusTone;
  /** Short descriptors — stack, domain, licence. Keep to five or fewer. */
  tags?: readonly string[];
  className?: string;
};

export function CaseHero({
  eyebrow,
  name,
  claim,
  status,
  statusTone = "neutral",
  tags,
  className = "",
}: CaseHeroProps) {
  return (
    <section className={`border-b border-rule tone-paper ${className}`}>
      <div className="section-shell py-20 sm:py-28">
        {eyebrow ? (
          <FadeIn>
            <p className="type-section-label">{eyebrow}</p>
          </FadeIn>
        ) : null}

        <FadeIn delay={eyebrow ? 80 : 0}>
          <h1 className="type-display mt-6">{name}</h1>
        </FadeIn>

        <FadeIn delay={160}>
          <p className="type-body-lg mt-7 font-medium">{claim}</p>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-white/72 px-3.5 py-1.5">
              <span
                aria-hidden="true"
                className={
                  statusTone === "accent"
                    ? "h-1.5 w-1.5 rounded-full bg-accent"
                    : "h-1.5 w-1.5 rounded-full border border-ink-muted"
                }
              />
              <span className="type-caption">{status}</span>
            </span>

            {tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-ink/8 px-3 py-1.5 text-xs font-semibold text-ink">
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
