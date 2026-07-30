import { getTranslations } from "next-intl/server";

/**
 * The three status labels Polis puts on its own surfaces. The bracketed labels
 * are literals from the Polis documentation and stay as they are written there;
 * only the gloss beside each one is translated.
 */
const LABELS = ["[verifiable]", "[demonstration/stub]", "[not yet live]"] as const;

export async function LabelTaxonomy({ className = "" }: { className?: string }) {
  const t = await getTranslations("WorkPolis.honesty");
  const glosses = t.raw("labels") as string[];

  return (
    <dl className={`divide-y divide-rule border-y border-rule ${className}`}>
      {LABELS.map((label, index) => (
        <div className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[13rem_1fr] sm:items-baseline" key={label}>
          <dt>
            <span className="type-artifact inline-flex rounded-full border border-rule px-3 py-1">
              {label}
            </span>
          </dt>
          <dd className="type-body-sm">{glosses[index]}</dd>
        </div>
      ))}
    </dl>
  );
}
