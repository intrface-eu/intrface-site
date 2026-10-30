import { HomeInterfaces } from "@/components/home/home-interfaces";
import { Veil } from "@/components/home/veil";
import type { AppLocale } from "@/i18n/routing";

/**
 * The home page: the one sentence on a black first screen, then our
 * interfaces on paper, then the footer (from the layout). No header. See
 * docs/home-grid-contract.md.
 */
export function HomePage({ locale }: { locale: AppLocale }) {
  return (
    <main className="home text-ink">
      <Veil locale={locale} />
      <HomeInterfaces locale={locale} />
    </main>
  );
}
