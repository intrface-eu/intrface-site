import Link from "next/link";
import { navItems } from "@/lib/site-content";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="panel-surface rounded-[20px] px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span className="status-pill rounded-full px-3 py-1 font-medium">workspace live</span>
              <span className="rounded-full border border-[var(--panel-border)] px-3 py-1">aoc.intrface.eu</span>
              <span className="rounded-full border border-[var(--panel-border)] px-3 py-1">terminal-first</span>
              <span className="rounded-full border border-[var(--panel-border)] px-3 py-1">local-first compatible</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
              <span>context / memory / tasks</span>
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
            </div>
          </div>
        </div>

        <header className="panel-surface rounded-[24px] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/" className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                Intrface / AOC
              </Link>
              <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Public product, learning, and consulting surface for serious agentic coding.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                AOC presents the way we actually build: terminal-native, continuity-aware, and grounded in the
                machine rather than browser-tab sprawl.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <nav className="flex flex-wrap gap-2 text-sm text-white/90">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-[var(--panel-border)] px-3 py-2 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-wrap gap-2 text-sm">
                <a
                  className="rounded-full bg-[var(--accent)] px-4 py-2 font-medium text-black"
                  href="https://github.com/intrface-eu/agent-ops-cockpit"
                >
                  Repository
                </a>
                <a
                  className="rounded-full border border-[var(--panel-border)] px-4 py-2 text-white"
                  href="mailto:hello@intrface.eu?subject=AOC"
                >
                  Talk to Intrface
                </a>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="panel-surface rounded-[24px] px-5 py-4 text-sm text-[var(--muted)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-white/92">AOC is built and used daily by Intrface as a terminal-native development environment.</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">operator workflow / lived system / no GUI clutter</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="rounded-full border border-[var(--panel-border)] px-3 py-2" href="https://github.com/intrface-eu/agent-ops-cockpit">Repository</a>
              <a className="rounded-full border border-[var(--panel-border)] px-3 py-2" href="https://intrface.eu/en/aoc">Intrface preview</a>
              <a className="rounded-full border border-[var(--panel-border)] px-3 py-2" href="mailto:hello@intrface.eu?subject=AOC">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function SectionCard({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="panel-surface rounded-[28px] p-6 sm:p-8">
      {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {body ? <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted)] sm:text-lg">{body}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
