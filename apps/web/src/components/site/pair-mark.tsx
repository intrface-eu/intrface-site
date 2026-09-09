/**
 * The two sides a product sits between, drawn instead of punctuated.
 *
 * Every canonical product line carries a pair — "visitor ↔ place" — and the
 * pair is the argument, not a footnote after it. Set as two words joined by a
 * hairline with a solid accent node at the midpoint, it reads as the site's
 * own illustration language (nodes, hairline connectors) rather than as a mono
 * caption. Not a pill, not a card.
 *
 * The string arrives from the messages file character-for-character. If it
 * does not split on the arrow — a locale that punctuates the pair differently
 * — it renders unchanged rather than losing half of itself.
 */
export function PairMark({ className = "", pair }: { className?: string; pair: string }) {
  const sides = pair.split("↔");

  if (sides.length !== 2) {
    return <span className={`type-artifact ${className}`}>{pair}</span>;
  }

  const [left, right] = sides.map((side) => side.trim());

  return (
    // The mark replaces the glyph with a rule, so the label carries the whole
    // pair for a screen reader — the same string that used to be the text.
    <span aria-label={pair} className={`pair-mark ${className}`} role="img">
      <span className="type-artifact">{left}</span>
      <span aria-hidden="true" className="pair-mark__link" />
      <span className="type-artifact">{right}</span>
    </span>
  );
}
