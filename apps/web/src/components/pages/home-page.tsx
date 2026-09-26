import { Veil } from "@/components/home/veil";
import { WorkTiles } from "@/components/home/work-tiles";
import type { AppLocale } from "@/i18n/routing";

/**
 * The home page: one sentence on the veil, then the work, then the footer
 * (from the layout). No header, no ground. See docs/home-grid-contract.md.
 */
export function HomePage({ locale }: { locale: AppLocale }) {
  return (
    <main className="text-ink">
      <div className="home-stage">
        <Veil locale={locale} />
        <WorkTiles locale={locale} />
      </div>
    </main>
  );
}
