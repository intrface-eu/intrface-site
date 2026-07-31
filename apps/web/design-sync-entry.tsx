/**
 * The design-system entry for the Claude Design sync.
 *
 * The site has no library package — its components live in the Next app — so
 * this file is the list of what counts as the design system: every component
 * that renders from props alone. The page shells and copy-bound pieces are not
 * here on purpose; they read their text from next-intl and cannot render
 * outside a locale request.
 *
 * It lives here rather than under .design-sync/ because the converter reads
 * the package identity from the nearest package.json above the entry — from
 * the repo root it would sync the workspace, not this app.
 *
 * Generated once by the sync and committed. Add a component here when it
 * becomes reusable.
 */


// Must come first: it defines the `process` global that `@/lib/site/config`
// reads while these modules evaluate. Without it the bundle throws on load
// and every export is lost.
import "../../.design-sync/shims/process-env";

export { AnimatedMark } from "./src/components/site/animated-mark";
export { AudienceLedger } from "./src/components/work/voyager/audience-ledger";
export { CaseHero } from "./src/components/case/case-hero";
export { CaseSection } from "./src/components/case/case-section";
export { ContractLedger } from "./src/components/method/contract-ledger";
export { EngineeringLedger } from "./src/components/work/voyager/engineering-ledger";
export { FactLedger } from "./src/components/about/fact-ledger";
export { FadeIn } from "./src/components/site/fade-in";
export { HeroHalftone } from "./src/components/visual/hero-halftone";
export { HeroProof } from "./src/components/home/hero-proof";
export { LiveSiteRow } from "./src/components/home/live-site-row";
export { MatchFlow } from "./src/components/work/funda/match-flow";
export { MobileNav } from "./src/components/site/mobile-nav";
export { MobileShot } from "./src/components/work/voyager/mobile-shot";
export { OperatingRule } from "./src/components/method/operating-rule";
export { PilotSeed } from "./src/components/work/voyager/pilot-seed";
export { PipelineSteps } from "./src/components/work/client-sites/pipeline-steps";
export { PortfolioLedger } from "./src/components/work/index/portfolio-ledger";
export { ProcessSteps } from "./src/components/site/process-steps";
export { RepoCard } from "./src/components/method/repo-card";
export { SiteNav } from "./src/components/site/site-nav";
export { StatBand } from "./src/components/case/stat-band";
export { SystemLedger } from "./src/components/home/system-ledger";
export { TactileButton } from "./src/components/site/tactile-button";
