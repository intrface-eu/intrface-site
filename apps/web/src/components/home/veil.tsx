import { getTranslations } from "next-intl/server";
import { ClaimCycle, type ClaimLine } from "@/components/home/claim-cycle";
import { MakerMark } from "@/components/layout/maker-mark";
import type { AppLocale } from "@/i18n/routing";
import { LOCALE_ENDONYMS } from "@/lib/site/locale-names";

/**
 * The owner's rotation of the sentence. Italian is not in it: it is written
 * for business clients in Italy and shows only on its own page.
 */
const ROTATION = ["en", "hr", "vec", "ckm"] as const satisfies readonly AppLocale[];

/**
 * The lines of the sentence in the order a page cycles them, its own first.
 * On a page in the rotation, the rotation turned to start there (on `/hr`:
 * hr, vec, ckm, en). On `/it`, Italian and then the whole rotation.
 */
function cycleOrder(locale: AppLocale): AppLocale[] {
  const start = ROTATION.indexOf(locale as (typeof ROTATION)[number]);
  if (start === -1) return [locale, ...ROTATION];
  return [...ROTATION.slice(start), ...ROTATION.slice(0, start)];
}

/**
 * The veil over the top of the home page: black, solid at the top and fading
 * to nothing, carrying the maker's mark and the one sentence (the page's
 * `h1`). The sentence cycles through the rotation's languages, starting from
 * the page's own (see `cycleOrder` and `ClaimCycle`). The veil scrolls away
 * at page speed over the pinned bento; see `.home-veil` in `globals.css` and
 * docs/home-grid-contract.md.
 */
export async function Veil({ locale }: { locale: AppLocale }) {
  const order = cycleOrder(locale);

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
