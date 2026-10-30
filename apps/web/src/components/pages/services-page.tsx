import { IconArrowDown, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { ServicesStage, type StageItem } from "@/components/services/services-stage";
import { StartWith } from "@/components/services/start-with";
import { InterfaceDuo, InterfaceRow, InterfaceStatus } from "@/components/showcase/interface-row";
import { ContactForm } from "@/components/site/contact-form";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import type { AppLocale } from "@/i18n/routing";
import { PRODUCT_ROOTS } from "@/lib/site/product-roots";
import { PROJECTS } from "@/lib/site/projects";

const SHOTS = "/proof/projects";
const ATLAS_URL = "https://voyager.intrface.eu/en/vrsar";
const FAQ = ["price", "after", "size", "start"] as const;

/**
 * /services: what a business or a public body can hire us for, each with the
 * interface we built for it, then the intake form (`#start`) and four answers.
 * The first screen states the offer with one action and the five projects
 * beside it.
 */
export async function ServicesPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Services" });
  const show = await getTranslations({ locale, namespace: "Showcase" });

  const stage: StageItem[] = [
    {
      key: "voyager",
      name: "Voyager",
      line: t("items.voyager"),
      status: show("live"),
      tone: "live",
      href: PRODUCT_ROOTS.voyager,
      open: show("open", { name: "Voyager" }),
      desktop: { src: `${SHOTS}/voyager/about-desktop-2026-10-30.webp`, alt: show("alt.voyagerDesktop") },
      phone: { src: `${SHOTS}/voyager/atlas-mobile-2026-10-30.webp`, alt: show("alt.voyagerPhone") },
    },
    {
      key: "agropulse",
      name: "AgroPulse",
      line: t("items.agropulse"),
      status: show("live"),
      tone: "live",
      href: PRODUCT_ROOTS.agropulse,
      open: show("open", { name: "AgroPulse" }),
      desktop: { src: `${SHOTS}/agropulse/app-desktop-2026-10-30.webp`, alt: show("alt.agropulseDesktop") },
      phone: { src: `${SHOTS}/agropulse/app-mobile-2026-10-30.webp`, alt: show("alt.agropulsePhone") },
    },
    {
      key: "polis",
      name: "Polis",
      line: t("items.polis"),
      status: show("publicTest"),
      tone: "test",
      href: PRODUCT_ROOTS.polis,
      open: show("open", { name: "Polis" }),
      desktop: { src: `${SHOTS}/polis/map-desktop-2026-10-30.webp`, alt: show("alt.polisDesktop") },
      phone: { src: `${SHOTS}/polis/report-mobile-2026-10-30.webp`, alt: show("alt.polisPhone") },
    },
    {
      key: "velum",
      name: "Velum",
      line: t("items.velum"),
      status: show("live"),
      tone: "live",
      href: PROJECTS.velum.liveUrl,
      open: show("open", { name: "Velum" }),
      desktop: { src: `${SHOTS}/velum/desktop-2026-10-30.webp`, alt: show("alt.velum") },
      phone: { src: `${SHOTS}/velum/mobile-2026-10-30.webp`, alt: show("alt.velum") },
    },
    {
      key: "astyle",
      name: "AstyleMarine",
      line: t("items.astyle"),
      status: show("live"),
      tone: "live",
      href: PROJECTS.astyleMarine.liveUrl,
      open: show("open", { name: "AstyleMarine" }),
      desktop: { src: `${SHOTS}/astyle-marine/desktop-2026-10-30.webp`, alt: show("alt.astyle") },
      phone: { src: `${SHOTS}/astyle-marine/mobile-2026-10-30.webp`, alt: show("alt.astyle") },
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((key) => ({
      "@type": "Question",
      name: t(`faq.${key}.q`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq.${key}.a`) },
    })),
  };

  const openLink = (name: string, href: string) => (
    <a className="iface-link iface-link--quiet" href={href}>
      {show("open", { name })}
      <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );

  return (
    <main className="svc text-ink">
      <section className="svc-hero">
        <div className="svc-hero__text">
          <h1 className="svc-hero__title">{t("title")}</h1>
          <p className="type-body-lg svc-hero__body">{t("body")}</p>
          <a className={tactileButtonClasses("primary", "mt-8")} href="#start">
            {t("cta")}
            <IconArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
        <ServicesStage items={stage} label={t("listLabel")} />
      </section>

      <section aria-labelledby="svc-build" className="ifaces">
        <h2 className="svc-intro type-heading" id="svc-build">
          {t("buildTitle")}
        </h2>

        <InterfaceRow
          heading={<h3 className="iface-name iface-name--service">{t("rows.places.title")}</h3>}
          status={<InterfaceStatus>Voyager</InterfaceStatus>}
          line={t("rows.places.line")}
          actions={
            <>
              <StartWith need="place-app">{t("startWith")}</StartWith>
              {openLink("Voyager", ATLAS_URL)}
            </>
          }
          desktop={{ src: `${SHOTS}/voyager/atlas-desktop-2026-10-30.webp`, alt: show("alt.voyagerAtlas") }}
          phone={{ src: `${SHOTS}/voyager/atlas-mobile-2026-10-30.webp`, alt: show("alt.voyagerPhone") }}
        />

        <InterfaceRow
          side="start"
          heading={<h3 className="iface-name iface-name--service">{t("rows.data.title")}</h3>}
          status={<InterfaceStatus>AgroPulse</InterfaceStatus>}
          line={t("rows.data.line")}
          actions={
            <>
              <StartWith need="web-app">{t("startWith")}</StartWith>
              {openLink("AgroPulse", PRODUCT_ROOTS.agropulse)}
            </>
          }
          desktop={{ src: `${SHOTS}/agropulse/app-desktop-2026-10-30.webp`, alt: show("alt.agropulseDesktop") }}
          phone={{ src: `${SHOTS}/agropulse/app-mobile-2026-10-30.webp`, alt: show("alt.agropulsePhone") }}
        />

        <InterfaceRow
          heading={<h3 className="iface-name iface-name--service">{t("rows.public.title")}</h3>}
          status={<InterfaceStatus tone="test">{`Polis · ${show("publicTest")}`}</InterfaceStatus>}
          line={
            <>
              {t("rows.public.line")} <span className="iface-row__note">{show("polisNote")}</span>
            </>
          }
          actions={
            <>
              <StartWith need="public-service">{t("startWith")}</StartWith>
              {openLink("Polis", PRODUCT_ROOTS.polis)}
            </>
          }
          desktop={{ src: `${SHOTS}/polis/report-desktop-2026-10-30.webp`, alt: show("alt.polisReport") }}
          phone={{ src: `${SHOTS}/polis/report-mobile-2026-10-30.webp`, alt: show("alt.polisPhone") }}
        />

        <InterfaceRow
          side="start"
          heading={<h3 className="iface-name iface-name--service">{t("rows.sites.title")}</h3>}
          status={<InterfaceStatus>Velum · AstyleMarine</InterfaceStatus>}
          line={t("rows.sites.line")}
          actions={
            <>
              <StartWith need="business-site">{t("startWith")}</StartWith>
              {openLink("Velum", PROJECTS.velum.liveUrl)}
              {openLink("AstyleMarine", PROJECTS.astyleMarine.liveUrl)}
            </>
          }
          figure={
            <InterfaceDuo
              shots={[
                { href: PROJECTS.velum.liveUrl, src: `${SHOTS}/velum/desktop-2026-10-30.webp`, alt: show("alt.velum") },
                {
                  href: PROJECTS.astyleMarine.liveUrl,
                  src: `${SHOTS}/astyle-marine/desktop-2026-10-30.webp`,
                  alt: show("alt.astyle"),
                },
              ]}
            />
          }
        />
      </section>

      <section aria-labelledby="svc-start" className="svc-start" id="start">
        <div className="section-shell">
          <h2 className="type-display svc-start__title" id="svc-start">
            {t("startTitle")}
          </h2>
          <p className="type-body-lg svc-start__body">{t("startBody")}</p>
          <ContactForm className="mt-12" locale={locale} />
        </div>
      </section>

      <section aria-labelledby="svc-faq" className="svc-faq">
        <div className="section-shell svc-faq__grid">
          <h2 className="type-heading" id="svc-faq">
            {t("faqTitle")}
          </h2>
          <div className="svc-faq__list">
            {FAQ.map((key) => (
              <div className="svc-faq__item" key={key}>
                <h3 className="svc-faq__q">{t(`faq.${key}.q`)}</h3>
                <p className="type-body svc-faq__a">{t(`faq.${key}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        // The FAQ as schema.org data, from the same messages the page shows.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
