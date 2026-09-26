"use client";

import { IconArrowRight, IconArrowUpRight, IconX } from "@tabler/icons-react";
import {
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";
import type { Tone } from "@/lib/site/interfaces";
import type { OpenableCopy, ShellLabels } from "./interface-shell";

type ElementRef<T> = (element: T | null) => void;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type InterfaceCellProps = {
  slug: string;
  tone: Tone;
  copy: OpenableCopy;
  labels: ShellLabels;
  expanded: boolean;
  /** A touch inside this cell was the last touch in the grid. */
  revealed: boolean;
  onOpen: () => void;
  onClose: () => void;
  onTouch: () => void;
  ref: ElementRef<HTMLElement>;
  surfaceRef: ElementRef<HTMLDivElement>;
  openRef: ElementRef<HTMLButtonElement>;
  closeRef: ElementRef<HTMLButtonElement>;
  children: ReactNode;
};

/**
 * One cell of the home grid. At rest it is only its fragment: the region
 * carries the name for assistive tech, and the foot row (name, line, Open)
 * shows on hover, on focus inside the cell, or after a touch in it. Its
 * height is reserved on every pointer as `--cell-chrome-bottom`, and the row
 * takes no pointer events; only its button does.
 *
 * Expanded, the surface is a modal dialog over the viewport with a thin top
 * band: the name and line, Live site and The project where they apply, and
 * the close mark. The band's measured height is `--cell-chrome-top` for the
 * fragment. The shell (`InterfaceShell`) owns the open state, the motion and
 * the URL; this component draws the cell and traps focus while open.
 */
export function InterfaceCell({
  slug,
  tone,
  copy,
  labels,
  expanded,
  revealed,
  onOpen,
  onClose,
  onTouch,
  ref,
  surfaceRef,
  openRef,
  closeRef,
  children,
}: InterfaceCellProps) {
  const nameId = useId();
  const surface = useRef<HTMLDivElement | null>(null);
  const band = useRef<HTMLElement>(null);

  // The band may wrap to two rows on a narrow screen; the fragment keeps
  // clear of whatever height it takes.
  useLayoutEffect(() => {
    const bandEl = band.current;
    const surfaceEl = surface.current;
    if (!expanded || !bandEl || !surfaceEl) return;
    const write = () =>
      surfaceEl.style.setProperty("--cell-chrome-top", `${bandEl.getBoundingClientRect().height}px`);
    write();
    const observer = new ResizeObserver(write);
    observer.observe(bandEl);
    return () => {
      observer.disconnect();
      surfaceEl.style.removeProperty("--cell-chrome-top");
    };
  }, [expanded]);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") onTouch();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!expanded) return;
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !surface.current) return;
    // Wrap focus inside the dialog; the rest of the page is inert as well.
    const focusable = Array.from(surface.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.getClientRects().length > 0,
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <section
      aria-label={copy.name}
      className="interface-cell"
      data-expanded={expanded ? "" : undefined}
      data-revealed={revealed ? "" : undefined}
      data-slug={slug}
      onPointerDownCapture={onPointerDown}
      ref={ref}
    >
      {/* The tone goes on the surface, not the cell: `.tone-ink` paints a
          background, and the surface is what becomes the dialog. */}
      <div
        aria-labelledby={expanded ? nameId : undefined}
        aria-modal={expanded ? true : undefined}
        className={`interface-cell__surface${tone === "ink" ? " tone-ink" : ""}`}
        onKeyDown={onKeyDown}
        ref={(element) => {
          surface.current = element;
          surfaceRef(element);
        }}
        role={expanded ? "dialog" : undefined}
      >
        {expanded ? (
          <header className="interface-cell__band" ref={band}>
            <div className="interface-cell__title">
              <h2 className="type-meta interface-cell__band-name" id={nameId}>
                {copy.name}
              </h2>
              <p className="type-caption interface-cell__band-line">{copy.line}</p>
            </div>
            {copy.liveUrl || copy.href ? (
              <div className="interface-cell__band-actions">
                {copy.liveUrl ? (
                  <a
                    className="type-caption interface-cell__action"
                    href={copy.liveUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {labels.liveSite}
                    <span className="sr-only"> ({labels.newTab})</span>
                    <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                ) : null}
                {copy.href ? (
                  <Link className="type-caption interface-cell__action" href={copy.href}>
                    {labels.theProject}
                    <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            ) : null}
            <button
              aria-label={labels.close}
              className="interface-cell__close"
              onClick={onClose}
              ref={closeRef}
              type="button"
            >
              <IconX aria-hidden="true" className="h-5 w-5" stroke={1.75} />
            </button>
          </header>
        ) : null}

        <div className="interface-cell__fragment">{children}</div>

        {/* The foot row: name, line, Open. A long line ends in an ellipsis on
            screen and is read whole by assistive tech. */}
        <div className="interface-cell__foot">
          <p className="type-caption interface-cell__label">
            <span className="interface-cell__name">{copy.name}</span>{" "}
            <span className="interface-cell__line">{copy.line}</span>
          </p>
          <button
            aria-label={copy.openName}
            className="type-caption interface-cell__open"
            onClick={onOpen}
            ref={openRef}
            type="button"
          >
            {labels.open}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
