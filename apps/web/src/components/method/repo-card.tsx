import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import { AOC_REPO_URL } from "@/lib/site/config";

export type RepoCardProps = {
  /** Small label above the path. */
  label: string;
  /** One line about what a reader will find there. */
  summary: string;
  /** Short chips — licence, language, surface. Keep to three. */
  chips?: readonly string[];
  className?: string;
};

/**
 * The public repository, printed like a record card: the path you can type into
 * a browser, and the reason to.
 */
export function RepoCard({ label, summary, chips, className = "" }: RepoCardProps) {
  return (
    <a
      className={`artifact-card group block rounded-[var(--radius-lg)] p-6 transition-colors hover:border-ink/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:p-7 ${className}`}
      href={AOC_REPO_URL}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <IconBrandGithub aria-hidden="true" className="h-5 w-5 text-ink" stroke={1.75} />
          <p className="type-section-label">{label}</p>
        </div>
        <IconArrowUpRight
          aria-hidden="true"
          className="h-5 w-5 text-ink-muted transition-colors group-hover:text-ink"
          stroke={1.75}
        />
      </div>

      <p className="mt-5 break-words font-mono text-base font-medium tracking-[-.01em] text-ink sm:text-lg">
        github.com/basicalex/agent-ops-cockpit
      </p>

      <p className="type-body mt-4 text-sm leading-6">{summary}</p>

      {chips?.length ? (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-rule pt-6">
          {chips.map((chip) => (
            <span
              className="rounded-full border border-rule bg-white/72 px-3 py-1 text-xs font-semibold text-ink-muted"
              key={chip}
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </a>
  );
}
