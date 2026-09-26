import { PROJECTS, type ProjectKey } from "@/lib/site/projects";

/**
 * The home grid: four cells, in DOM order, and the pieces the work cell
 * rotates through. DOM order is reading and tab order; the grid areas in
 * `globals.css` (`.interface-grid`) place the cells so that order also reads
 * left to right, top to bottom at every breakpoint.
 *
 * Every cell and every work piece can open in place: its `hash` is the URL
 * fragment that opens it expanded over the grid (`/#voyager`, `/#midiflow`).
 * `href` is the showcase route a direct visit reaches; `liveUrl` the live site.
 *
 * Copy: a product reads its name and line from `HomeGrid.<slug>`; a client
 * site (`project`) takes its name from `PROJECTS` and its line from
 * `Projects.<key>.role`. Shell labels (Open, Close, Live site, The project)
 * come from `HomeGrid.common`.
 *
 * See docs/home-grid-contract.md.
 */

export type CellSlug = "voyager" | "index" | "polis" | "work";

export type WorkPieceSlug = "midiflow" | "patchbay" | "funda" | "velum" | "astyleMarine";

export type InterfaceStatus = "live" | "comingSoon";

export type Tone = "paper" | "ink";

/** What any openable thing carries: a cell, or a piece of the work cell. */
type OpenableSpec = {
  /** The URL fragment, without `#`, that opens it in place. */
  hash: string;
  /** Locale-free route of its showcase page, if it has one. */
  href?: string;
  liveUrl?: string;
  status?: InterfaceStatus;
  /** Set on client sites: name, route and live URL come from `PROJECTS`. */
  project?: ProjectKey;
};

export type CellSpec = OpenableSpec & {
  slug: CellSlug;
  /** The `grid-area` name the cell takes in `.interface-grid`. */
  area: string;
  /** The cell's surface. The work cell takes the current piece's tone instead. */
  tone: Tone;
};

export type WorkPieceSpec = OpenableSpec & {
  slug: WorkPieceSlug;
  tone: Tone;
};

export const CELLS: readonly CellSpec[] = [
  {
    slug: "voyager",
    area: "voyager",
    tone: "paper",
    hash: "voyager",
    href: PROJECTS.voyager.href,
    liveUrl: PROJECTS.voyager.liveUrl,
    status: "live",
  },
  // The index is the site's navigation, so it has no showcase of its own.
  { slug: "index", area: "index", tone: "ink", hash: "index" },
  { slug: "polis", area: "polis", tone: "paper", hash: "polis", href: "/work/polis", status: "comingSoon" },
  // Opens as whichever piece is current, under that piece's hash.
  { slug: "work", area: "work", tone: "paper", hash: "" },
];

function clientSite(slug: "velum" | "astyleMarine", hash: string): WorkPieceSpec {
  const project = PROJECTS[slug];
  return { slug, tone: "paper", hash, href: project.href, liveUrl: project.liveUrl, status: "live", project: slug };
}

/** The work cell's pieces, in rotation order. */
export const WORK_PIECES: readonly WorkPieceSpec[] = [
  { slug: "midiflow", tone: "ink", hash: "midiflow", status: "comingSoon" },
  { slug: "patchbay", tone: "paper", hash: "patchbay", status: "comingSoon" },
  { slug: "funda", tone: "paper", hash: "funda", href: "/work/funda", status: "comingSoon" },
  clientSite("velum", "velum"),
  clientSite("astyleMarine", "astyle-marine"),
];

/** Props every fragment takes. `expanded` is true while it fills the viewport. */
export type FragmentProps = { expanded: boolean };

/**
 * The work cell's fragment. The cell (shell) owns the current piece so its
 * label, Open link and hash follow it; the fragment draws the piece and its
 * switcher and reports changes, including idle rotation.
 */
export type WorkFragmentProps = FragmentProps & {
  piece: WorkPieceSlug;
  onPieceChange: (piece: WorkPieceSlug) => void;
};

/** What a URL fragment opens: a cell, and for the work cell the piece. */
export type OpenTarget = { cell: CellSlug; piece?: WorkPieceSlug };

/** The target a `#hash` (with or without the `#`) names, or null. */
export function targetForHash(hash: string): OpenTarget | null {
  const bare = hash.replace(/^#/, "");
  if (!bare) return null;
  const cell = CELLS.find((spec) => spec.hash === bare);
  if (cell) return { cell: cell.slug };
  const piece = WORK_PIECES.find((spec) => spec.hash === bare);
  return piece ? { cell: "work", piece: piece.slug } : null;
}

/** The hash a cell opens under; the work cell takes its current piece's. */
export function hashFor(cell: CellSlug, piece: WorkPieceSlug): string {
  if (cell === "work") return WORK_PIECES.find((spec) => spec.slug === piece)?.hash ?? "";
  return CELLS.find((spec) => spec.slug === cell)?.hash ?? "";
}
