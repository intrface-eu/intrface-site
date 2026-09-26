import { getImageProps } from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import {
  DESKTOP_CAPTURE,
  MOBILE_CAPTURE,
  PROJECTS,
  type ProjectKey,
} from "@/lib/site/projects";

/** Home shows the live projects in this order. */
const WORK: readonly ProjectKey[] = ["voyager", "velum", "astyleMarine"];

/** The tile is as wide as `.section-shell`'s content box. */
const DESKTOP_SIZES = "(min-width: 1280px) 1200px, (min-width: 1024px) calc(100vw - 5rem), calc(100vw - 4rem)";
const MOBILE_SIZES = "(min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)";

/**
 * The work on home: one tile per live project, each one link to the live
 * site wrapping its real screenshot, whole (the desktop capture from 768px,
 * the mobile capture below), and a caption row. See `.work-tiles` in
 * globals.css and docs/home-grid-contract.md.
 */
export async function WorkTiles({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid.common" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const newTab = projects("newTab");

  return (
    <section aria-label={t("gridLabel")} className="section-shell work-tiles">
      {WORK.map((key, index) => {
        const project = PROJECTS[key];
        const line = projects(`${key}.role`);
        const first = index === 0;
        const shared = {
          alt: project.name,
          fetchPriority: first ? ("high" as const) : undefined,
          loading: first ? ("eager" as const) : ("lazy" as const),
        };
        const {
          props: { srcSet: desktopSrcSet },
        } = getImageProps({ ...shared, ...DESKTOP_CAPTURE, sizes: DESKTOP_SIZES, src: project.desktop });
        const { props: mobile } = getImageProps({
          ...shared,
          ...MOBILE_CAPTURE,
          sizes: MOBILE_SIZES,
          src: project.mobile,
        });

        return (
          <a
            aria-label={`${project.name}: ${line.replace(/\.$/, "")}, ${newTab}`}
            className="work-tile"
            href={project.liveUrl}
            key={key}
            rel="noopener noreferrer"
            target="_blank"
          >
            <picture>
              <source
                height={DESKTOP_CAPTURE.height}
                media="(min-width: 768px)"
                sizes={DESKTOP_SIZES}
                srcSet={desktopSrcSet}
                width={DESKTOP_CAPTURE.width}
              />
              {/* Art direction: the next/image props come from getImageProps. */}
              <img {...mobile} alt={project.name} className="work-tile__image" />
            </picture>
            <span className="work-tile__caption">
              <span className="type-caption work-tile__name">{project.name}</span>
              <span className="type-caption work-tile__line">{line}</span>
              <IconArrowUpRight aria-hidden="true" className="work-tile__arrow h-4 w-4" />
            </span>
          </a>
        );
      })}
    </section>
  );
}
