import { getImageProps } from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { DESKTOP_CAPTURE, MOBILE_CAPTURE, PROJECTS } from "@/lib/site/projects";

/** What one tile needs. */
type Tile = {
  key: string;
  name: string;
  line: string;
  href: string;
  desktop: string;
  mobile: string;
  /** Wide cells take 3 of 5 columns from 1024px; narrow ones take 2. */
  wide: boolean;
  /** Where a cell narrower than the capture keeps it: the side the site's
      headline sits on. Voyager centres its hero; the others start left. */
  anchor: "center" | "left";
};

/** Polis is home-only: other pages iterate `PROJECTS`, so it stays out of it. */
const POLIS = {
  href: "https://github.com/basicalex/polis",
  desktop: "/proof/projects/polis/desktop.webp",
  mobile: "/proof/projects/polis/mobile.webp",
};

/* `sizes` for the cell each capture fills with `object-fit: cover`. A cell
   narrower than the capture's shape is filled by height, so the image is
   drawn wider than the cell: about 72vh for a half-height row (0.5 × 1.44).
   The aspect-ratio conditions pick that case. Below 768px the mobile capture
   (0.46) fills a half-width cell by width. */
const WIDE_SIZES =
  "(min-width: 1024px) and (min-aspect-ratio: 6/5) 60vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 36/25) 50vw, 72vh";
const NARROW_SIZES =
  "(min-width: 1024px) and (min-aspect-ratio: 9/5) 40vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 36/25) 50vw, 72vh";
const MOBILE_SIZES = "50vw";

/**
 * The work on home: a bento of four tiles that fills the screen, pinned
 * under the veil until the veil has gone. Each tile is one link to the live
 * site (Polis: its public source) wrapping its real screenshot (the desktop
 * capture from 768px, the mobile capture below) and a caption bar. See
 * `.work-tiles` in globals.css and docs/home-grid-contract.md.
 */
export async function WorkTiles({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid.common" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const polis = await getTranslations({ locale, namespace: "WorkPolis" });
  const newTab = projects("newTab");

  const project = (
    key: "voyager" | "velum" | "astyleMarine",
    wide: boolean,
    anchor: Tile["anchor"],
  ): Tile => ({
    key,
    name: PROJECTS[key].name,
    line: projects(`${key}.role`),
    href: PROJECTS[key].liveUrl,
    desktop: PROJECTS[key].desktop,
    mobile: PROJECTS[key].mobile,
    wide,
    anchor,
  });

  const tiles: Tile[] = [
    project("voyager", true, "center"),
    project("velum", false, "left"),
    { key: "polis", name: polis("name"), line: polis("domain"), ...POLIS, wide: false, anchor: "left" },
    project("astyleMarine", true, "left"),
  ];

  return (
    <section aria-label={t("gridLabel")} className="work-tiles">
      {tiles.map((tile, index) => {
        const shared = {
          alt: tile.name,
          fetchPriority: index === 0 ? ("high" as const) : undefined,
          loading: "eager" as const,
        };
        const desktopSizes = tile.wide ? WIDE_SIZES : NARROW_SIZES;
        const {
          props: { srcSet: desktopSrcSet },
        } = getImageProps({ ...shared, ...DESKTOP_CAPTURE, sizes: desktopSizes, src: tile.desktop });
        const { props: mobile } = getImageProps({
          ...shared,
          ...MOBILE_CAPTURE,
          sizes: MOBILE_SIZES,
          src: tile.mobile,
        });

        return (
          <a
            aria-label={`${tile.name}: ${tile.line.replace(/\.$/, "")}, ${newTab}`}
            className="work-tile"
            data-anchor={tile.anchor}
            data-wide={tile.wide ? "" : undefined}
            href={tile.href}
            key={tile.key}
            rel="noopener noreferrer"
            target="_blank"
          >
            <picture className="work-tile__picture">
              <source
                height={DESKTOP_CAPTURE.height}
                media="(min-width: 768px)"
                sizes={desktopSizes}
                srcSet={desktopSrcSet}
                width={DESKTOP_CAPTURE.width}
              />
              {/* Art direction: the next/image props come from getImageProps. */}
              <img {...mobile} alt={tile.name} className="work-tile__image" />
            </picture>
            <span className="work-tile__caption">
              <span className="type-caption work-tile__name">{tile.name}</span>
              <span className="type-caption work-tile__line">{tile.line}</span>
              <IconArrowUpRight aria-hidden="true" className="work-tile__arrow h-4 w-4" />
            </span>
          </a>
        );
      })}
    </section>
  );
}
