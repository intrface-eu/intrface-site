import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AnimatedMark } from "@/components/site/animated-mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { MobileNav } from "@/components/site/mobile-nav";
import { SiteNav, type NavItem } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  const navigation: readonly NavItem[] = [
    { href: "/work", label: t("work"), match: "/work" },
    { href: "/method", label: t("method"), match: "/method" },
    { href: "/about", label: t("about"), match: "/about" },
    { href: "/about#contact", label: t("contact") },
  ];

  // The bar carries no backdrop-filter on purpose: it is a sticky, full-width
  // layer, so a blur makes the compositor re-read and re-blur everything behind
  // it on every scroll frame. At 97% paper there is nothing legible to blur.
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/97">
      <div className="section-shell relative flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={t("home")}>
          {/* Decorative: the link already carries its own accessible name. */}
          <AnimatedMark className="text-ink" size={26} />
          <span className="text-xl font-medium tracking-[-0.04em] text-ink">intrface</span>
        </Link>

        <SiteNav items={navigation} />

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <MobileNav items={navigation} menuLabel={t("menu")} />
        </div>
      </div>
    </header>
  );
}
