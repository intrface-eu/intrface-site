import { InterfaceGrid } from "@/components/home/grid/interface-grid";
import type { AppLocale } from "@/i18n/routing";

/**
 * The home page: one sentence on the veil over the interfaces, then the
 * footer. No header, no ground. See docs/home-grid-contract.md.
 */
export function HomePage({ locale }: { locale: AppLocale }) {
  return (
    <main className="text-ink">
      <InterfaceGrid locale={locale} />
    </main>
  );
}
