import Link from "next/link";
import {
  capabilities,
  featuredProducts,
  operatingBlocks,
  proofItems,
} from "@/lib/site/homepage-content";

export default function Home() {
  return (
    <main>
      <section className="border-b border-rule bg-background">
        <div className="section-shell py-20 sm:py-24 lg:py-32">
          <div className="max-w-5xl space-y-8">
            <p className="type-section-label">Intrface</p>
            <h1 className="type-display max-w-5xl">
              We build AI-native platforms, products, and systems.
            </h1>
            <p className="type-body-lg max-w-3xl">
              Intrface is a product-led studio building serious software with a
              platform mindset. Our flagship work spans terminal-first AI
              tooling, tourism exploration systems, and funding workflow
              platforms.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                View Projects
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-md border border-rule bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-panel"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">What Intrface Does</p>
              <h2 className="type-heading max-w-md">
                Product clarity, system leverage, and AI that behaves like real
                infrastructure.
              </h2>
              <p className="type-body max-w-lg">
                We are not presenting disconnected experiments. The portfolio is
                built around durable workflow design, reusable architecture, and
                product surfaces that communicate value quickly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {operatingBlocks.map((block) => (
                <article
                  key={block.title}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">
                    {block.title}
                  </h3>
                  <p className="type-body mt-3">{block.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="border-b border-rule bg-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="type-section-label">Featured Products</p>
              <h2 className="type-heading max-w-2xl">
                Three flagship products. One portfolio shaped by shared system
                thinking.
              </h2>
            </div>
            <p className="type-body max-w-xl">
              AOC, Voyager, and Funda address different domains, but they all
              reflect the same approach: product truth first, strong workflow
              structure, and software built to carry operational complexity.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="flex h-full flex-col rounded-2xl border border-rule bg-card p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="type-meta">{product.status}</p>
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>
                <h3 className="mt-6 text-3xl font-medium tracking-[-0.04em] text-foreground">
                  {product.name}
                </h3>
                <p className="type-body mt-4 flex-1">{product.summary}</p>
                <Link
                  href={product.href}
                  className="mt-8 inline-flex text-sm font-medium text-accent hover:opacity-80"
                >
                  Explore {product.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-panel">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Shared Platform Capabilities</p>
              <h2 className="type-heading max-w-md">
                We translate technical depth into product capability.
              </h2>
              <p className="type-body max-w-lg">
                The portfolio spans different industries, but common platform
                muscles appear throughout the work: memory, orchestration,
                permissions, realtime interaction, and knowledge-aware user
                experience.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl border border-rule bg-background px-5 py-4 text-base tracking-[-0.02em] text-foreground"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-background">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <div className="space-y-4">
              <p className="type-section-label">Why Intrface</p>
              <h2 className="type-heading max-w-md">
                Not a collection of isolated apps — a coherent product and
                platform practice.
              </h2>
              <p className="type-body max-w-lg">
                What connects the work is a bias toward durable systems. We care
                about how products are operated, how information persists, how
                interfaces stay legible under complexity, and how infrastructure
                becomes a strategic advantage rather than hidden overhead.
              </p>
            </div>

            <div className="grid gap-4">
              {proofItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-rule bg-card p-6"
                >
                  <p className="type-meta">{item.label}</p>
                  <p className="type-body mt-3">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-foreground text-background scroll-mt-24">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-background/70">
                Final CTA
              </p>
              <h2 className="type-heading max-w-2xl text-background">
                Explore the portfolio, review the flagship products, or start a
                meaningful conversation.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-background/80">
                Intrface is building a public-facing product ecosystem around
                real work. If you want to talk about a product, a collaboration,
                or the systems underneath them, this is the right place to
                start.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-start">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                View Projects
              </Link>
              <Link
                href="mailto:hello@intrface.eu"
                className="inline-flex items-center justify-center rounded-md border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/6"
              >
                hello@intrface.eu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
