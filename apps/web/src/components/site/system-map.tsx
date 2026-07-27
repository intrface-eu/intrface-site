import { IconArrowDown } from "@tabler/icons-react";

export type SystemMapItem = {
  label: string;
  detail: string;
};

function StageLabel({ step, text }: { step: string; text: string }) {
  return (
    <p className="type-meta flex items-baseline gap-2 font-bold">
      <span className="font-mono text-accent">{step}</span>
      {text}
    </p>
  );
}

function Connector() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center py-1 text-ink-muted">
      <span className="h-4 w-px bg-[color-mix(in_srgb,var(--ink)_24%,transparent)]" />
      <IconArrowDown className="h-3.5 w-3.5 -mt-0.5" />
    </div>
  );
}

/**
 * The hero diagram. Its nodes are labels inside a figure, not document
 * headings — the page keeps one h1 and no orphan heading levels.
 */
export function SystemMap({
  inputs,
  core,
  output,
  ariaLabel,
  stages,
}: {
  inputs: readonly SystemMapItem[];
  core: SystemMapItem;
  output: SystemMapItem;
  /** Names the whole figure for assistive tech. */
  ariaLabel: string;
  /** The three stage labels down the diagram. */
  stages: { inputs: string; core: string; output: string };
}) {
  return (
    <figure
      aria-label={ariaLabel}
      className="interface-panel rounded-[var(--radius-xl)] p-5 text-ink sm:p-6"
    >
      <StageLabel step="01" text={stages.inputs} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {inputs.map((item) => (
          <div className="interface-node rounded-[var(--radius-md)] px-3.5 py-3" key={item.label}>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-sm leading-5 text-ink-muted">{item.detail}</p>
          </div>
        ))}
      </div>

      <Connector />

      <StageLabel step="02" text={stages.core} />
      <div className="interface-node mt-3 rounded-[var(--radius-md)] px-4 py-4" data-core="true">
        <p className="text-lg font-semibold">{core.label}</p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-inverse-muted)]">{core.detail}</p>
      </div>

      <Connector />

      <StageLabel step="03" text={stages.output} />
      <div className="interface-node mt-3 rounded-[var(--radius-md)] border-l-2 border-l-accent px-4 py-3.5">
        <p className="text-sm font-semibold">{output.label}</p>
        <p className="mt-1 text-sm leading-5 text-ink-muted">{output.detail}</p>
      </div>
    </figure>
  );
}
