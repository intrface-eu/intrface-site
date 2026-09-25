import { Ground } from "@/components/home/ground";
import { InterfaceGrid } from "@/components/home/grid/interface-grid";
import { MakerMark } from "@/components/layout/maker-mark";
import type { AppLocale } from "@/i18n/routing";

/**
 * The home page is interaction first: no header, no claim, no menu. The grid
 * of interface cells fills the first screen, the maker's mark sits in the
 * corner, and the footer closes the page. See docs/home-grid-contract.md.
 */
export function HomePage({ locale }: { locale: AppLocale }) {
  return (
    <>
      <MakerMark locale={locale} />

      {/* Three things this element must not do. It must not create a stacking
          context (no `isolate`, no `z-index`, no `opacity`): the ground's
          negative z-index has to reach the root context, and isolated here the
          fixed ground covers the footer. It must not take a `transform` or a
          `filter`, either of which makes it the containing block for the fixed
          ground, so the ground stops being fixed. And it carries no
          background: the ground paints the paper under this page. */}
      <main className="ground-main text-ink">
        <Ground />
        <InterfaceGrid locale={locale} />
      </main>
    </>
  );
}
