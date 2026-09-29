import Image from "next/image";
import { IconArrowLeft } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { DESKTOP_CAPTURE, MOBILE_CAPTURE } from "@/lib/site/projects";

const textLink =
  "type-caption inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

/**
 * Patchbay's About page, while it is not open yet: its mark, name, one line
 * ("Creative collaboration"), "Coming soon" and the capture of its landing.
 * The home tile opens it. Nothing else until release: no address, no
 * features, no people, no source.
 */
export async function PatchbayPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "WorkIndex.entries.patchbay" });
  const grid = await getTranslations({ locale, namespace: "HomeGrid.common" });
  const name = t("name");

  return (
    <main className="bg-paper text-ink">
      <header className="section-shell pb-10 pt-10 sm:pb-12 sm:pt-14">
        <Link className={textLink} href="/" locale={locale}>
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
          {grid("backToGrid")}
        </Link>
        <div className="mt-8 flex items-center gap-4 sm:gap-5">
          {/* Patchbay's mark is drawn in paper for dark grounds, so it sits
              on an ink plate. Decorative: the heading names it. */}
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-ink sm:h-14 sm:w-14">
            <Image
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8"
              height={32}
              priority
              src="/proof/projects/patchbay/logo.svg"
              unoptimized
              width={32}
            />
          </span>
          <h1 className="type-display">{name}</h1>
        </div>
        <p className="type-body-lg mt-5">{t("interface")}</p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-rule bg-white/72 px-3.5 py-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-ink-muted" />
          <span className="type-caption">{t("status")}</span>
        </p>
      </header>

      <div className="section-shell project-detail-layout pb-16 sm:pb-24">
        <Image
          alt={name}
          className="project-capture"
          {...DESKTOP_CAPTURE}
          priority
          sizes="(min-width: 1280px) 840px, (min-width: 1024px) 68vw, calc(100vw - 3rem)"
          src="/proof/projects/patchbay/desktop.webp"
        />
        <Image
          alt=""
          className="project-capture project-mobile-figure"
          {...MOBILE_CAPTURE}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 320px, calc(100vw - 5rem)"
          src="/proof/projects/patchbay/mobile.webp"
        />
      </div>
    </main>
  );
}
