import { SystemLedger } from "@intrface/web";

export const OurOwnSoftware = () => (
  <div className="tone-ink px-6 py-10">
    <SystemLedger
      systems={[
        {
          name: "Voyager",
          status: "Pre-launch",
          claim: "One QR code gives a restaurant a multilingual AI host grounded in its own menu and hours.",
          spec: ["6 languages", "7 surfaces, 1 data model", "Multi-tenant"],
          href: "/work/voyager",
          linkLabel: "Read the Voyager case",
        },
        {
          name: "Polis Interface",
          status: "Pre-deployment",
          claim: "A governance graph where every public claim traces back to a source document.",
          spec: ["Open source", "Every claim checkable", "Nothing self-reported"],
          href: "/work/polis",
          linkLabel: "Read the Polis case",
        },
        {
          name: "Funda",
          status: "In build",
          claim: "Matches organisations to the EU funding calls they can actually win, read as they publish.",
          spec: ["4 roles", "3 languages", "EU funding sources"],
          href: "/work/funda",
          linkLabel: "Read the Funda case",
        },
      ]}
    />
  </div>
);
