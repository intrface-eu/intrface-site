import { IconArrowNarrowUp } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

/** Stage numbering and the mono artifact chip. Both are literals, not copy. */
const STAGES = [
  { step: "01", artifact: "minutes.pdf" },
  { step: "02", artifact: "sha256 9f3c…21ab" },
  { step: "03", artifact: "e-seal" },
  { step: "04", artifact: "TSA token" },
  { step: "05", artifact: "registry entry" },
  { step: "06", artifact: "verdict: valid" },
] as const;

/** Ledger identifiers and hashes. Literals from the running system's shape. */
const LEDGER = [
  { seq: "0140", event: "document.verified", prev: "6b81f4", self: "7d2e94" },
  { seq: "0141", event: "promise.linked", prev: "7d2e94", self: "4a17c0" },
  { seq: "0142", event: "promise.status.changed", prev: "4a17c0", self: "c95d3b" },
] as const;

type StageCopy = { name: string; detail: string };

function FlowArrow({ direction }: { direction: "right" | "down" }) {
  if (direction === "right") {
    return (
      <svg
        aria-hidden="true"
        className="absolute left-full top-1/2 hidden h-2 w-5 -translate-y-1/2 text-ink-muted lg:block"
        fill="none"
        viewBox="0 0 20 8"
      >
        <path d="M0 4h18M15 1l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="mx-auto my-1.5 h-5 w-2 text-ink-muted lg:hidden"
      fill="none"
      viewBox="0 0 8 20"
    >
      <path d="M4 0v18M1 15l3 3 3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The Polis trust pipeline: how a filed document becomes something a stranger can
 * check, and how the audit ledger chains each event to the one before it.
 * Diagram-only page — Polis is not deployed, so there is nothing to screenshot.
 */
export async function TrustPipelineDiagram({ className = "" }: { className?: string }) {
  const t = await getTranslations("WorkPolis.pipeline");
  const stageCopy = t.raw("stages") as StageCopy[];
  const ledgerCopy = t.raw("ledgerRows") as string[];

  return (
    <figure className={className}>
      <div className="interface-panel rounded-[var(--radius-xl)] p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="type-section-label">{t("title")}</h3>
          <p className="font-mono text-[0.8rem] text-ink-muted">{t("subtitle")}</p>
        </div>

        <ol className="mt-6 grid gap-5 lg:grid-cols-6">
          {STAGES.map((stage, index) => (
            <li className="relative flex flex-col" key={stage.step}>
              <div className="interface-node flex flex-1 flex-col rounded-[var(--radius-md)] px-4 py-4">
                <span className="font-mono text-[0.8rem] text-accent">{stage.step}</span>
                <h4 className="mt-2 text-base font-semibold tracking-[-.02em] text-ink">
                  {stageCopy[index]?.name}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-ink-muted">{stageCopy[index]?.detail}</p>
                <p className="mt-4 inline-flex self-start rounded-full border border-rule px-2.5 py-1 font-mono text-[0.8rem] text-ink-muted">
                  {stage.artifact}
                </p>
              </div>
              {index < STAGES.length - 1 ? (
                <>
                  <FlowArrow direction="right" />
                  <FlowArrow direction="down" />
                </>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-10 border-t border-rule pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="type-section-label">{t("ledgerTitle")}</h3>
            <p className="font-mono text-[0.8rem] text-ink-muted">{t("ledgerSubtitle")}</p>
          </div>

          <ol className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-rule bg-card/60">
            {LEDGER.map((row, index) => (
              <li
                className="grid gap-x-6 gap-y-3 border-b border-rule px-4 py-4 last:border-b-0 sm:grid-cols-[4.5rem_1fr_11rem] sm:items-baseline sm:px-5"
                key={row.seq}
              >
                <span className="font-mono text-[0.8rem] text-accent">#{row.seq}</span>
                <div>
                  <p className="font-mono text-[0.85rem] font-semibold text-ink">{row.event}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{ledgerCopy[index]}</p>
                </div>
                <div className="font-mono text-[0.8rem] sm:text-right">
                  <p className="flex items-center gap-1 text-ink-muted sm:justify-end">
                    {index > 0 ? (
                      <IconArrowNarrowUp aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                    ) : null}
                    prev <span className="text-accent">{row.prev}</span>
                  </p>
                  <p className="mt-1 text-ink">
                    self <span className="font-semibold">{row.self}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="type-body mt-5 max-w-3xl text-sm leading-6">{t("caption")}</figcaption>
    </figure>
  );
}
