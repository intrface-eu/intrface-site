import Image from "next/image";
import type { ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { InterfaceStatus } from "@/components/showcase/interface-row";
import { Link } from "@/i18n/navigation";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import type { AppLocale } from "@/i18n/routing";
import { ProjectPreviews } from "@/components/home/hero-proof";
import { PRODUCT_PAGE_LOCALE, PRODUCT_ROOTS, type ProductRootKey } from "@/lib/site/product-roots";
import { CLIENT_PROJECTS } from "@/lib/site/projects";

const SHOTS = "/proof/projects";

/** Desktop captures are 1440 × 900 at 2x, as on home. */
const DESKTOP = { width: 1440, height: 900 };

type Product = {
  key: ProductRootKey;
  name: string;
  line: ReactNode;
  status: ReactNode;
  src: string;
  alt: string;
};

/**
 * /work: everything we make, each with where it stands. Our products in
 * home's order, each a small desktop capture, its status, its line and a
 * link to its root; then Index and Funda, coming soon, with their pages
 * here; then the client sites; then the way to the form. Quieter than home:
 * no phones, no bleed, no motion.
 */
export async function WorkIndexPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkIndex" });
  const show = await getTranslations({ locale, namespace: "Showcase" });
  const home = await getTranslations({ locale, namespace: "HomeGrid.projects" });
  const projects = await getTranslations({ locale, namespace: "Projects" });
  const funda = await getTranslations({ locale, namespace: "WorkFunda" });

  const live = <InterfaceStatus>{show("live")}</InterfaceStatus>;

  const products: Product[] = [
    {
      key: "voyager",
      name: "Voyager",
      line: projects("voyager.role"),
      status: live,
      src: `${SHOTS}/voyager/about-desktop-2026-11-12.webp`,
      alt: show("alt.voyagerDesktop"),
    },
    {
      key: "agropulse",
      name: "AgroPulse",
      line: home("agropulse.line"),
      status: live,
      src: `${SHOTS}/agropulse/lens-desktop-2026-11-12.webp`,
      alt: show("alt.agropulseDesktop"),
    },
    {
      key: "radio",
      name: "Radio",
      line: home("radio.line"),
      status: live,
      src: `${SHOTS}/radio/app-desktop-2026-11-12.webp`,
      alt: show("alt.radioDesktop"),
    },
    {
      key: "patchbay",
      name: "PatchBay",
      line: home("patchbay.line"),
      status: live,
      src: `${SHOTS}/patchbay/map-desktop-2026-11-12.webp`,
      alt: show("alt.patchbayDesktop"),
    },
    {
      key: "polis",
      name: "Polis",
      line: (
        <>
          {show("polisLine")} <span className="iface-row__note">{show("polisNote")}</span>
        </>
      ),
      status: <InterfaceStatus tone="test">{show("publicTest")}</InterfaceStatus>,
      src: `${SHOTS}/polis/map-desktop-2026-10-30.webp`,
      alt: show("alt.polisDesktop"),
    },
    {
      key: "midiflow",
      name: "midiflow",
      line: home("midiflow.line"),
      status: live,
      src: `${SHOTS}/midiflow/site-desktop-2026-11-12.webp`,
      alt: show("alt.midiflowDesktop"),
    },
  ];

  // Not open yet: their pages here. Index's is English only, so every
  // locale links straight to /en/index.
  const soon = [
    {
      name: "Index",
      line: home("index.line"),
      status: home("index.status"),
      link: (
        <Link className="iface-link" href="/index" hrefLang={PRODUCT_PAGE_LOCALE} locale={PRODUCT_PAGE_LOCALE}>
          {t("more", { name: "Index" })}
          <IconArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ),
    },
    {
      name: funda("name"),
      line: funda("domain"),
      status: funda("status"),
      link: (
        <Link className="iface-link" href="/work/funda" locale={locale}>
          {t("more", { name: funda("name") })}
          <IconArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-12 sm:pb-12 sm:pt-16">
        <h1 className="type-display">{t("title")}</h1>
        <p className="type-body-lg mt-5">{t("lead")}</p>
      </header>

      <section aria-labelledby="work-products" className="section-shell pb-16 sm:pb-24">
        <h2 className="type-heading" id="work-products">
          {t("productsTitle")}
        </h2>
        <ul className="work-list">
          {products.map((product, index) => (
            <li className="work-item" key={product.key}>
              <div className="iface-screen work-item__shot">
                <Image
                  {...DESKTOP}
                  alt={product.alt}
                  className="iface-screen__image"
                  preload={index === 0}
                  sizes="(min-width: 768px) 22rem, calc(100vw - 3rem)"
                  src={product.src}
                />
              </div>
              <div className="work-item__text">
                <div className="work-item__title">
                  <h3 className="work-item__name">{product.name}</h3>
                  {product.status}
                </div>
                <p className="type-body work-item__line">{product.line}</p>
                <a className="iface-link" href={PRODUCT_ROOTS[product.key]}>
                  {show("open", { name: product.name })}
                  <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </li>
          ))}
        </ul>
        <ul className="work-soon">
          {soon.map((item) => (
            <li className="work-soon__item" key={item.name}>
              <div className="work-item__title">
                <h3 className="work-item__name">{item.name}</h3>
                <InterfaceStatus tone="soon">{item.status}</InterfaceStatus>
              </div>
              <p className="type-body work-item__line">{item.line}</p>
              {item.link}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="work-clients" className="border-t border-rule">
        <div className="section-shell py-16 sm:py-20">
          <h2 className="type-heading mb-8 sm:mb-10" id="work-clients">
            {t("clientsTitle")}
          </h2>
          <ProjectPreviews headingLevel="h3" locale={locale} projects={CLIENT_PROJECTS} />
        </div>
      </section>

      {/* The same way out as every project page: the form on /services. */}
      <section className="border-t border-rule">
        <div className="section-shell flex flex-wrap items-center justify-between gap-6 py-12 sm:py-16">
          <h2 className="type-heading">{t("contactTitle")}</h2>
          <Link className={tactileButtonClasses("primary")} href="/services#start" locale={locale}>
            {t("contact")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
