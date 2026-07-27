import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="section-shell relative flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={t("home")}>
          <Image
            src="/brand/intrface-icon.svg"
            alt={t("logoAlt")}
            width={26}
            height={26}
            priority
          />
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
