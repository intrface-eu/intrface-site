import { getTranslations } from "next-intl/server";
import { ClaimCycle, type ClaimLine } from "@/components/home/claim-cycle";
import { MakerMark } from "@/components/layout/maker-mark";
import { routing, type AppLocale } from "@/i18n/routing";
import { LOCALE_ENDONYMS } from "@/lib/site/locale-names";

/**
 * The veil over the top of the home page: black, solid at the top and fading
 * to nothing, carrying the maker's mark and the one sentence (the page's
 * `h1`). The sentence cycles through the four site languages, starting from
 * the page's own; see `ClaimCycle`. The veil scrolls away at page speed over
 * the pinned bento; see `.home-veil` in `globals.css` and
 * docs/home-grid-contract.md.
 */
export async function Veil({ locale }: { locale: AppLocale }) {
  // The fixed order en, hr, vec, ckm, turned so the page's own line comes first.
  const start = routing.locales.indexOf(locale);
  const order = [...routing.locales.slice(start), ...routing.locales.slice(0, start)];

  const lines: ClaimLine[] = await Promise.all(
    order.map(async (lineLocale) => {
      const t = await getTranslations({ locale: lineLocale, namespace: "HomeGrid.common" });

      return {
        locale: lineLocale,
        claim: t("claim"),
        // A locale still waiting for its translation falls back to its own name.
        switchLocale: t.has("switchLocale") ? t("switchLocale") : LOCALE_ENDONYMS[lineLocale],
      };
    }),
  );

  return (
    /* The veil: black over the top of the work, fading to nothing. It takes
       no pointer events but on its solid band, the logo and the sentence, so
       a click or a wheel where it has faded reaches the tile under it. */
    <div className="home-veil">
      <div className="section-shell home-veil__shell">
        <MakerMark locale={locale} />
        <ClaimCycle lines={lines} />
      </div>
    </div>
  );
}
