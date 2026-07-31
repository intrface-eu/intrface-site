import { StatBand } from "@intrface/web";

/** The numbers a buyer weighs — not lines of code. */
const CLIENT_SITES = [
  { value: "1", label: "Site live today", note: "Handed over, public, and linked" },
  { value: "6", label: "Steps from profile to URL", note: "Step five audits every page" },
  { value: "2", label: "Languages on the live site", note: "Croatian first" },
];

const POLIS = [
  { value: "6", label: "Steps from filed document to public check" },
  { value: "10", label: "Rules deciding who sees what", note: "In doubt, denied." },
  { value: "0", label: "Accounts needed to check a claim" },
  { value: "0", label: "Public bodies running it today", note: "Pre-deployment." },
];

export const OnPaper = () => <StatBand stats={CLIENT_SITES} />;

export const OnInk = () => <StatBand columns={4} stats={POLIS} tone="ink" />;

export const TwoUp = () => (
  <StatBand
    columns={2}
    stats={[
      { value: "6", label: "Languages a guest can ask in", note: "Interface and answers." },
      { value: "7", label: "Places the same answer appears" },
    ]}
  />
);
