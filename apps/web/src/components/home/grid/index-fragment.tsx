"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link, getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { CELLS, WORK_PIECES, type FragmentProps } from "@/lib/site/interfaces";
import { PROJECTS } from "@/lib/site/projects";
import styles from "./index-fragment.module.css";

type GroupKey = "products" | "clientSites" | "pages";

type Entry = {
  id: string;
  group: GroupKey;
  name: string;
  line?: string;
  /** A status word (`.type-meta`) or, for pages, the path (`.type-data`). */
  status?: string;
  path?: string;
  /** A route (`Link`) or, for things that open in place on home, `#hash`. */
  href: string;
  hash?: string;
};

const GROUPS: GroupKey[] = ["products", "clientSites", "pages"];

/* The grid's own interfaces, in grid order: the cells, then the work pieces.
   The index is not an entry: it is the search the reader is in. */
const OPENABLE = [...CELLS.filter((c) => c.slug !== "index" && c.slug !== "work"), ...WORK_PIECES];

const PAGES = [
  { id: "work", key: "work", path: "/work" },
  { id: "about", key: "about", path: "/about" },
  { id: "imprint", key: "imprint", path: "/imprint" },
] as const;

/* Letters NFD leaves whole. Croatian đ matters most: "Dusan" must find "Dušan". */
const EXTRA_FOLD: Record<string, string> = { đ: "d", ß: "ss", æ: "ae", ø: "o", ł: "l", œ: "oe" };

/** Folds one string for matching and keeps, per folded char, the source index. */
function fold(source: string): { text: string; map: number[] } {
  let text = "";
  const map: number[] = [];
  for (let i = 0; i < source.length; i++) {
    const lower = source[i].toLowerCase();
    const piece = EXTRA_FOLD[lower] ?? lower.normalize("NFD").replace(/\p{M}/gu, "");
    for (let j = 0; j < piece.length; j++) map.push(i);
    text += piece;
  }
  return { text, map };
}

function terms(query: string) {
  return fold(query).text.split(/\s+/).filter(Boolean);
}

const hits = (source: string, words: string[]) => {
  const text = fold(source).text;
  return words.some((w) => text.includes(w));
};

/** Wraps the first hit of each term in <mark>; overlapping hits merge. */
function highlight(source: string, words: string[]): ReactNode {
  if (!words.length) return source;
  const { text, map } = fold(source);
  const ranges: [number, number][] = [];
  for (const w of words) {
    const at = text.indexOf(w);
    if (at < 0) continue;
    ranges.push([map[at], map[at + w.length - 1] + 1]);
  }
  if (!ranges.length) return source;
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  const out: ReactNode[] = [];
  let cursor = 0;
  merged.forEach(([start, end], k) => {
    if (start > cursor) out.push(source.slice(cursor, start));
    out.push(
      <mark className={styles.hit} key={k}>
        {source.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });
  if (cursor < source.length) out.push(source.slice(cursor));
  return out;
}

export function IndexFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.index");
  const grid = useTranslations("HomeGrid");
  const projects = useTranslations("Projects");
  const nav = useTranslations("Nav");
  const locale = useLocale() as AppLocale;

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const countId = `${uid}-count`;

  /* Opened in place, the search is the whole interface: put the caret in it
     for a mouse and keyboard, never on touch, where it would raise the
     keyboard over the list. */
  useEffect(() => {
    if (!expanded || !window.matchMedia("(pointer: fine)").matches) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [expanded]);

  const groupLabel: Record<GroupKey, string> = {
    products: t("products"),
    clientSites: t("clientSites"),
    pages: t("pages"),
  };

  /* A native link to the locale's home plus the hash: the browser changes
     only the fragment and fires `hashchange`, which opens the interface in
     place. */
  const home = getPathname({ href: "/", locale });

  const entries: Entry[] = [
    ...OPENABLE.map((spec) => {
      const client = spec.project;
      return {
        id: spec.slug,
        group: client ? ("clientSites" as const) : ("products" as const),
        name: client ? PROJECTS[client].name : grid(`${spec.slug}.name`),
        line: client ? projects(`${client}.role`) : grid(`${spec.slug}.line`),
        status: spec.status ? grid(`common.${spec.status}`) : undefined,
        href: `${home}#${spec.hash}`,
        hash: spec.hash,
      };
    }),
    ...PAGES.map((p) => ({
      id: p.id,
      group: "pages" as const,
      name: p.key === "work" ? projects("allWork") : nav(p.key),
      path: p.path,
      href: p.path,
    })),
    {
      id: "contact",
      group: "pages",
      name: nav("contact"),
      path: "#contact",
      href: `${home}#contact`,
      hash: "contact",
    },
  ];

  const words = terms(query);
  const results = words.length
    ? entries.filter((e) => {
        const hay = fold(
          [e.name, e.line, e.status, e.path, groupLabel[e.group]].filter(Boolean).join(" "),
        ).text;
        return words.every((w) => hay.includes(w));
      })
    : entries;
  const ordinal = new Map(entries.map((e, i) => [e.id, String(i + 1).padStart(2, "0")]));

  const links = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);

  const clear = () => {
    setQuery("");
    if (listRef.current) listRef.current.scrollTop = 0;
    inputRef.current?.focus();
  };

  /* Esc clears a query first; with the field empty it is left to the dialog. */
  const onRootKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !query) return;
    event.preventDefault();
    event.stopPropagation();
    clear();
  };

  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const all = links();
    if (!all.length) return;
    event.preventDefault();
    (event.key === "ArrowDown" ? all[0] : all[all.length - 1]).focus();
  };

  const onListKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Home" && key !== "End") return;
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (at < 0) return;
    event.preventDefault();
    if (key === "Home") return all[0].focus();
    if (key === "End") return all[all.length - 1].focus();
    const next = at + (key === "ArrowDown" ? 1 : -1);
    if (next < 0) return inputRef.current?.focus();
    all[Math.min(next, all.length - 1)].focus();
  };

  /* Enter opens the top result: the reader asked for it by pressing a key. */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (words.length) links()[0]?.click();
  };

  return (
    <div
      className={`${styles.root} h-full w-full`}
      data-expanded={expanded ? "" : undefined}
      onKeyDown={onRootKey}
    >
      <div className={styles.column}>
        <form className={styles.field} onSubmit={onSubmit} role="search">
          <IconSearch aria-hidden className={styles.icon} size="1.125em" stroke={1.75} />
          <input
            aria-controls={listId}
            aria-describedby={countId}
            aria-label={t("searchLabel")}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className={`${styles.input} ${expanded ? "type-subheading" : "type-title"}`}
            enterKeyHint="go"
            onChange={(event) => {
              setQuery(event.target.value);
              if (listRef.current) listRef.current.scrollTop = 0;
            }}
            onKeyDown={onInputKey}
            placeholder={t("placeholder")}
            ref={inputRef}
            spellCheck={false}
            type="search"
            value={query}
          />
          {query ? (
            <button aria-label={t("clear")} className={styles.clear} onClick={clear} type="button">
              <IconX aria-hidden size="1em" stroke={1.75} />
            </button>
          ) : null}
          <p aria-live="polite" className={`${styles.count} type-meta`} id={countId}>
            {t("results", { count: results.length })}
          </p>
        </form>

        <div className={styles.list} id={listId} onKeyDown={onListKey} ref={listRef}>
          {results.length ? (
            GROUPS.map((group) => {
              const rows = results.filter((e) => e.group === group);
              if (!rows.length) return null;
              const headId = `${uid}-${group}`;
              return (
                <div aria-labelledby={headId} className={styles.group} key={group} role="group">
                  <p className={styles.head}>
                    <span className="type-meta" id={headId}>
                      {groupLabel[group]}
                    </span>
                    <span aria-hidden className={`${styles.tally} type-data`}>
                      {String(rows.length).padStart(2, "0")}
                    </span>
                  </p>
                  <ul className={styles.rows}>
                    {rows.map((e) => {
                      /* At rest a row is the name; the line shows when the
                         index is open, or when the query found it there. */
                      const showLine =
                        e.line && (expanded || (words.length > 0 && hits(e.line, words)));
                      const body = (
                        <>
                          <span aria-hidden className={`${styles.ord} type-data`}>
                            {ordinal.get(e.id)}
                          </span>
                          <span className={`${styles.name} type-title`}>
                            {highlight(e.name, words)}
                          </span>
                          {showLine ? (
                            <span className={`${styles.line} type-caption`}>
                              {highlight(e.line as string, words)}
                            </span>
                          ) : null}
                          {e.status ? (
                            <span className={`${styles.status} type-meta`}>{e.status}</span>
                          ) : (
                            <span className={`${styles.status} ${styles.path} type-data`}>
                              {e.path}
                            </span>
                          )}
                          <span aria-hidden className={styles.arrow}>
                            →
                          </span>
                        </>
                      );
                      return (
                        <li key={e.id}>
                          {e.hash ? (
                            <a className={`${styles.row} ${styles.link}`} href={e.href}>
                              {body}
                            </a>
                          ) : (
                            <Link className={`${styles.row} ${styles.link}`} href={e.href}>
                              {body}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          ) : (
            <p className={`${styles.empty} type-caption`}>{t("empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
