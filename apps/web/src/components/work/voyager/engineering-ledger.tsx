import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/site/fade-in";

export type EngineeringEntry = {
  /** Short name for the decision. */
  title: string;
  /** What was built, in one or two concrete sentences. */
  what: string;
  /** Why a buyer should care. One plain sentence, no engineering vanity. */
  why: string;
};

/**
 * A numbered ledger of engineering decisions, each paired with the reason it
 * matters. Sits on the ink band, so it inherits the inverse text floors.
 */
export async function EngineeringLedger({
  entries,
  className = "",
}: {
  entries: readonly EngineeringEntry[];
  className?: string;
}) {
  const t = await getTranslations("Common");

  return (
    <div className={`divide-y divide-rule border-y border-rule ${className}`}>
      {entries.map((entry, index) => (
        <FadeIn
          className="grid gap-6 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14"
          delay={index * 80}
          key={entry.title}
        >
          <div>
            <span className="type-meta font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-xl font-semibold tracking-[-.035em]">{entry.title}</h3>
            <p className="type-body mt-4 max-w-2xl">{entry.what}</p>
          </div>

          <div className="border-l-2 border-l-accent pl-6 lg:mt-14">
            <p className="type-section-label">{t("whyItMatters")}</p>
            <p className="type-body mt-3 max-w-xl">{entry.why}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
