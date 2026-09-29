import Image, { getImageProps } from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { PRODUCT_PAGE_LOCALE, PRODUCT_ROOTS } from "@/lib/site/product-roots";
import { DESKTOP_CAPTURE, MOBILE_CAPTURE, PROJECTS } from "@/lib/site/projects";

/** Columns a tile spans on the 12-column grid from 1024px. */
type Span = 4 | 5 | 7;

/** What one tile needs. */
type Tile = {
  key: string;
  name: string;
  /** The line after the name, from 1024px (always in the link's name). */
  line?: string;
  /** "Coming soon", for a product not open yet: shown at every width, after
      the line; below 768px on a second caption line, with no arrow. */
  status?: string;
  /** The product's root, which opens its About page. A product not open yet
      has its About page on this site: a path starting with `/`, through the
      locale-aware Link. */
  href: string;
  desktop: string;
  mobile: string;
  /** The product's own mark (`public/proof/projects/<key>/logo.svg`) and its
      width at the caption's 18px logo height. */
  logo: string;
  logoWidth: number;
  span: Span;
  /** The largest cell: 7 columns from 1024px, the whole top row below. */
  lead?: true;
  /** Where a cell narrower than the capture keeps it: the side the page's
      headline sits on. The captures are the About pages the tiles open
      (Patchbay: its landing). Voyager centres its hero, Index centres its
      column, Patchbay centres its intro; Polis and AgroPulse set their
      headline on the left. */
  anchor: "center" | "left" | "right";
};

const LOGO_HEIGHT = 18;

/* `sizes` for the cell each capture fills with `object-fit: cover`. A cell
   narrower than the capture's shape (1.44) is filled by height, so the image
   is drawn wider than the cell. From 1024px the rows are half the viewport
   high: a span of n columns fills by width once the viewport is wider than
   8.64/n (0.72 × 12 / n) and is then n/12 of the viewport wide, otherwise it
   is 72vh wide. From 768 to 1023px the rows are a third high: the lead fills
   the row by width from 12/25 (0.48) and the half-width cells from 24/25
   (0.96), otherwise both are 48vh wide. Span 7 is the lead's. */
const DESKTOP_SIZES: Record<Span, string> = {
  7: "(min-width: 1024px) and (min-aspect-ratio: 216/175) 59vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 12/25) 100vw, 48vh",
  5: "(min-width: 1024px) and (min-aspect-ratio: 216/125) 42vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 24/25) 50vw, 48vh",
  4: "(min-width: 1024px) and (min-aspect-ratio: 54/25) 34vw, (min-width: 1024px) 72vh, (min-aspect-ratio: 24/25) 50vw, 48vh",
};
/* Below 768px the mobile capture (0.46) is used. Every cell is a third of
   the viewport high and at least half of it wide, so at any phone shape the
   capture fills its cell by width: the lead 100vw, the others 50vw. */
const LEAD_MOBILE_SIZES = "100vw";
const MOBILE_SIZES = "50vw";

/**
 * The work on home: a bento of five tiles, one per product of our own, that
 * fills the screen, pinned under the veil until the veil has gone. Each tile
 * is one link, in the same tab, into the product: Voyager, Polis and
 * AgroPulse open their root, which shows their About page; Index and
 * Patchbay, not open yet, open their page here and say "Coming soon". Inside, the real screenshot (the desktop
 * capture from 768px, the mobile capture below) and a caption bar with the
 * product's logo. See `.work-tiles` in globals.css and
 * docs/home-grid-contract.md.
 */
export async function WorkTiles({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const polis = await getTranslations({ locale, namespace: "WorkPolis" });
  const entries = await getTranslations({ locale, namespace: "WorkIndex.entries" });

  /* Voyager 7 and Index 5 over Polis, AgroPulse and Patchbay at 4 each. */
  const tiles: Tile[] = [
    {
      key: "voyager",
      name: PROJECTS.voyager.name,
      line: projects("voyager.role"),
      href: PRODUCT_ROOTS.voyager,
      desktop: PROJECTS.voyager.desktop,
      mobile: PROJECTS.voyager.mobile,
      logo: "/proof/projects/voyager/logo.svg",
      logoWidth: LOGO_HEIGHT,
      span: 7,
      lead: true,
      anchor: "center",
    },
    {
      key: "index",
      name: "Index",
      line: t("projects.index.line"),
      status: t("projects.index.status"),
      href: "/index",
      desktop: "/proof/projects/index/desktop.webp",
      mobile: "/proof/projects/index/mobile.webp",
      logo: "/proof/projects/index/logo.svg",
      logoWidth: 5,
      span: 5,
      anchor: "left",
    },
    {
      key: "polis",
      name: polis("name"),
      line: polis("domain"),
      href: PRODUCT_ROOTS.polis,
      desktop: "/proof/projects/polis/about-desktop-2026-09-29.webp",
      mobile: "/proof/projects/polis/about-mobile-2026-09-29.webp",
      logo: "/proof/projects/polis/logo.svg",
      logoWidth: LOGO_HEIGHT,
      span: 4,
      anchor: "left",
    },
    {
      key: "agropulse",
      name: "AgroPulse",
      line: t("projects.agropulse.line"),
      href: PRODUCT_ROOTS.agropulse,
      desktop: "/proof/projects/agropulse/about-desktop-2026-09-29.webp",
      mobile: "/proof/projects/agropulse/about-mobile-2026-09-29.webp",
      logo: "/proof/projects/agropulse/logo.svg",
      logoWidth: LOGO_HEIGHT,
      span: 4,
      anchor: "left",
    },
    {
      key: "patchbay",
      name: entries("patchbay.name"),
      status: entries("patchbay.status"),
      href: "/patchbay",
      desktop: "/proof/projects/patchbay/desktop.webp",
      mobile: "/proof/projects/patchbay/mobile.webp",
      logo: "/proof/projects/patchbay/logo.svg",
      logoWidth: LOGO_HEIGHT,
      span: 4,
      anchor: "center",
    },
  ];

  return (
    <section aria-label={t("common.gridLabel")} className="work-tiles">
      {/* The grid, not the sticky section, carries the rise into place. */}
      <div className="work-tiles__grid">
        {tiles.map((tile, index) => {
          const shared = {
            alt: tile.name,
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
            sizes: tile.lead ? LEAD_MOBILE_SIZES : MOBILE_SIZES,
            src: tile.mobile,
          });

          const detail = [tile.line?.replace(/\.$/, ""), tile.status].filter(Boolean).join(", ");
          const props = {
            "aria-label": `${tile.name}: ${detail}`,
            className: "work-tile",
            "data-anchor": tile.anchor,
            "data-lead": tile.lead ? "" : undefined,
            "data-soon": tile.status ? "" : undefined,
            "data-span": tile.span,
          };

          const body = (
            <>
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
                {/* The logo is decorative: the name follows it. */}
                <Image
                  alt=""
                  className="work-tile__logo"
                  height={LOGO_HEIGHT}
                  loading="eager"
                  src={tile.logo}
                  unoptimized
                  width={tile.logoWidth}
                />
                <span className="type-caption work-tile__name">{tile.name}</span>
                {tile.line ? <span className="type-caption work-tile__line">{tile.line}</span> : null}
                {tile.status ? <span className="type-caption work-tile__status">{tile.status}</span> : null}
                <IconArrowRight aria-hidden="true" className="work-tile__arrow h-4 w-4" />
              </span>
            </>
          );

          // A page on this site is a product not open yet, in English only:
          // every locale links straight to /en/<page>, not via a redirect.
          return tile.href.startsWith("/") ? (
            <Link
              {...props}
              href={tile.href}
              hrefLang={PRODUCT_PAGE_LOCALE}
              key={tile.key}
              locale={PRODUCT_PAGE_LOCALE}
            >
              {body}
            </Link>
          ) : (
            <a {...props} href={tile.href} key={tile.key}>
              {body}
            </a>
          );
        })}
      </div>
    </section>
  );
}
