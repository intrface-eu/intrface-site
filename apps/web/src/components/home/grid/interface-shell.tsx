"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { hashFor, targetForHash, type CellSlug, type Tone } from "@/lib/site/interfaces";
import { FRAGMENTS } from "./fragment-registry";
import { InterfaceCell } from "./interface-cell";

/** A cell's copy, resolved on the server. */
export type OpenableCopy = {
  name: string;
  line: string;
  /** "Open {name}", already formatted: the Open button's accessible name. */
  openName: string;
  href?: string;
  liveUrl?: string;
};

export type ShellLabels = {
  open: string;
  close: string;
  liveSite: string;
  theProject: string;
  newTab: string;
};

export type CellEntry = { slug: CellSlug; tone: Tone; copy: OpenableCopy };

/** Open and collapse run this long, on the house easing. */
const DURATION = 420;
const EASING = "cubic-bezier(0.2, 0.8, 0.3, 1)";
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The cell's rectangle as it sits in the grid, in viewport pixels: the clip
 * the expanded surface (fixed, full viewport) starts from and collapses to.
 * A polygon, like `FULL`, so the two interpolate point by point.
 */
function restingClip(cell: HTMLElement): string {
  const { left, top, right, bottom } = cell.getBoundingClientRect();
  return `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`;
}

/** The `history.state` key an entry keeps its distance to the grid under. */
const DEPTH_KEY = "intrfaceGridDepth";

const samePath = (a: string, b: string) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

/**
 * The home grid's client side: which cell is open, and which cell a touch
 * last revealed.
 *
 * Open in place. The open cell's surface becomes a fixed, full-viewport
 * dialog while the cell keeps its grid slot, so nothing reflows. The move is
 * one clip-path animation of that full-size surface, from the cell's rectangle to
 * the viewport and back; JavaScript measures the cell once and hands both
 * ends to the Web Animations API, so no React state changes per frame, and
 * nothing is scaled. Under reduced motion it opens and closes at once.
 *
 * The URL. Opening from the grid pushes `#<hash>`; closing goes back to the
 * grid's entry when this session knows how far that is, and clears the hash
 * with `replaceState` otherwise (a page loaded with the hash). Switching from
 * one open interface to another (an Index result is a `/#slug` link)
 * replaces the entry. `popstate` and `hashchange` open, switch and close; a
 * typed hash adds an entry, which is counted. A load with a known hash opens
 * it at once. The pathname never changes, so `HeaderGate` still sees home.
 */
export function InterfaceShell({ cells, labels }: { cells: CellEntry[]; labels: ShellLabels }) {
  const [open, setOpen] = useState<CellSlug | null>(null);
  const [touched, setTouched] = useState<CellSlug | null>(null);

  const openRef = useRef<CellSlug | null>(null);
  /**
   * How many history entries the current one sits above the grid's own
   * entry, as far as this session knows; 0 when it does not know (a load
   * with a hash). Each entry carries its count in `history.state`.
   */
  const depth = useRef(0);
  /** A close has asked history to go back and `popstate` has not come yet. */
  const goingBack = useRef(false);
  const animation = useRef<Animation | null>(null);
  /** The clip the next open starts from; null opens at once. */
  const openFrom = useRef<string | null>(null);
  const cellEls = useRef(new Map<CellSlug, HTMLElement>());
  const surfaceEls = useRef(new Map<CellSlug, HTMLElement>());
  const openButtons = useRef(new Map<CellSlug, HTMLButtonElement>());
  const closeButtons = useRef(new Map<CellSlug, HTMLButtonElement>());

  useLayoutEffect(() => {
    openRef.current = open;
  });

  /** Stops a running open or collapse where it is, without its ending. */
  const stopAnimation = useCallback(() => {
    const running = animation.current;
    animation.current = null;
    running?.cancel();
    for (const surface of surfaceEls.current.values()) delete surface.dataset.closing;
  }, []);

  const expand = useCallback(
    (slug: CellSlug, animate: boolean) => {
      stopAnimation();
      const cell = cellEls.current.get(slug);
      openFrom.current = animate && cell && !reducedMotion() ? restingClip(cell) : null;
      openRef.current = slug;
      setOpen(slug);
    },
    [stopAnimation],
  );

  /** From one open interface straight to another: no motion, the viewport stays covered. */
  const switchTo = useCallback(
    (slug: CellSlug) => {
      stopAnimation();
      openFrom.current = null;
      openRef.current = slug;
      setOpen(slug);
    },
    [stopAnimation],
  );

  const collapse = useCallback(
    (animate: boolean) => {
      const slug = openRef.current;
      if (!slug) return;
      // `popstate` and `hashchange` both report one Back; close once.
      if (surfaceEls.current.get(slug)?.dataset.closing !== undefined) return;
      stopAnimation();
      const finish = () => {
        openRef.current = null;
        flushSync(() => setOpen(null));
        openButtons.current.get(slug)?.focus({ preventScroll: true });
      };
      const cell = cellEls.current.get(slug);
      const surface = surfaceEls.current.get(slug);
      if (!animate || !cell || !surface || reducedMotion()) {
        finish();
        return;
      }
      surface.dataset.closing = "";
      const running = surface.animate([{ clipPath: FULL }, { clipPath: restingClip(cell) }], {
        duration: DURATION,
        easing: EASING,
        fill: "forwards",
      });
      animation.current = running;
      running.finished.then(
        () => {
          if (animation.current !== running) return;
          animation.current = null;
          delete surface.dataset.closing;
          finish();
          // The surface is back in its slot; its own clip takes over.
          running.cancel();
        },
        () => {},
      );
    },
    [stopAnimation],
  );

  // The open itself: after the surface has become the full-viewport dialog
  // and before it paints, start it clipped to the cell's rectangle.
  useLayoutEffect(() => {
    const from = openFrom.current;
    openFrom.current = null;
    if (!open || !from) return;
    const surface = surfaceEls.current.get(open);
    if (!surface) return;
    const running = surface.animate([{ clipPath: from }, { clipPath: FULL }], {
      duration: DURATION,
      easing: EASING,
    });
    animation.current = running;
    running.finished.then(
      () => {
        if (animation.current === running) animation.current = null;
      },
      () => {},
    );
  }, [open]);

  // While a cell is open: the page under it is inert and does not scroll,
  // and focus is inside the dialog.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.interfaceOpen = "";
    const madeInert: Element[] = [];
    for (let node: Element | null = cellEls.current.get(open) ?? null; node && node !== document.body; node = node.parentElement) {
      for (const sibling of Array.from(node.parentElement?.children ?? [])) {
        if (sibling === node || sibling.hasAttribute("inert") || sibling instanceof HTMLScriptElement) continue;
        sibling.setAttribute("inert", "");
        madeInert.push(sibling);
      }
    }
    closeButtons.current.get(open)?.focus({ preventScroll: true });
    return () => {
      delete root.dataset.interfaceOpen;
      for (const element of madeInert) element.removeAttribute("inert");
    };
  }, [open]);

  // Open the interface the URL names on load, before the first paint. The
  // URL is outside React and unknown on the server, so the first render is
  // always the grid; this corrects it before the first paint.
  useLayoutEffect(() => {
    const target = targetForHash(window.location.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) expand(target, false);
  }, [expand]);

  /** Go to a cell the page asked for: open it from the grid, or switch to it. */
  const goTo = useCallback(
    (target: CellSlug) => {
      const hash = `#${hashFor(target)}`;
      const current = openRef.current;
      if (!current) {
        depth.current += 1;
        window.history.pushState({ [DEPTH_KEY]: depth.current }, "", hash);
        expand(target, true);
        return;
      }
      window.history.replaceState({ [DEPTH_KEY]: depth.current }, "", hash);
      if (current !== target) switchTo(target);
    },
    [expand, switchTo],
  );

  const requestClose = useCallback(() => {
    if (!openRef.current || goingBack.current) return;
    if (depth.current > 0) {
      // `popstate` collapses it, the same way Back does.
      goingBack.current = true;
      window.history.go(-depth.current);
      return;
    }
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    collapse(true);
  }, [collapse]);

  // Back, Forward and a typed hash: open, switch or close to match the URL.
  useEffect(() => {
    const sync = () => {
      goingBack.current = false;
      const target = targetForHash(window.location.hash);
      const current = openRef.current;
      const known = (window.history.state as Record<string, unknown> | null)?.[DEPTH_KEY];
      if (!target) {
        depth.current = 0;
        if (current) collapse(true);
        return;
      }
      if (typeof known === "number") {
        depth.current = known;
      } else {
        // A new entry this session did not push (a typed hash): one above
        // the entry before it, if that one's distance to the grid is known.
        depth.current = current ? (depth.current > 0 ? depth.current + 1 : 0) : 1;
        window.history.replaceState({ [DEPTH_KEY]: depth.current }, "", window.location.href);
      }
      if (current === target) return;
      if (current) {
        switchTo(target);
        return;
      }
      expand(target, true);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [collapse, expand, switchTo]);

  // In-page links to a cell (`/#voyager`, as Index results are) open in
  // place instead of navigating. Capture phase, so this runs before the
  // Link's own handler, which leaves a prevented click alone.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || !samePath(url.pathname, window.location.pathname)) return;
      const target = targetForHash(url.hash);
      if (!target) return;
      event.preventDefault();
      goTo(target);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [goTo]);

  // Unmounting mid-animation (a showcase link) leaves nothing running.
  useEffect(() => stopAnimation, [stopAnimation]);

  return (
    <>
      {cells.map(({ slug, tone, copy }) => {
        const expanded = open === slug;
        const Fragment = FRAGMENTS[slug];

        return (
          <InterfaceCell
            closeRef={(element) => {
              if (element) closeButtons.current.set(slug, element);
              else closeButtons.current.delete(slug);
            }}
            copy={copy}
            expanded={expanded}
            key={slug}
            labels={labels}
            onClose={requestClose}
            onOpen={() => goTo(slug)}
            onTouch={() => setTouched(slug)}
            openRef={(element) => {
              if (element) openButtons.current.set(slug, element);
              else openButtons.current.delete(slug);
            }}
            ref={(element) => {
              if (element) cellEls.current.set(slug, element);
              else cellEls.current.delete(slug);
            }}
            revealed={touched === slug}
            slug={slug}
            surfaceRef={(element) => {
              if (element) surfaceEls.current.set(slug, element);
              else surfaceEls.current.delete(slug);
            }}
            tone={tone}
          >
            <Fragment expanded={expanded} />
          </InterfaceCell>
        );
      })}
    </>
  );
}
