import { FadeIn } from "@/components/site/fade-in";

export type PipelineStep = {
  /** The verb of the stage. Two or three words. */
  name: string;
  /** One or two lines. What actually happens. */
  body: string;
};

/**
 * The delivery pipeline as a numbered run of steps on a hairline spine.
 * Reads top-to-bottom on a phone, two columns on a wide screen.
 */
export function PipelineSteps({ steps }: { steps: readonly PipelineStep[] }) {
  return (
    <ol className="grid gap-x-14 gap-y-0 sm:grid-cols-2">
      {steps.map((step, index) => (
        <FadeIn delay={index * 70} key={step.name}>
          <li className="border-t border-rule py-6">
            <div className="flex items-baseline gap-4">
              <span className="type-data text-sm font-semibold text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-title">{step.name}</h3>
            </div>
            <p className="type-body-sm mt-3 pl-8">{step.body}</p>
          </li>
        </FadeIn>
      ))}
    </ol>
  );
}
