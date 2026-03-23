import Image from "next/image";
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

        <header className="panel-surface sticky top-4 z-40 rounded-[24px] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3" aria-label="AOC home">
                <Image
                  src="/brand/intrface-icon.svg"
                  alt="Intrface icon"
                  width={26}
                  height={26}
                  priority
                />
                <span className="text-2xl font-medium tracking-[-0.04em] text-white">intrface</span>
                <span className="hidden text-sm text-[var(--muted)] sm:inline">/</span>
                <span className="rounded-full border border-[var(--panel-border-strong)] bg-[rgba(157,255,157,0.08)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
                  AOC
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <nav className="flex flex-wrap items-center gap-5 lg:gap-7">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm tracking-[-0.01em] text-[var(--muted)] transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-wrap gap-2 text-sm">
                <a
                  className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-black transition-opacity hover:opacity-90"
                  href="https://github.com/intrface-eu/agent-ops-cockpit"
                >
                  Repository
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-md border border-[var(--panel-border)] bg-transparent px-4 py-2 text-white transition-colors hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)]"
                  href="https://intrface.eu/en/aoc"
                >
                  Intrface preview
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-md border border-[var(--panel-border)] bg-transparent px-4 py-2 text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
