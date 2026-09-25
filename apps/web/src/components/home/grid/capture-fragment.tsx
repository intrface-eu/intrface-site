"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { DESKTOP_CAPTURE, MOBILE_CAPTURE, PROJECTS } from "@/lib/site/projects";
import styles from "./capture-fragment.module.css";

type CaptureSlug = "velum" | "astyleMarine";

/** Largest pan travel of the desktop capture, in px, at the cell's edge. */
const PAN = 6;
/** Pan only for a hovering fine pointer with motion allowed. */
const PAN_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/*
 * Captures are 390×844 (mobile, one screen) and 1440×1000 (desktop, detail).
 * The mobile capture is not a full page, so the phone frame scrolls the site's
 * page as captured: the phone screen first, then the desktop and detail
 * captures at the frame's width.
 */
const FRAME_SIZES = "(min-width: 1024px) 21vh, (min-width: 640px) 24vh, 34vh";
const BEHIND_SIZES = "(min-width: 1024px) 28vw, (min-width: 640px) 55vw, 100vw";

function isCaptureSlug(slug: string): slug is CaptureSlug {
  return slug === "velum" || slug === "astyleMarine";
}

export function CaptureFragment({ slug }: { slug: string }) {
  const t = useTranslations("HomeGrid.capture");
  const tp = useTranslations("Projects");
  const rootRef = useRef<HTMLDivElement>(null);
  const behindRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  const query = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    query.current = window.matchMedia(PAN_QUERY);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const write = useCallback((x: number, y: number) => {
    const el = behindRef.current;
    if (!el) return;
    el.style.setProperty("--pan-x", `${x.toFixed(2)}px`);
    el.style.setProperty("--pan-y", `${y.toFixed(2)}px`);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse" || !query.current?.matches) return;
      point.current.x = event.clientX;
      point.current.y = event.clientY;
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const root = rootRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const nx = ((point.current.x - rect.left) / rect.width) * 2 - 1;
        const ny = ((point.current.y - rect.top) / rect.height) * 2 - 1;
        // The capture moves against the hand, as if it lay deeper than the frame.
        write(-Math.max(-1, Math.min(1, nx)) * PAN, -Math.max(-1, Math.min(1, ny)) * PAN);
      });
    },
    [write],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    write(0, 0);
  }, [write]);

  if (!isCaptureSlug(slug)) return <div className="h-full w-full" />;
  const project = PROJECTS[slug];

  return (
    <div
      className={`${styles.root} h-full w-full`}
      data-fragment={slug}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      ref={rootRef}
    >
      <div aria-hidden="true" className={styles.behind} ref={behindRef}>
        <Image alt="" className={styles.image} {...DESKTOP_CAPTURE} sizes={BEHIND_SIZES} src={project.desktop} />
      </div>

      <div
        aria-label={t("frameLabel", { name: project.name })}
        className={styles.frame}
        role="region"
        tabIndex={0}
      >
        <Image
          alt={tp(`${slug}.mobileAlt`)}
          className={styles.image}
          {...MOBILE_CAPTURE}
          sizes={FRAME_SIZES}
          src={project.mobile}
        />
        <Image
          alt={tp(`${slug}.desktopAlt`)}
          className={`${styles.image} ${styles.cut}`}
          {...DESKTOP_CAPTURE}
          sizes={FRAME_SIZES}
          src={project.desktop}
        />
        <Image
          alt={tp(`${slug}.detailAlt`)}
          className={`${styles.image} ${styles.cut}`}
          {...DESKTOP_CAPTURE}
          sizes={FRAME_SIZES}
          src={project.detail}
        />
      </div>

      <p aria-hidden="true" className={`type-caption ${styles.hint}`}>
        {t("hint")}
      </p>
    </div>
  );
}
