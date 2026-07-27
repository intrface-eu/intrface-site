import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { AOC_REPO_URL, CONTACT_EMAIL, SITE_NAME } from "@/lib/site/config";

export async function Footer({ locale }: { locale: AppLocale }) {
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const footer = await getTranslations({ locale, namespace: "Footer" });

  const navigation = [
    { href: "/work", label: nav("work") },
    { href: "/method", label: nav("method") },
    { href: "/about", label: nav("about") },
    { href: "/imprint", label: nav("imprint") },
  ] as const;

  return (
    <footer className="border-t border-rule bg-paper text-ink">
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/intrface-icon.svg" alt="" width={20} height={20} />
            <span className="text-lg font-medium tracking-[-0.04em] text-ink">intrface</span>
          </div>
          <p className="type-body mt-4 max-w-sm text-sm leading-6">{footer("tagline")}</p>
          <a
            className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
            {navigation.map((item) => (
              <Link
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            href={AOC_REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            {footer("aocLink")}
            <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="section-shell">
        <div className="flex flex-col gap-2 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="type-meta">{footer("location")}</p>
        </div>
      </div>
    </footer>
  );
}
