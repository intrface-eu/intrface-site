import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { INTERFACES } from "@/lib/site/interfaces";
import { PROJECTS } from "@/lib/site/projects";
import { FRAGMENTS } from "./fragment-registry";
import { InterfaceCell } from "./interface-cell";

/**
 * The home page's first screen: eight interface cells on open ground. Reads
 * the registry, resolves each cell's copy on the server and hands the cell
 * its fragment as a child. Layout and the cut geometry live in `globals.css`
 * under `.interface-grid`.
 */
export async function InterfaceGrid({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });

  return (
    <section aria-labelledby="interface-grid-title" className="interface-grid">
      {/* The page's one heading. No claim is set on the page itself: the grid
          is what the first screen says. */}
      <h1 className="sr-only" id="interface-grid-title">
        {t("common.gridLabel")}
      </h1>

      {INTERFACES.map((cell) => {
        const Fragment = FRAGMENTS[cell.fragment];
        const name = cell.project ? PROJECTS[cell.project].name : t(`${cell.slug}.name`);
        const line = cell.project ? projects(`${cell.project}.role`) : t(`${cell.slug}.line`);

        return (
          <InterfaceCell
            area={cell.area}
            href={cell.href}
            key={cell.slug}
            labels={{
              open: t("common.open"),
              openName: t("common.openName", { name }),
              liveSite: t("common.liveSite"),
              newTab: projects("newTab"),
            }}
            line={line}
            liveUrl={cell.liveUrl}
            name={name}
            slug={cell.slug}
            status={cell.status ? t(`common.${cell.status}`) : undefined}
            tone={cell.tone}
          >
            <Fragment slug={cell.slug} />
          </InterfaceCell>
        );
      })}
    </section>
  );
}
