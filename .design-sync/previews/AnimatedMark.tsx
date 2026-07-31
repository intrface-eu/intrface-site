import { AnimatedMark } from "@intrface/web";

export const InTheHeader = () => (
  <span className="flex items-center gap-3 text-ink">
    <AnimatedMark size={26} />
    <span className="text-xl font-medium tracking-[-0.04em]">intrface</span>
  </span>
);

export const Large = () => <AnimatedMark className="text-ink" size={72} />;

export const Static = () => <AnimatedMark animate={false} className="text-accent" size={48} />;
