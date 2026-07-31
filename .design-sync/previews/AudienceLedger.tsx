import { AudienceLedger } from "@intrface/web";

/** Icons arrive as components; a bare SVG keeps the preview off the icon barrel. */
const Dot = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
  </svg>
);

const Square = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
    <rect height="12" rx="2" width="12" x="6" y="6" />
  </svg>
);

const Ring = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="7" />
  </svg>
);

export const WhoItServes = () => (
  <AudienceLedger
    rows={[
      { role: "The guest", icon: Dot, line: "Asks in their own language and gets an answer from the menu in front of them." },
      { role: "The business", icon: Square, line: "Sets its own hours, menu and tone, and sees what still blocks public chat." },
      { role: "The tourist board", icon: Ring, line: "Publishes the official version of a place and edits it without filing a ticket." },
    ]}
  />
);
