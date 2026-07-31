import { FadeIn } from "@intrface/web";

export const Staggered = () => (
  <div>
    <FadeIn>
      <p className="type-section-label">Method</p>
    </FadeIn>
    <FadeIn delay={80}>
      <h2 className="type-heading mt-4">How we work is written down.</h2>
    </FadeIn>
    <FadeIn delay={160}>
      <p className="type-body mt-5">
        Thirteen projects run under the same written rules. Agents propose the change; a person reads
        it and signs off before it lands.
      </p>
    </FadeIn>
  </div>
);
