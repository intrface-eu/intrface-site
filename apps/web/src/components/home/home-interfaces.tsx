import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { InterfaceDuo, InterfaceRow, InterfaceStatus } from "@/components/showcase/interface-row";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { PRODUCT_ROOTS } from "@/lib/site/product-roots";
import { PROJECTS } from "@/lib/site/projects";

const SHOTS = "/proof/projects";
const ATLAS_URL = "https://voyager.intrface.eu/en/vrsar";

/**
 * Home below the first screen: our own products that open without signing
 * in, one row each, in this order: Voyager (the lead, a screen tall),
 * AgroPulse, Radio, PatchBay, Polis and midiflow (shorter rows, about two to
 * a screen; see `.ifaces--home` in globals.css). The screens alternate
 * sides; the phone shows the product in use. Each row opens its product at
 * its root, in the same tab. The last block is the one door from home to
 * the client work on /services. Index and Funda, not open yet, are on /work.
 */
export async function HomeInterfaces({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Showcase" });
  const home = await getTranslations({ locale, namespace: "HomeGrid" });
  const projects = await getTranslations({ locale, namespace: "Projects" });

  const open = (name: string, href: string) => (
    <a className="iface-link" href={href}>
      {t("open", { name })}
      <IconArrowRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );

  const live = <InterfaceStatus>{t("live")}</InterfaceStatus>;

  return (
    <section aria-label={home("common.gridLabel")} className="ifaces ifaces--home">
      <InterfaceRow
        lead
        priority
        heading={<h2 className="iface-name">Voyager</h2>}
        status={live}
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
        desktop={{ src: `${SHOTS}/voyager/about-desktop-2026-11-12.webp`, alt: t("alt.voyagerDesktop") }}
        phone={{ src: `${SHOTS}/voyager/atlas-mobile-2026-11-12.webp`, alt: t("alt.voyagerPhone") }}
      />

      <InterfaceRow
        side="start"
        heading={<h2 className="iface-name">AgroPulse</h2>}
        status={live}
        line={home("projects.agropulse.line")}
        actions={open("AgroPulse", PRODUCT_ROOTS.agropulse)}
        desktop={{ src: `${SHOTS}/agropulse/lens-desktop-2026-11-12.webp`, alt: t("alt.agropulseDesktop") }}
        phone={{ src: `${SHOTS}/agropulse/lens-mobile-2026-11-12.webp`, alt: t("alt.agropulsePhone") }}
      />

      <InterfaceRow
        heading={<h2 className="iface-name">Radio</h2>}
        status={live}
        line={home("projects.radio.line")}
        actions={open("Radio", PRODUCT_ROOTS.radio)}
        desktop={{ src: `${SHOTS}/radio/app-desktop-2026-11-12.webp`, alt: t("alt.radioDesktop") }}
        phone={{ src: `${SHOTS}/radio/app-mobile-2026-11-12.webp`, alt: t("alt.radioPhone") }}
      />

      <InterfaceRow
        side="start"
        heading={<h2 className="iface-name">PatchBay</h2>}
        status={live}
        line={home("projects.patchbay.line")}
        actions={open("PatchBay", PRODUCT_ROOTS.patchbay)}
        desktop={{ src: `${SHOTS}/patchbay/map-desktop-2026-11-12.webp`, alt: t("alt.patchbayDesktop") }}
        phone={{ src: `${SHOTS}/patchbay/map-mobile-2026-11-12.webp`, alt: t("alt.patchbayPhone") }}
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

      <InterfaceRow
        side="start"
        heading={<h2 className="iface-name">midiflow</h2>}
        status={live}
        line={home("projects.midiflow.line")}
        actions={open("midiflow", PRODUCT_ROOTS.midiflow)}
        desktop={{ src: `${SHOTS}/midiflow/site-desktop-2026-11-12.webp`, alt: t("alt.midiflowDesktop") }}
        phone={{ src: `${SHOTS}/midiflow/play-mobile-2026-11-12.webp`, alt: t("alt.midiflowPhone") }}
      />

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
