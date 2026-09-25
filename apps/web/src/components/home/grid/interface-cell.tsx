"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { useCallback, useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { Link, useRouter } from "@/i18n/navigation";

/** The expansion's length; `.interface-cell[data-expanding]` runs the same. */
const EXPAND_MS = 380;

export type InterfaceCellProps = {
  slug: string;
  area: string;
  tone: "paper" | "ink";
  name: string;
  line: string;
  status?: string;
  href?: string;
  liveUrl?: string;
  labels: {
    open: string;
    /** "Open {name}", already formatted: the Open link's accessible name. */
    openName: string;
    liveSite: string;
    newTab: string;
  };
  children: ReactNode;
};

/**
 * One cell of the home grid: the cut surface, the name in its corner, the
 * foot row (the line, Open and Live site) that shows on hover or focus, and
 * always on a coarse pointer.
 *
 * The fragment is a child and nothing wraps it: its controls stay reachable by
 * pointer and keyboard, and only the Open link navigates.
 *
 * Open runs the expansion. The cell takes one transform that carries it from
 * its grid position onto the viewport, the foot row fades, and the route
 * changes when the transform ends. The scale is uniform, so type never
 * stretches: the cell grows until it covers the viewport on both axes and is
 * centred on it, and the viewport clips the overshoot on the longer axis. JavaScript measures the cell once, on the click,
 * and writes one style; the compositor does the rest. Under reduced motion,
 * or for a click that opens a new tab, the link navigates as any link does.
 */
export function InterfaceCell({
  slug,
  area,
  tone,
  name,
  line,
  status,
  href,
  liveUrl,
  labels,
  children,
}: InterfaceCellProps) {
  const router = useRouter();
  const cellRef = useRef<HTMLElement>(null);
  const timer = useRef(0);
  const prefetched = useRef(false);
  const nameId = useId();

  // Put the cell back if the page is left or hidden mid-expansion, so a return
  // to the grid never finds a cell still covering the viewport.
  useEffect(() => {
    const cell = cellRef.current;
    return () => {
      window.clearTimeout(timer.current);
      if (!cell) return;
      delete cell.dataset.expanding;
      cell.style.removeProperty("transform");
    };
  }, []);

  const prefetch = useCallback(() => {
    if (!href || prefetched.current) return;
    prefetched.current = true;
    router.prefetch(href);
  }, [href, router]);

  const onOpen = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const cell = cellRef.current;
      if (!href || !cell) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      if (cell.dataset.expanding !== undefined) return;

      const rect = cell.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      // Uniform scale that covers the viewport; the translate centres the
      // scaled cell on it (the origin is the cell's top-left corner).
      const scale = Math.max(width / rect.width, height / rect.height);
      const x = (width - rect.width * scale) / 2 - rect.left;
      const y = (height - rect.height * scale) / 2 - rect.top;
      cell.dataset.expanding = "";
      cell.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      timer.current = window.setTimeout(() => router.push(href), EXPAND_MS);
    },
    [href, router],
  );

  return (
    <article
      aria-labelledby={nameId}
      className="interface-cell"
      data-slug={slug}
      data-tone={tone}
      onPointerEnter={href ? prefetch : undefined}
      ref={cellRef}
      style={{ gridArea: area }}
    >
      {/* The tone goes on the surface, not the cell: `.tone-ink` paints a
          background, and only the surface is cut. */}
      <div className={`interface-cell__surface${tone === "ink" ? " tone-ink" : ""}`}>
        <header className="interface-cell__corner">
          <h2 className="type-meta interface-cell__name" id={nameId}>
            {name}
          </h2>
          {status ? <p className="type-meta interface-cell__status">{status}</p> : null}
        </header>

        <div className="interface-cell__fragment">{children}</div>

        {/* The foot row: the line, then Open and Live site. The row takes no
            pointer events; only its links do. A long line ends in an ellipsis
            on screen and is read whole by assistive tech. */}
        <div className="interface-cell__foot">
          <p className="type-caption interface-cell__line">{line}</p>
          {href || liveUrl ? (
            <div className="interface-cell__actions">
              {href ? (
                <Link
                  aria-label={labels.openName}
                  className="type-caption interface-cell__open"
                  href={href}
                  onClick={onOpen}
                  onFocus={prefetch}
                  prefetch={false}
                >
                  {labels.open}
                  <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
              {liveUrl ? (
                <a
                  className="type-caption interface-cell__live"
                  href={liveUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {labels.liveSite}
                  <span className="sr-only"> ({labels.newTab})</span>
                  <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
