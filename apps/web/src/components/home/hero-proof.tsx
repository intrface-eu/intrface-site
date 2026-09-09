import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  DESKTOP_CAPTURE,
  PROJECTS,
  SELECTED_PROJECTS,
  type ProjectKey,
} from "@/lib/site/projects";

/** Actual work on continuous paper. Every preview has one showcase destination. */
export async function ProjectPreviews({
  locale,
  projects = SELECTED_PROJECTS,
  priority = false,
}: {
  locale: AppLocale;
  projects?: readonly ProjectKey[];
  priority?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "Projects" });

  return (
    <div className="project-previews">
      {projects.map((key, index) => {
        const project = PROJECTS[key];
        return (
          <Link className="project-preview" href={project.href} key={key} locale={locale}>
            <Image
              alt={t(`${key}.desktopAlt`)}
              className="project-preview-image"
              {...DESKTOP_CAPTURE}
              priority={priority && index === 0}
              sizes="(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 8rem) / 3), (min-width: 640px) calc((100vw - 5.5rem) / 2), calc(100vw - 3rem)"
              src={project.desktop}
            />
            <div className="project-preview-caption">
              <div>
                <h2 className="type-subheading text-ink">{project.name}</h2>
                <p className="type-body-sm mt-2">{t(`${key}.role`)}</p>
              </div>
              <span className="type-caption project-preview-action">
                {t("viewProject")}
                <IconArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
