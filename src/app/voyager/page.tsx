import Link from "next/link";
import {
  voyagerAgents,
  voyagerAudience,
  voyagerLinks,
  voyagerMapLayer,
  voyagerOperations,
  voyagerProof,
  voyagerScoutPillars,
  voyagerStakeholders,
  voyagerTech,
} from "@/lib/site/voyager-content";

export default function VoyagerPage() {
  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-28">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">Flagship Product</p>
            <div className="space-y-4">
              <p className="type-meta">Voyager</p>
              <h1 className="type-display max-w-5xl">
                An AI-powered tourism platform built for destinations, businesses, and travelers.
              </h1>
            </div>
            <p className="type-body-lg max-w-3xl">
              Voyager combines multi-agent guidance, gamified exploration,
              multilingual content operations, and destination-scale platform
              infrastructure into one tourism system.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="#platform"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Explore Voyager
              </Link>
              <Link
                href="#architecture"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                Explore Platform Architecture
              </Link>
              <Link
                href={voyagerLinks.contact}
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                Discuss Partnership
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-b border-rule bg-panel scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">What Voyager Is</p>
              <h2 className="type-heading max-w-md">
                More than a travel app: a multi-tenant tourism platform with an exploration thesis.
              </h2>
              <p className="type-body max-w-lg">
                Voyager is built for a destination ecosystem, not only for end-user browsing.
                It connects agencies, businesses, attractions, and travelers in one platform where
                discovery, content, and AI assistance reinforce each other.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {voyagerAudience.map((item) => (
                <article key={item.title} className="rounded-2xl border border-rule bg-card p-6">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="type-body mt-3">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="type-section-label">Multi-Agent System</p>
            <h2 className="type-heading">
              Three domain-specific agents, each tied to a different tourism surface.
            </h2>
            <p className="type-body">
              Voyager’s agents are not generic chat wrappers. They are configured entities with
              their own role, knowledge, and route-aware context. Structured knowledge and RAG
              support the system behind the scenes.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {voyagerAgents.map((agent) => (
              <article key={agent.name} className="rounded-2xl border border-rule bg-card p-6">
                <p className="type-meta">{agent.persona} · {agent.domain}</p>
                <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground">
                  {agent.name}
                </h3>
                <p className="type-body mt-4">{agent.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Scout Experience</p>
              <h2 className="type-heading max-w-md">
                Travel as exploration, not just recommendation browsing.
              </h2>
              <p className="type-body max-w-lg">
                The Scout layer is one of Voyager’s clearest differentiators. It is built around
                discovery mechanics, location-aware interaction, and a device-like flow across map,
                compass, and camera modes.
              </p>
            </div>
            <div className="rounded-2xl border border-rule bg-foreground p-6 text-background">
              <p className="text-sm uppercase tracking-[0.18em] text-background/65">
                Exploration Pillars
              </p>
              <div className="mt-5 grid gap-3">
                {voyagerScoutPillars.map((pillar) => (
                  <div
                    key={pillar}
                    className="rounded-xl border border-background/12 bg-background/4 px-4 py-4 text-sm tracking-[-0.01em]"
                  >
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Map and Geospatial Layer</p>
              <h2 className="type-heading max-w-md">
                Discovery and navigation are native to the product model.
              </h2>
              <p className="type-body max-w-lg">
                Voyager treats geography as platform structure. Mapped entities,
                route-aware interactions, and unified map presets all contribute
                to a more contextual tourism experience.
              </p>
            </div>
            <div className="grid gap-3">
              {voyagerMapLayer.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Content and Operations</p>
              <h2 className="type-heading max-w-md">
                Multilingual content, ingestion pipelines, and role-aware platform control.
              </h2>
              <p className="type-body max-w-lg">
                Behind the user-facing exploration layer is a stronger operational system for tourism
                content, updates, and entity management across a destination ecosystem.
              </p>
            </div>
            <div className="grid gap-3">
              {voyagerOperations.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-rule bg-background px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Platform Structure</p>
              <h2 className="type-heading max-w-md">
                A stakeholder model designed for the full tourism stack.
              </h2>
              <p className="type-body max-w-lg">
                Voyager feels like a platform because it is organized around the relationships between
                multiple actors rather than a single user role.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {voyagerStakeholders.map((item) => (
                <article key={item} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="text-2xl font-medium tracking-[-0.03em] text-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Product Proof</p>
              <h2 className="type-heading max-w-md">
                Publicly legible signals from the implementation itself.
              </h2>
            </div>
            <div className="grid gap-4">
              {voyagerProof.map((item) => (
                <article key={item.label} className="rounded-2xl border border-rule bg-card p-6">
                  <p className="type-meta">{item.label}</p>
                  <p className="type-body mt-3">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Technical Architecture</p>
              <h2 className="type-heading max-w-md">
                A concise systems summary for technical evaluators.
              </h2>
              <p className="type-body max-w-lg">
                The stack supports a mix of real-time operations, multilingual UX,
                AI orchestration, and knowledge-aware retrieval without reducing the
                product to implementation detail.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {voyagerTech.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-rule bg-card px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">
                Final CTA
              </p>
              <h2 className="type-heading max-w-2xl text-background">
                Discuss destination deployment, partnership, or where Voyager fits in the wider Intrface portfolio.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">
                Voyager is best understood as a serious tourism platform with a distinct exploration layer,
                not as a generic travel interface. The next step is a real product conversation.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-start">
              <Link
                href={voyagerLinks.contact}
                className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                Get in Touch
              </Link>
              <Link
                href={voyagerLinks.projects}
                className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6"
              >
                Explore Intrface Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
