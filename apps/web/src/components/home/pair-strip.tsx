import { PairMark } from "@/components/site/pair-mark";

/** Keep the ribbon outside the hero's measured shader subtree. */
export function PairStrip({
  label,
  pairs,
}: {
  label: string;
  pairs: readonly { name: string; pair: string; href: string }[];
}) {
  return (
    <nav aria-label={label} className="pair-ribbon">
      <div className="section-shell py-5 sm:py-6">
        <div className="pair-ribbon-links" data-ground-quiet="">
          <span className="type-meta">{label}</span>
          {pairs.map(({ name, pair, href }) => (
            // The name comes first so the link's accessible name starts with
            // it; the mark's own label supplies the pair after it.
            <a className="pair-ribbon-link" href={href} key={href}>
              <span className="pair-ribbon-name type-meta">{name}</span>
              <PairMark pair={pair} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
