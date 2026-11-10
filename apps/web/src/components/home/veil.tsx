import { getTranslations } from "next-intl/server";
import { ClaimCycle, type ClaimLine, type ClaimWord } from "@/components/home/claim-cycle";
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

const ROLE_TAG = /^(.*?)<(tech|meaning)>(.*?)<\/\2>(.*)$/;

/**
 * The sentence as words. In the message, `<tech>` and `<meaning>` mark the
 * word for technology and the word for meaning in each language, so the
 * motion can treat them apart (see `ClaimCycle`); the tags never reach the
 * text.
 */
function claimWords(raw: string): ClaimWord[] {
  return raw.split(" ").map((token) => {
    const match = ROLE_TAG.exec(token);
    if (!match) return { text: token };
    const [, before, role, inner, after] = match;
    return { text: before + inner + after, role: role as ClaimWord["role"] };
  });
}

/**
 * The first screen of the home page: black, carrying the maker's mark and the
 * one sentence (the page's `h1`). The sentence cycles through the rotation's
 * languages, starting from the page's own (see `cycleOrder` and
 * `ClaimCycle`). It scrolls away with the page into the interfaces; see
 * `.home-veil` in `globals.css` and docs/home-grid-contract.md.
 */
export async function Veil({ locale }: { locale: AppLocale }) {
  const order = cycleOrder(locale);
  const t = await getTranslations({ locale, namespace: "Showcase" });

  const lines: ClaimLine[] = await Promise.all(
    order.map(async (lineLocale) => {
      const t = await getTranslations({ locale: lineLocale, namespace: "HomeGrid.common" });

      const words = claimWords(t.raw("claim") as string);

      return {
        locale: lineLocale,
        name: LOCALE_ENDONYMS[lineLocale],
        claim: words.map((word) => word.text).join(" "),
        words,
        // A locale still waiting for its translation falls back to its own name.
        switchLocale: t.has("switchLocale") ? t("switchLocale") : LOCALE_ENDONYMS[lineLocale],
      };
    }),
  );

  return (
    <div className="home-veil">
      <div className="section-shell home-veil__shell">
        <MakerMark locale={locale} />
        <ClaimCycle lines={lines} label={t("languages")} />
      </div>
    </div>
  );
}
