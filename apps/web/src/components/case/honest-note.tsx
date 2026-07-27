import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export type HonestNoteProps = {
  /** What kind of caveat this is. Keep it short. Defaults to the shared label. */
  label?: string;
  /**
   * State what is not true yet, in the same plain words as the rest of the page:
   * "pre-launch", "no real end users", "the pilot is simulated".
   */
  children: ReactNode;
  className?: string;
};

/**
 * A quiet aside for honest status. Say the unflattering thing here rather than
 * softening a claim elsewhere on the page.
 */
export async function HonestNote({ label, children, className = "" }: HonestNoteProps) {
  const t = await getTranslations("Common");

  return (
    <aside className={`border-l-2 border-l-accent pl-5 ${className}`}>
      <p className="type-section-label">{label ?? t("honestStatus")}</p>
      <div className="type-body mt-3 max-w-2xl text-sm leading-6">{children}</div>
    </aside>
  );
}
