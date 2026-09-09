import Image from "next/image";
import { IconArrowLeft, IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import {
  DESKTOP_CAPTURE,
  MOBILE_CAPTURE,
  PROJECTS,
  SELECTED_PROJECTS,
  type ProjectKey,
} from "@/lib/site/projects";

const textLink = "type-caption inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export async function ProjectShowcase({ locale, projectKey }: {
  locale: AppLocale;
  projectKey: ProjectKey;
}) {
  const t = await getTranslations({ locale, namespace: "Projects" });
  const project = PROJECTS[projectKey];
  const nextKey = SELECTED_PROJECTS[(SELECTED_PROJECTS.indexOf(projectKey) + 1) % SELECTED_PROJECTS.length];
  const next = PROJECTS[nextKey];

  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-10 sm:pb-12 sm:pt-14">
        <Link className={textLink} href="/work" locale={locale}>
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t("allWork")}
        </Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h1 className="type-display">{project.name}</h1>
            <p className="type-body-lg mt-4">{t(`${projectKey}.role`)}</p>
          </div>
          <a className={textLink} href={project.liveUrl} rel="noopener noreferrer" target="_blank">
            {t("visitSite")}
            <span className="sr-only">({t("newTab")})</span>
            <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="section-shell">
        <figure>
          <Image
            alt={t(`${projectKey}.desktopAlt`)}
            className="project-capture"
            {...DESKTOP_CAPTURE}
            priority
            sizes="(min-width: 1280px) 1200px, calc(100vw - 3rem)"
            src={project.desktop}
          />
          <figcaption className="type-caption mt-4">{t(`${projectKey}.desktopCaption`)}</figcaption>
        </figure>

        <section className="project-overview py-16 sm:py-20">
          <h2 className="type-heading">{t("overview")}</h2>
          <p className="type-body-lg">{t(`${projectKey}.overview`)}</p>
        </section>

        <div className="project-detail-layout pb-16 sm:pb-24">
          <figure>
            <Image
              alt={t(`${projectKey}.detailAlt`)}
              className="project-capture"
              {...DESKTOP_CAPTURE}
              sizes="(min-width: 1280px) 840px, (min-width: 1024px) 68vw, calc(100vw - 3rem)"
              src={project.detail}
            />
            <figcaption className="type-caption mt-4">{t(`${projectKey}.detailCaption`)}</figcaption>
          </figure>
          <figure className="project-mobile-figure">
            <Image
              alt={t(`${projectKey}.mobileAlt`)}
              className="project-capture"
              {...MOBILE_CAPTURE}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 320px, calc(100vw - 5rem)"
              src={project.mobile}
            />
            <figcaption className="type-caption mt-4">{t(`${projectKey}.mobileCaption`)}</figcaption>
          </figure>
        </div>
      </div>

      <section className="border-t border-rule">
        <div className="section-shell flex flex-wrap items-center justify-between gap-6 py-12 sm:py-16">
          <h2 className="type-heading">{t("contactTitle")}</h2>
          <Link
            className={tactileButtonClasses("primary")}
            href={projectKey === "voyager" ? "/about#contact" : "/about?topic=client-site#contact"}
            locale={locale}
          >
            {t("contact")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <nav aria-label={t("projectNavigation")} className="border-t border-rule">
        <div className="section-shell flex flex-wrap items-end justify-between gap-8 py-10 sm:py-12">
          <Link className={textLink} href="/work" locale={locale}>
            <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
            {t("allWork")}
          </Link>
          <Link className="project-next-link" href={next.href} locale={locale}>
            <span className="type-caption">{t("nextProject")}</span>
            <span className="type-subheading flex items-center gap-3 text-ink">
              {next.name}<IconArrowRight aria-hidden="true" className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
