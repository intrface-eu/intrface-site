import Image, { getImageProps } from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { DESKTOP_CAPTURE, MOBILE_CAPTURE, PROJECTS } from "@/lib/site/projects";

/** Columns a tile spans on the 12-column grid from 1024px. */
type Span = 3 | 4 | 5;

/** What one tile needs. */
type Tile = {
  key: string;
  name: string;
  line: string;
  /** The live site or public source. Absent for work that is not open yet:
      that tile is not a link, shows no arrow and does not brighten. */
  href?: string;
  desktop: string;
  mobile: string;
  /** The project's own mark (`public/proof/projects/<key>/logo.svg`) and its
      width at the caption's 18px logo height. */
  logo: string;
  logoWidth: number;
  span: Span;
  /** Where a cell narrower than the capture keeps it: the side the site's
      headline sits on. Voyager centres its hero, AgroPulse keeps its side
      panel on the right, Patchbay centres its intro; the rest start left. */
  anchor: "center" | "left" | "right";
};

const LOGO_HEIGHT = 18;

/* Home-only tiles. Other pages iterate `PROJECTS`, so these stay out of it.
   Patchbay is not public yet: no link and no address, only its name. */
const POLIS = {
  href: "https://github.com/basicalex/polis",
  desktop: "/proof/projects/polis/landing-desktop.webp",
  mobile: "/proof/projects/polis/landing-mobile.webp",
  logo: "/proof/projects/polis/logo.svg",
  logoWidth: LOGO_HEIGHT,
};

const AGROPULSE = {
  name: "AgroPulse",
  href: "https://agropulse.intrface.eu",
  desktop: "/proof/projects/agropulse/desktop.webp",
  mobile: "/proof/projects/agropulse/mobile.webp",
  logo: "/proof/projects/agropulse/logo.svg",
  logoWidth: LOGO_HEIGHT,
};

const PATCHBAY = {
  desktop: "/proof/projects/patchbay/desktop.webp",
  mobile: "/proof/projects/patchbay/mobile.webp",
  logo: "/proof/projects/patchbay/logo.svg",
  logoWidth: LOGO_HEIGHT,
};

const LOGOS = {
  voyager: { logo: "/proof/projects/voyager/logo.svg", logoWidth: LOGO_HEIGHT },
  velum: { logo: "/proof/projects/velum/logo.svg", logoWidth: 35 },
  astyleMarine: { logo: "/proof/projects/astyle-marine/logo.svg", logoWidth: LOGO_HEIGHT },
} as const;

/* `sizes` for the cell each capture fills with `object-fit: cover`. A cell
   narrower than the capture's shape (1.44) is filled by height, so the image
   is drawn wider than the cell: 72vh for a half-height row from 1024px, 48vh
   for a third-height row below. The aspect-ratio conditions pick the case:
   from 1024px a span of n columns fills by width once the viewport is wider
   than 8.64/n (0.72 × 12 / n). Below 768px the mobile capture (0.46) fills a
   half-width, third-height cell by width. */
const DESKTOP_SIZES: Record<Span, string> = {
  5: "(min-width: 1024px) and (min-aspect-ratio: 216/125) 42vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 24/25) 50vw, 48vh",
  4: "(min-width: 1024px) and (min-aspect-ratio: 54/25) 34vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 24/25) 50vw, 48vh",
  3: "(min-width: 1024px) and (min-aspect-ratio: 72/25) 25vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 24/25) 50vw, 48vh",
};
const MOBILE_SIZES = "50vw";

/**
 * The work on home: a bento of six tiles that fills the screen, pinned
 * under the veil until the veil has gone. Each open tile is one link to the
 * live site (Polis: its public source) wrapping its real screenshot (the
 * desktop capture from 768px, the mobile capture below) and a caption bar
 * with the project's logo. Patchbay is not open yet: a plain tile with its
 * name and "Coming soon". See `.work-tiles` in globals.css and
 * docs/home-grid-contract.md.
 */
export async function WorkTiles({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const polis = await getTranslations({ locale, namespace: "WorkPolis" });
  const entries = await getTranslations({ locale, namespace: "WorkIndex.entries" });
  const newTab = projects("newTab");

  const project = (key: "voyager" | "velum" | "astyleMarine", span: Span, anchor: Tile["anchor"]): Tile => ({
    key,
    name: PROJECTS[key].name,
    line: projects(`${key}.role`),
    href: PROJECTS[key].liveUrl,
    desktop: PROJECTS[key].desktop,
    mobile: PROJECTS[key].mobile,
    ...LOGOS[key],
    span,
    anchor,
  });

  /* Two rows of three from 1024px, wide and narrow cells trading places:
     5 + 4 + 3, then 3 + 5 + 4. */
  const tiles: Tile[] = [
    project("voyager", 5, "center"),
    { key: "agropulse", line: t("projects.agropulse.line"), ...AGROPULSE, span: 4, anchor: "right" },
    project("velum", 3, "left"),
    { key: "polis", name: polis("name"), line: polis("domain"), ...POLIS, span: 3, anchor: "left" },
    project("astyleMarine", 5, "left"),
    {
      key: "patchbay",
      name: entries("patchbay.name"),
      line: entries("patchbay.status"),
      ...PATCHBAY,
      span: 4,
      anchor: "center",
    },
  ];

  return (
    <section aria-label={t("common.gridLabel")} className="work-tiles">
      {/* The grid, not the sticky section, carries the rise into place. */}
      <div className="work-tiles__grid">
        {tiles.map((tile, index) => {
          const alt = tile.href ? tile.name : "";
          const shared = {
            alt,
            fetchPriority: index === 0 ? ("high" as const) : undefined,
            loading: "eager" as const,
          };
          const desktopSizes = DESKTOP_SIZES[tile.span];
          const {
            props: { srcSet: desktopSrcSet },
          } = getImageProps({ ...shared, ...DESKTOP_CAPTURE, sizes: desktopSizes, src: tile.desktop });
          const { props: mobile } = getImageProps({
            ...shared,
            ...MOBILE_CAPTURE,
            sizes: MOBILE_SIZES,
            src: tile.mobile,
          });

          const picture = (
            <picture className="work-tile__picture">
              <source
                height={DESKTOP_CAPTURE.height}
                media="(min-width: 768px)"
                sizes={desktopSizes}
                srcSet={desktopSrcSet}
                width={DESKTOP_CAPTURE.width}
              />
              {/* Art direction: the next/image props come from getImageProps. */}
              <img {...mobile} alt={alt} className="work-tile__image" />
            </picture>
          );

          /* The logo is decorative: the name follows it. */
          const logo = (
            <Image
              alt=""
              className="work-tile__logo"
              height={LOGO_HEIGHT}
              loading="eager"
              src={tile.logo}
              unoptimized
              width={tile.logoWidth}
            />
          );

          if (!tile.href) {
            /* Not open yet: no link, no arrow, no hover. The status takes the
               arrow's place and shows at every width. */
            return (
              <div className="work-tile" data-anchor={tile.anchor} data-span={tile.span} key={tile.key}>
                {picture}
                <span className="work-tile__caption">
                  {logo}
                  <span className="type-caption work-tile__name">{tile.name}</span>
                  <span className="type-caption work-tile__status">{tile.line}</span>
                </span>
              </div>
            );
          }

          return (
            <a
              aria-label={`${tile.name}: ${tile.line.replace(/\.$/, "")}, ${newTab}`}
              className="work-tile"
              data-anchor={tile.anchor}
              data-span={tile.span}
              href={tile.href}
              key={tile.key}
              rel="noopener noreferrer"
              target="_blank"
            >
              {picture}
              <span className="work-tile__caption">
                {logo}
                <span className="type-caption work-tile__name">{tile.name}</span>
                <span className="type-caption work-tile__line">{tile.line}</span>
                <IconArrowUpRight aria-hidden="true" className="work-tile__arrow h-4 w-4" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
