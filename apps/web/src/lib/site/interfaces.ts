import { PROJECTS, type ProjectKey } from "@/lib/site/projects";

/**
 * The home grid: eight cells, in DOM order, which is reading and tab order.
 * The grid in `globals.css` (`.interface-grid`) fills its columns in this
 * order, so it also reads left to right, top to bottom at every breakpoint.
 *
 * Every cell can open in place: its `hash` is the URL fragment that opens it
 * expanded over the grid (`/#voyager`, `/#midiflow`). `href` is the showcase
 * route a direct visit reaches; `liveUrl` the live site.
 *
 * Copy: a product reads its name and line from `HomeGrid.<slug>`; a client
 * site (`project`) takes its name from `PROJECTS` and its line from
 * `Projects.<key>.role`. Shell labels (Open, Close, Live site, The project)
 * come from `HomeGrid.common`.
 *
 * See docs/home-grid-contract.md.
 */

export type CellSlug =
  | "voyager"
  | "index"
  | "polis"
  | "midiflow"
  | "patchbay"
  | "funda"
  | "velum"
  | "astyleMarine";

export type InterfaceStatus = "live" | "comingSoon";

export type Tone = "paper" | "ink";

export type CellSpec = {
  slug: CellSlug;
  /** The cell's surface: `--paper-raised`, or `--ink` with `.tone-ink`. */
  tone: Tone;
  /** The URL fragment, without `#`, that opens it in place. */
  hash: string;
  /** Locale-free route of its showcase page, if it has one. */
  href?: string;
  liveUrl?: string;
  status?: InterfaceStatus;
  /** Set on client sites: name, route and live URL come from `PROJECTS`. */
  project?: ProjectKey;
};

function clientSite(slug: "velum" | "astyleMarine", hash: string): CellSpec {
  const project = PROJECTS[slug];
  return { slug, tone: "paper", hash, href: project.href, liveUrl: project.liveUrl, status: "live", project: slug };
}

export const CELLS: readonly CellSpec[] = [
  {
    slug: "voyager",
    tone: "paper",
    hash: "voyager",
    href: PROJECTS.voyager.href,
    liveUrl: PROJECTS.voyager.liveUrl,
    status: "live",
  },
  // The index is the site's navigation, so it has no showcase of its own.
  { slug: "index", tone: "ink", hash: "index" },
  { slug: "polis", tone: "paper", hash: "polis", href: "/work/polis", status: "comingSoon" },
  { slug: "midiflow", tone: "ink", hash: "midiflow", status: "comingSoon" },
  { slug: "patchbay", tone: "paper", hash: "patchbay", status: "comingSoon" },
  { slug: "funda", tone: "paper", hash: "funda", href: "/work/funda", status: "comingSoon" },
  clientSite("velum", "velum"),
  clientSite("astyleMarine", "astyle-marine"),
];

/** Props every fragment takes. `expanded` is true while it fills the viewport. */
export type FragmentProps = { expanded: boolean };

/** The cell a `#hash` (with or without the `#`) opens, or null. */
export function targetForHash(hash: string): CellSlug | null {
  const bare = hash.replace(/^#/, "");
  if (!bare) return null;
  return CELLS.find((spec) => spec.hash === bare)?.slug ?? null;
}

/** The hash a cell opens under. */
export function hashFor(cell: CellSlug): string {
  return CELLS.find((spec) => spec.slug === cell)?.hash ?? "";
}
