import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";

export async function Header() {
  const t = await getTranslations("Nav");

  const navigation = [
    { href: "/#projects", label: t("projects") },
    { href: "/aoc", label: t("aoc") },
    { href: "/voyager", label: t("voyager") },
    { href: "/funda", label: t("funda") },
    { href: "/#contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-background/95 backdrop-blur-sm">
      <div className="section-shell flex min-h-18 flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label={t("home")}>
            <Image
              src="/brand/intrface-icon.svg"
              alt="Intrface icon"
              width={26}
              height={26}
              priority
            />
            <span className="text-2xl font-medium tracking-[-0.04em] text-foreground">intrface</span>
          </Link>

          <div className="lg:hidden">
            <LocaleSwitcher />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 lg:gap-7">
          <nav className="flex flex-wrap items-center gap-5 lg:gap-7">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-[-0.01em] text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
