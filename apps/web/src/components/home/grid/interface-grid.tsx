import { getTranslations } from "next-intl/server";
import { MakerMark } from "@/components/layout/maker-mark";
import type { AppLocale } from "@/i18n/routing";
import { CELLS } from "@/lib/site/interfaces";
import { PROJECTS } from "@/lib/site/projects";
import { InterfaceShell, type CellEntry } from "./interface-shell";

/**
 * The home page: the veil over the top of the grid, and the grid of eight
 * working interfaces. Resolves every cell's copy on the server and hands it
 * to the client shell, which owns reveal, open in place and the hash. The
 * veil, its scroll-driven lift and the grid live in `globals.css` under
 * `.home-veil` and `.interface-grid`. See docs/home-grid-contract.md.
 */
export async function InterfaceGrid({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });

  const cells: CellEntry[] = CELLS.map((cell) => {
    const name = cell.project ? PROJECTS[cell.project].name : t(`${cell.slug}.name`);
    const line = cell.project ? projects(`${cell.project}.role`) : t(`${cell.slug}.line`);
    return {
      slug: cell.slug,
      tone: cell.tone,
      copy: {
        name,
        line,
        openName: t("common.openName", { name }),
        href: cell.href,
        liveUrl: cell.liveUrl,
      },
    };
  });

  return (
    <div className="home-stage">
      {/* The veil: ink over the top of the grid, fading to nothing. It takes
          no pointer events but on its solid band and the logo, so a click or
          a wheel where it has faded reaches the cell under it. */}
      <div className="home-veil">
        <div className="section-shell home-veil__shell">
          <MakerMark locale={locale} />
          <h1 className="type-display home-veil__claim">{t("common.claim")}</h1>
        </div>
      </div>

      <section aria-label={t("common.gridLabel")} className="interface-grid">
        <InterfaceShell
          cells={cells}
          labels={{
            open: t("common.open"),
            close: t("common.close"),
            liveSite: t("common.liveSite"),
            theProject: t("common.theProject"),
            newTab: projects("newTab"),
          }}
        />
      </section>
    </div>
  );
}
