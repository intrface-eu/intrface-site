import { CaseHero } from "@intrface/web";

export const PreLaunch = () => (
  <CaseHero
    claim="One QR code gives a restaurant a multilingual AI host grounded in its own menu and hours."
    eyebrow="Place intelligence"
    name="Voyager"
    status="Pre-launch"
    tags={["Proprietary", "Tourism", "Multi-tenant", "Six languages"]}
  />
);

export const Live = () => (
  <CaseHero
    claim="A bilingual site for a wine bar on the Vrsar waterfront, built from the client's own Instagram profile."
    eyebrow="Client work"
    name="Istria client sites"
    status="Live"
    statusTone="accent"
    tags={["Croatian first", "Bilingual", "Their own domain"]}
  />
);

export const OpenSource = () => (
  <CaseHero
    claim="A governance graph where every public claim traces back to a source document."
    eyebrow="Civic infrastructure"
    name="Polis Interface"
    status="Open source · pre-deployment"
    tags={["Public data", "Checkable claims", "Nothing self-reported"]}
  />
);
