"use client";

import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = {
  href: string;
  label: string;
  /**
   * Route prefix that marks this link as current. Omit for links that point at a
   * section of a page another link already owns (e.g. Contact on /about).
   */
  match?: string;
};

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (!item.match) return false;
  if (item.match === "/") return pathname === "/";
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}

export function SiteNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {items.map((item) => {
        const active = isNavItemActive(item, pathname);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`relative text-sm font-medium tracking-[-0.01em] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-accent after:transition-opacity ${
              active ? "text-ink after:opacity-100" : "text-ink-muted after:opacity-0 hover:text-ink"
            }`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
