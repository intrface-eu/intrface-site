"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Link, usePathname } from "@/i18n/navigation";
import { isNavItemActive, type NavItem } from "@/components/site/site-nav";

export type MobileNavItem = NavItem;

export function MobileNav({ items, menuLabel }: { items: readonly NavItem[]; menuLabel: string }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  // An open menu covers the page, so Escape has to close it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-label={menuLabel}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-card text-ink transition-colors hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-full border-b border-rule bg-paper shadow-lg"
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <ul className="section-shell grid gap-1 py-4">
              {items.map((item) => {
                const active = isNavItemActive(item, pathname);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-ink/5 ${
                        active ? "bg-ink/5 text-ink" : "text-ink-muted"
                      }`}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
