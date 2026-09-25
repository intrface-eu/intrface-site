import { PROJECTS, type ProjectKey } from "@/lib/site/projects";

/**
 * The cells of the home grid, in DOM order. DOM order is reading and tab
 * order, and the grid areas in `globals.css` (`.interface-grid`) place the
 * cells so that order also reads left to right, top to bottom at every
 * breakpoint.
 *
 * Copy: a product cell reads its name and line from `HomeGrid.<slug>`; a
 * client cell (`project`) takes its name from `PROJECTS` and its line from
 * `Projects.<key>.role`. Status labels come from `HomeGrid.common`.
 *
 * See docs/home-grid-contract.md.
 */

export type InterfaceSlug =
  | "voyager"
  | "velum"
  | "index"
  | "midiflow"
  | "astyleMarine"
  | "patchbay"
  | "polis"
  | "funda";

/** Which fragment component draws the cell; see `fragment-registry.tsx`. */
export type FragmentKey = "voyager" | "index" | "midiflow" | "patchbay" | "polis" | "funda" | "capture";

export type InterfaceStatus = "live" | "comingSoon";

export type InterfaceSpec = {
  slug: InterfaceSlug;
  /** The `grid-area` name the cell takes in `.interface-grid`. */
  area: string;
  /** The cell's surface: paper tokens, or ink with the `.tone-ink` text tokens. */
  tone: "paper" | "ink";
  fragment: FragmentKey;
  /** Locale-free route of the showcase the Open link leads to. */
  href?: string;
  liveUrl?: string;
  status?: InterfaceStatus;
  /** Set on client sites: name, route and live URL come from `PROJECTS`. */
  project?: ProjectKey;
};

function clientSite(slug: "velum" | "astyleMarine", area: string): InterfaceSpec {
  const project = PROJECTS[slug];
  return {
    slug,
    area,
    tone: "paper",
    fragment: "capture",
    href: project.href,
    liveUrl: project.liveUrl,
    status: "live",
    project: slug,
  };
}

export const INTERFACES: readonly InterfaceSpec[] = [
  {
    slug: "voyager",
    area: "voyager",
    tone: "paper",
    fragment: "voyager",
    href: PROJECTS.voyager.href,
    liveUrl: PROJECTS.voyager.liveUrl,
    status: "live",
  },
  clientSite("velum", "velum"),
  // The index is the site's navigation, so it has no destination of its own.
  { slug: "index", area: "index", tone: "ink", fragment: "index" },
  { slug: "midiflow", area: "midiflow", tone: "ink", fragment: "midiflow", status: "comingSoon" },
  clientSite("astyleMarine", "astyle"),
  { slug: "patchbay", area: "patchbay", tone: "paper", fragment: "patchbay", status: "comingSoon" },
  { slug: "polis", area: "polis", tone: "paper", fragment: "polis", href: "/work/polis", status: "comingSoon" },
  { slug: "funda", area: "funda", tone: "paper", fragment: "funda", href: "/work/funda", status: "comingSoon" },
];
