"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Renders the header everywhere but the home page, which opens on the grid
 * and carries the maker's mark instead. `usePathname` returns the path
 * without the locale, so the home page is "/" in every locale.
 */
export function HeaderGate({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
