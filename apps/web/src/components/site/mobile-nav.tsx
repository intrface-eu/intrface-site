"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Link, usePathname } from "@/i18n/navigation";
import { isNavItemActive, type NavItem } from "@/components/site/site-nav";

export type MobileNavItem = NavItem;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({ items, menuLabel }: { items: readonly NavItem[]; menuLabel: string }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // A route change must not leave a menu open on top of the new page — or, worse,
  // a locked body with nothing covering it.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The panel is a modal layer: it covers the page, so Escape closes it and Tab
  // stays inside it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const stops = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (stops.length === 0) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Scroll lock. The menu only exists below `lg`, where the scrollbar takes no
  // layout width, so hiding overflow costs no reflow.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.overscrollBehavior = previousOverscroll;
    };
  }, [open]);

  // Focus goes into the panel on open and back to the toggle on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const panel = panelRef.current;
      const target = panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
      target?.focus();
      return;
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      toggleRef.current?.focus();
    }
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={menuLabel}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-card text-ink transition-colors hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        onClick={() => setOpen((value) => !value)}
        ref={toggleRef}
        type="button"
      >
        {open ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
      </button>
      {/* Ink scrim, no backdrop-filter: a blur over a full-page layer makes the
          compositor re-read the page behind it every frame. Flat ink at low alpha
          reads as a layer just as well. Escape and the toggle carry the keyboard
          path, so the scrim stays out of the tab order. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-16 bg-ink/50"
            data-mobile-nav-scrim=""
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {open ? (
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            aria-label={menuLabel}
            aria-modal="true"
            // Against the scrim the 12%-alpha rule disappears; the panel needs a
            // slightly firmer bottom edge to read as a trimmed sheet.
            className="absolute inset-x-0 top-full border-b border-ink/20 bg-paper"
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            ref={panelRef}
            role="dialog"
            tabIndex={-1}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <ul className="section-shell grid gap-1 py-4">
              {items.map((item) => {
                const active = isNavItemActive(item, pathname);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none ${
                        active ? "bg-ink/5 text-ink" : "text-ink-muted"
                      }`}
                      href={item.href}
                      onClick={close}
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
