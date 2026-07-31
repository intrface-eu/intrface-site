import { HeroHalftone } from "@intrface/web";

/**
 * The screen is an absolutely-positioned layer, so it needs a sized, relatively
 * positioned band to fill — the same shape the hero gives it. It draws its own
 * mask: nothing across the type column, solid at the trim edge.
 */
export const BehindAHero = () => (
  <section className="relative isolate min-h-[420px] overflow-hidden border-y border-rule bg-paper">
    <HeroHalftone />
    <div className="relative px-8 py-16">
      <p className="type-section-label">Intrface · Istria, Croatia</p>
      <h1 className="type-display mt-4">We build the software. And the system that builds the software.</h1>
      <p className="type-body-lg mt-6 max-w-md font-medium">
        One live client site in Vrsar, and three systems of our own still pre-launch.
      </p>
    </div>
  </section>
);
