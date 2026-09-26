import { getTranslations } from "next-intl/server";
import { MakerMark } from "@/components/layout/maker-mark";
import type { AppLocale } from "@/i18n/routing";

/**
 * The veil over the top of the home page: ink, solid at the top and fading
 * to nothing, carrying the maker's mark and the one sentence (the page's
 * `h1`). Its scroll-driven lift lives in `globals.css` under `.home-veil`.
 * See docs/home-grid-contract.md.
 */
export async function Veil({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid" });

  return (
    /* The veil: ink over the top of the work, fading to nothing. It takes
       no pointer events but on its solid band and the logo, so a click or
       a wheel where it has faded reaches the tile under it. */
    <div className="home-veil">
      <div className="section-shell home-veil__shell">
        <MakerMark locale={locale} />
        <h1 className="type-display home-veil__claim">{t("common.claim")}</h1>
      </div>
    </div>
  );
}
