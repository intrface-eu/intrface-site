import { HeroProof } from "@intrface/web";

/**
 * The captures live in the site's public/ directory, which the bundle does not
 * carry — these point at the live site so the card shows the real plates.
 */
const BASE = "https://intrface.eu/proof";

export const ProofStrip = () => (
  <HeroProof
    artifacts={[
      {
        key: "velum",
        name: "Velum",
        status: "Live",
        meta: "velum-winebar.com",
        alt: "Velum home page — a café and wine bar on the Vrsar waterfront, in Croatian and English.",
        src: `${BASE}/sites/velum-desktop.png`,
        href: "https://velum-winebar.com",
        external: true,
      },
      {
        key: "voyager",
        name: "Voyager",
        status: "Pre-launch",
        meta: "Read the Voyager case",
        alt: "The official Vrsar tourist-board profile — a verification mark, dated notices and a register of places.",
        src: `${BASE}/voyager/voyager-tz-vrsar-profile.png`,
        href: "/work/voyager",
      },
    ]}
  />
);
