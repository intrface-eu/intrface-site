"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { FragmentProps } from "@/lib/site/interfaces";
import {
  CAPTURE_H,
  CAPTURE_W,
  SECTION_PHOTO,
  VELUM,
  VELUM_PHOTOS,
  VELUM_SECTIONS,
  type VelumLang,
  type VelumSection,
} from "./velum-data";
import styles from "./velum-fragment.module.css";

/**
 * Velum's own interface, small: the café's header with its four sections
 * and its HR / EN switch, and the section under the wave line. The copy is
 * the site's, in the site's two languages. Expanded, the section's
 * photograph stands beside it, as on the site.
 */
export function VelumFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.velum");
  const locale = useLocale();
  const uid = useId();
  const [lang, setLang] = useState<VelumLang>(locale === "hr" ? "hr" : "en");
  const [section, setSection] = useState<VelumSection>("menu");
  const tabs = useRef<Partial<Record<VelumSection, HTMLButtonElement | null>>>({});

  const copy = VELUM[lang];
  const other: VelumLang = lang === "hr" ? "en" : "hr";
  const tabId = (s: VelumSection) => `${uid}-${s}`;
  const panelId = `${uid}-panel`;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = VELUM_SECTIONS.indexOf(section);
    const n = VELUM_SECTIONS.length;
    let next: number;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    const s = VELUM_SECTIONS[next];
    setSection(s);
    tabs.current[s]?.focus();
  };

  return (
    <div
      className={`${styles.root} h-full w-full`}
      data-fragment="velum"
      data-expanded={expanded || undefined}
      lang={lang}
    >
      <div className={styles.head}>
        <span className={styles.brand}>Velum</span>
        <div role="tablist" aria-label={t("sectionsLabel")} className={styles.nav}>
          {VELUM_SECTIONS.map((s) => (
            <button
              key={s}
              ref={(el) => {
                tabs.current[s] = el;
              }}
              id={tabId(s)}
              type="button"
              role="tab"
              aria-selected={s === section}
              aria-controls={panelId}
              tabIndex={s === section ? 0 : -1}
              className={styles.tab}
              onClick={() => setSection(s)}
              onKeyDown={onKey}
            >
              {copy.nav[s]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.lang}
          lang={other}
          aria-label={t("language", { language: VELUM[other].name })}
          onClick={() => setLang(other)}
        >
          {VELUM[other].code}
        </button>
      </div>
      <div className={styles.wave} aria-hidden="true" />

      <div className={styles.stage}>
        <div
          key={`${section}-${lang}`}
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(section)}
          className={styles.panel}
          tabIndex={0}
        >
          <div className={styles.sheet}>
            <Section section={section} lang={lang} />
          </div>
        </div>
        {expanded ? <Photo lang={lang} section={section} /> : null}
      </div>
    </div>
  );
}

function Section({ section, lang }: { section: VelumSection; lang: VelumLang }) {
  const copy = VELUM[lang];
  const at = (i: number) => ({ "--i": i }) as CSSProperties;

  if (section === "menu") {
    const m = copy.menu;
    return (
      <>
        <p className={styles.title} style={at(0)}>
          {m.title}
        </p>
        <p className={styles.intro} style={at(1)}>
          {m.intro}
        </p>
        <ul className={styles.items}>
          {m.items.map((item, i) => (
            <li key={item.name} className={styles.item} style={at(i + 2)}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.note}>{item.note}</span>
            </li>
          ))}
        </ul>
        <p className={styles.foot} style={at(8)}>
          {m.foot}
        </p>
      </>
    );
  }

  if (section === "cakes") {
    const c = copy.cakes;
    return (
      <>
        <p className={styles.title} style={at(0)}>
          {c.title}
        </p>
        <p className={styles.body} style={at(1)}>
          {c.body}
        </p>
        <p className={styles.pull} style={at(2)}>
          {c.foot}
        </p>
      </>
    );
  }

  if (section === "wine") {
    const w = copy.wine;
    return (
      <>
        <p className={styles.title} style={at(0)}>
          {w.title}
        </p>
        {w.body.map((line, i) => (
          <p key={line} className={styles.body} style={at(i + 1)}>
            {line}
          </p>
        ))}
      </>
    );
  }

  const v = copy.visit;
  return (
    <>
      <p className={styles.title} style={at(0)}>
        {v.title}
      </p>
      <p className={styles.body} style={at(1)}>
        {v.body}
      </p>
      <div className={styles.facts} style={at(2)}>
        <p>{v.place}</p>
        <p className="type-data">{v.phone}</p>
        <p>{v.instagram}</p>
      </div>
    </>
  );
}

/**
 * A photograph from the site, cut out of a project capture: the crop box is
 * sized to the photograph's aspect and never larger than the column, and the
 * capture is scaled and shifted inside it so only the photograph shows.
 */
function Photo({ lang, section }: { lang: VelumLang; section: VelumSection }) {
  const key = SECTION_PHOTO[section];
  const { src, box } = VELUM_PHOTOS[key];
  const style = {
    "--rh": box.h / box.w,
    "--rw": box.w / box.h,
    "--scale": `${(CAPTURE_W / box.w) * 100}%`,
    "--left": `${(-box.x / box.w) * 100}%`,
    "--top": `${(-box.y / box.h) * 100}%`,
  } as CSSProperties;
  return (
    <figure className={styles.photo}>
      <div key={key} className={styles.crop} style={style}>
        <Image
          src={src}
          alt={VELUM[lang].photos[key]}
          width={CAPTURE_W}
          height={CAPTURE_H}
          sizes="120vw"
          className={styles.cropImage}
        />
      </div>
    </figure>
  );
}
