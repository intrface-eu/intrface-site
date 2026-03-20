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
    { href: "/#contact", label: t("contact") },
  ] as const;

  return (
    <header className="border-b border-rule bg-background/95 backdrop-blur-sm">
      <div className="section-shell flex min-h-18 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label={t("home")}>
            <Image
              src="/brand/intrface-icon-dark.svg"
              alt="Intrface icon"
              width={26}
              height={26}
              priority
            />
            <Image
              src="/brand/intrface-logo-text-dark.svg"
              alt="Intrface"
              width={122}
              height={22}
              priority
              className="h-auto w-[122px]"
            />
          </Link>

          <div className="sm:hidden">
            <LocaleSwitcher />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 sm:gap-7">
          <nav className="flex items-center gap-5 sm:gap-7">
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

          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
