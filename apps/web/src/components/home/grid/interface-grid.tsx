import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { CELLS, WORK_PIECES, type WorkPieceSlug } from "@/lib/site/interfaces";
import { PROJECTS, type ProjectKey } from "@/lib/site/projects";
import { InterfaceShell, type OpenableCopy, type PieceCopy } from "./interface-shell";

/**
 * The home page's first screen: four interface cells on open ground. Resolves
 * every cell's and every work piece's copy on the server and hands it to the
 * client shell, which owns reveal, open in place and the hash. Layout and the
 * cut geometry live in `globals.css` under `.interface-grid`.
 */
export async function InterfaceGrid({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });

  const copyFor = (
    slug: string,
    spec: { href?: string; liveUrl?: string; project?: ProjectKey },
  ): OpenableCopy => {
    const name = spec.project ? PROJECTS[spec.project].name : t(`${slug}.name`);
    const line = spec.project ? projects(`${spec.project}.role`) : t(`${slug}.line`);
    return {
      name,
      line,
      openName: t("common.openName", { name }),
      href: spec.href,
      liveUrl: spec.liveUrl,
    };
  };

  const cells = CELLS.map((cell) => ({
    slug: cell.slug,
    area: cell.area,
    tone: cell.tone,
    // The work cell reads its copy from the current piece.
    copy: cell.slug === "work" ? null : copyFor(cell.slug, cell),
  }));

  const pieces = Object.fromEntries(
    WORK_PIECES.map((piece) => [piece.slug, { ...copyFor(piece.slug, piece), tone: piece.tone }]),
  ) as Record<WorkPieceSlug, PieceCopy>;

  return (
    <section aria-labelledby="interface-grid-title" className="interface-grid">
      {/* The page's one heading. No claim is set on the page itself: the grid
          is what the first screen says. */}
      <h1 className="sr-only" id="interface-grid-title">
        {t("common.gridLabel")}
      </h1>

      <InterfaceShell
        cells={cells}
        labels={{
          open: t("common.open"),
          close: t("common.close"),
          liveSite: t("common.liveSite"),
          theProject: t("common.theProject"),
          newTab: projects("newTab"),
        }}
        pieces={pieces}
      />
    </section>
  );
}
