import { getTranslations } from "next-intl/server";
import { AnimatedMark } from "@/components/site/animated-mark";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

/**
 * The maker's mark for the home page, which has no header: the mark and the
 * word, fixed top-left on the ground in the strip the grid leaves above
 * itself, where the ground quiets its lines. The locale switcher lives in the
 * footer. See `.maker-mark` in globals.css.
 */
export async function MakerMark({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomeGrid.common" });

  return (
    <Link aria-label={t("makerMark")} className="maker-mark" data-ground-quiet="" href="/">
      {/* Decorative: the link carries its own accessible name. */}
      <AnimatedMark className="text-ink" size={22} />
      <span className="maker-mark__word">intrface</span>
    </Link>
  );
}
