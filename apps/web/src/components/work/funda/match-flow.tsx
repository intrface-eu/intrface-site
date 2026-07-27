import { FadeIn } from "@/components/site/fade-in";

export type MatchStep = {
  /** One or two words. The verb of the stage. */
  name: string;
  /** One line, plain words. What happens here. */
  body: string;
};

/**
 * The matching path as four numbered stages with a hairline spine —
 * a diagram of the flow, not a grid of cards.
 */
export function MatchFlow({ steps }: { steps: readonly MatchStep[] }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute left-[.9375rem] top-3 bottom-3 w-px bg-rule sm:left-[1.1875rem]" />

      {steps.map((step, index) => (
        <FadeIn delay={index * 80} key={step.name}>
          <li className="relative flex gap-5 pb-9 last:pb-0 sm:gap-7">
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rule bg-card font-mono text-xs font-semibold tabular-nums sm:h-10 sm:w-10 sm:text-sm">
              {index + 1}
            </span>

            <div className="pt-1 sm:pt-2">
              <h3 className="text-lg font-semibold tracking-[-.03em]">{step.name}</h3>
              <p className="type-body mt-2 max-w-xl text-sm leading-6">{step.body}</p>
            </div>
          </li>
        </FadeIn>
      ))}
    </ol>
  );
}
