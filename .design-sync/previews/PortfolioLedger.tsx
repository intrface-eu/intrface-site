import { PortfolioLedger } from "@intrface/web";

export const WorkIndex = () => (
  <PortfolioLedger
    entries={[
      {
        index: "01",
        name: "Voyager",
        href: "/work/voyager",
        status: "Pre-launch",
        claim: "One QR code gives a restaurant a multilingual AI host grounded in its own menu and hours.",
        figures: [
          { value: "6", label: "Languages a guest can ask in" },
          { value: "7", label: "Places the same answer appears" },
        ],
      },
      {
        index: "02",
        name: "Polis",
        href: "/work/polis",
        status: "Open source · pre-deployment",
        claim: "A governance graph where every public claim traces back to a source document.",
        figures: [
          { value: "6", label: "Steps from filed document to public check" },
          { value: "0", label: "Accounts needed to check one" },
        ],
      },
      {
        index: "03",
        name: "Istria client sites",
        href: "/work/client-sites",
        status: "Live",
        live: true,
        claim: "A bilingual site for a wine bar on the Vrsar waterfront, live at its own address.",
        figures: [
          { value: "1", label: "Site live today" },
          { value: "2", label: "Languages on the live site" },
        ],
      },
    ]}
  />
);
