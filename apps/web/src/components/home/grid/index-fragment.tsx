"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";
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
  href?: string;
  /** Searched, never shown: pair and group words. */
  extra: string;
};

const GROUPS: GroupKey[] = ["products", "clientSites", "pages"];
const PRODUCTS = ["voyager", "polis", "funda", "midiflow", "patchbay"] as const;
const PRODUCT_HREF: Partial<Record<(typeof PRODUCTS)[number], string>> = {
  voyager: "/work/voyager",
  polis: "/work/polis",
  funda: "/work/funda",
};
const CLIENTS = ["velum", "astyleMarine"] as const;

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

export function IndexFragment({ slug }: { slug: string }) {
  const t = useTranslations("HomeGrid.index");
  const common = useTranslations("HomeGrid.common");
  const products = useTranslations("HomePage.products");
  const projects = useTranslations("Projects");
  const nav = useTranslations("Nav");

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const countId = `${uid}-count`;

  const groupLabel: Record<GroupKey, string> = {
    products: t("products"),
    clientSites: t("clientSites"),
    pages: t("pages"),
  };

  const entries: Entry[] = [
    ...PRODUCTS.map((key) => ({
      id: key,
      group: "products" as const,
      name: products(`${key}.name`),
      line: products(`${key}.interface`),
      status: products(`${key}.status`),
      href: PRODUCT_HREF[key],
      /* Voyager's public role names the place, so "Vrsar" finds it. */
      extra: `${products(`${key}.pair`)} ${key === "voyager" ? projects("voyager.role") : ""}`,
    })),
    ...CLIENTS.map((key) => ({
      id: key,
      group: "clientSites" as const,
      name: PROJECTS[key].name,
      line: projects(`${key}.role`),
      status: common("live"),
      href: PROJECTS[key].href,
      extra: "",
    })),
    { id: "work", group: "pages", name: projects("allWork"), path: "/work", href: "/work", extra: "" },
    { id: "about", group: "pages", name: nav("about"), path: "/about", href: "/about", extra: "" },
    { id: "imprint", group: "pages", name: nav("imprint"), path: "/imprint", href: "/imprint", extra: "" },
    { id: "contact", group: "pages", name: nav("contact"), path: "#contact", href: "#contact", extra: "" },
  ];

  const words = terms(query);
  const results = words.length
    ? entries.filter((e) => {
        const hay = fold(
          [e.name, e.line, e.status, e.path, e.extra, groupLabel[e.group]].filter(Boolean).join(" "),
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

  const onRootKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (!query && event.target === inputRef.current) return;
    event.preventDefault();
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
    <div className={`${styles.root} h-full w-full`} data-fragment={slug} onKeyDown={onRootKey}>
      <form className={styles.field} onSubmit={onSubmit} role="search">
        <IconSearch aria-hidden className={styles.icon} size="1.125em" stroke={1.75} />
        <input
          aria-controls={listId}
          aria-describedby={countId}
          aria-label={t("searchLabel")}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className={`${styles.input} type-title`}
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
                    const body = (
                      <>
                        <span aria-hidden className={`${styles.ord} type-data`}>
                          {ordinal.get(e.id)}
                        </span>
                        <span className={`${styles.name} type-title`}>{highlight(e.name, words)}</span>
                        {e.line ? (
                          <span className={`${styles.line} type-caption`}>{highlight(e.line, words)}</span>
                        ) : null}
                        {e.status ? (
                          <span className={`${styles.status} type-meta`}>{e.status}</span>
                        ) : (
                          <span className={`${styles.status} ${styles.path} type-data`}>{e.path}</span>
                        )}
                        {e.href ? (
                          <span aria-hidden className={styles.arrow}>
                            →
                          </span>
                        ) : null}
                      </>
                    );
                    return (
                      <li key={e.id}>
                        {!e.href ? (
                          <div className={styles.row}>{body}</div>
                        ) : e.href.startsWith("#") ? (
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
  );
}
