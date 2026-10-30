import Image from "next/image";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { InterfaceDuo, InterfaceRow, InterfaceStatus } from "@/components/showcase/interface-row";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { PRODUCT_PAGE_LOCALE, PRODUCT_ROOTS } from "@/lib/site/product-roots";
import { PROJECTS } from "@/lib/site/projects";

const SHOTS = "/proof/projects";
const ATLAS_URL = "https://voyager.intrface.eu/en/vrsar";

/** A product not open yet: its screen, its name and "Coming soon", one link to its page here. */
function SoonCard({ href, name, line, status, src, alt }: {
  href: string;
  name: string;
  line?: string;
  status: string;
  src: string;
  alt: string;
}) {
  return (
    // English only, so every locale links straight to /en/<page>.
    <Link className="iface-card" href={href} hrefLang={PRODUCT_PAGE_LOCALE} locale={PRODUCT_PAGE_LOCALE}>
      <span className="iface-screen">
        <Image
          alt={alt}
          className="iface-screen__image"
          height={1000}
          sizes="(min-width: 768px) 40vw, 100vw"
          src={src}
          width={1440}
        />
      </span>
      <span className="iface-card__title">
        <span className="iface-card__name">{name}</span>
        <InterfaceStatus tone="soon">{status}</InterfaceStatus>
      </span>
      {line ? <span className="type-body iface-card__line">{line}</span> : null}
    </Link>
  );
}

/**
 * Home below the first screen: our own interfaces, one per screen height.
 * Voyager, AgroPulse and Polis each get a row (the phone shows the
 * product in use); Index and Patchbay, not
 * open yet, share one quieter row; the last block is the one door from home
 * to the client work on /services. Each row opens its product the way the
 * home tiles did: Voyager, AgroPulse and Polis at their root, Index and
 * Patchbay at their page here.
 */
export async function HomeInterfaces({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Showcase" });
  const home = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const entries = await getTranslations({ locale, namespace: "WorkIndex.entries" });

  const open = (name: string, href: string) => (
    <a className="iface-link" href={href}>
      {t("open", { name })}
      <IconArrowRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );

  return (
    <section aria-label={home("common.gridLabel")} className="ifaces ifaces--home">
      <InterfaceRow
        lead
        priority
        heading={<h2 className="iface-name">Voyager</h2>}
        status={<InterfaceStatus>{t("live")}</InterfaceStatus>}
        line={projects("voyager.role")}
        actions={
          <>
            {open("Voyager", PRODUCT_ROOTS.voyager)}
            <a className="iface-link iface-link--quiet" href={ATLAS_URL}>
              {t("openAtlas")}
              <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </>
        }
        desktop={{ src: `${SHOTS}/voyager/about-desktop-2026-10-30.webp`, alt: t("alt.voyagerDesktop") }}
        phone={{ src: `${SHOTS}/voyager/atlas-mobile-2026-10-30.webp`, alt: t("alt.voyagerPhone") }}
      />

      <InterfaceRow
        side="start"
        heading={<h2 className="iface-name">AgroPulse</h2>}
        status={<InterfaceStatus>{t("live")}</InterfaceStatus>}
        line={home("projects.agropulse.line")}
        actions={open("AgroPulse", PRODUCT_ROOTS.agropulse)}
        desktop={{ src: `${SHOTS}/agropulse/app-desktop-2026-10-30.webp`, alt: t("alt.agropulseDesktop") }}
        phone={{ src: `${SHOTS}/agropulse/app-mobile-2026-10-30.webp`, alt: t("alt.agropulsePhone") }}
      />

      <InterfaceRow
        heading={<h2 className="iface-name">Polis</h2>}
        status={<InterfaceStatus tone="test">{t("publicTest")}</InterfaceStatus>}
        line={
          <>
            {t("polisLine")} <span className="iface-row__note">{t("polisNote")}</span>
          </>
        }
        actions={open("Polis", PRODUCT_ROOTS.polis)}
        desktop={{ src: `${SHOTS}/polis/map-desktop-2026-10-30.webp`, alt: t("alt.polisDesktop") }}
        phone={{ src: `${SHOTS}/polis/report-mobile-2026-10-30.webp`, alt: t("alt.polisPhone") }}
      />

      <div className="iface-pair">
        <SoonCard
          alt={t("alt.index")}
          href="/index"
          line={home("projects.index.line")}
          name="Index"
          src={`${SHOTS}/index/desktop.webp`}
          status={home("projects.index.status")}
        />
        <SoonCard
          alt={t("alt.patchbay")}
          href="/patchbay"
          name={entries("patchbay.name")}
          src={`${SHOTS}/patchbay/desktop.webp`}
          status={entries("patchbay.status")}
        />
      </div>

      <div className="iface-door">
        <div className="iface-door__text">
          <h2 className="type-heading">{t("clientsHeading")}</h2>
          <p className="type-body-lg">{t("clientsBody")}</p>
          <Link className={tactileButtonClasses("primary", "mt-8")} href="/services">
            {t("clientsLink")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <InterfaceDuo
          className="iface-door__shots"
          shots={[
            { href: PROJECTS.velum.liveUrl, src: `${SHOTS}/velum/desktop-2026-10-30.webp`, alt: t("alt.velum") },
            {
              href: PROJECTS.astyleMarine.liveUrl,
              src: `${SHOTS}/astyle-marine/desktop-2026-10-30.webp`,
              alt: t("alt.astyle"),
            },
          ]}
        />
      </div>
    </section>
  );
}
