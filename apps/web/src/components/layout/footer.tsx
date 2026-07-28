import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { AnimatedMark } from "@/components/site/animated-mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import type { AppLocale } from "@/i18n/routing";
import {
  AOC_REPO_URL,
  CONTACT_EMAIL,
  POLIS_REPO_URL,
  SITE_NAME,
} from "@/lib/site/config";

/** The letters of the oversized signature mark, split so each can ink up on its own. */
const WORDMARK = [..."INTRFACE"];

const linkClass =
  "text-sm leading-6 text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none";

export async function Footer({ locale }: { locale: AppLocale }) {
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const t = await getTranslations({ locale, namespace: "Footer" });
  const year = new Date().getFullYear();

  const internalGroups = [
    {
      id: "footer-work",
      heading: t("work.heading"),
      links: [
        { href: "/work", label: t("work.index") },
        { href: "/work/voyager", label: t("work.voyager") },
        { href: "/work/polis", label: t("work.polis") },
        { href: "/work/funda", label: t("work.funda") },
        { href: "/work/client-sites", label: t("work.clientSites") },
      ],
    },
    {
      id: "footer-company",
      heading: t("company.heading"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/method", label: nav("method") },
        { href: "/imprint", label: nav("imprint") },
      ],
    },
  ] as const;

  const repos = [
    { href: AOC_REPO_URL, label: t("openSource.aoc"), meta: t("openSource.aocMeta") },
    { href: POLIS_REPO_URL, label: t("openSource.polis"), meta: t("openSource.polisMeta") },
  ] as const;

  return (
    <footer className="border-t border-rule bg-paper text-ink">
      <div className="section-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            {/* Below the fold, so it rests rather than composing where nobody sees it. */}
            <AnimatedMark animate={false} className="text-ink" size={22} />
            <span className="text-lg font-medium tracking-[-0.04em] text-ink">intrface</span>
          </div>
          <p className="type-body mt-5 max-w-sm text-sm leading-6">{t("tagline")}</p>
          <Link className={tactileButtonClasses("secondary", "mt-7")} href="/about#contact">
            {t("cta")}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <a
            className="mt-5 block break-words text-sm font-semibold text-accent transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
          {internalGroups.map((group) => (
            <nav aria-labelledby={group.id} key={group.id}>
              <h2 className="type-meta text-ink" id={group.id}>
                {group.heading}
              </h2>
              <ul className="mt-5 grid gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link className={linkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Two narrow columns would break the licence lines badly; below `sm`
              the open-source group takes the full row instead. */}
          <nav aria-labelledby="footer-open-source" className="col-span-2 sm:col-span-1">
            <h2 className="type-meta text-ink" id="footer-open-source">
              {t("openSource.heading")}
            </h2>
            <ul className="mt-5 grid gap-4">
              {repos.map((repo) => (
                <li key={repo.href}>
                  <a
                    className={linkClass}
                    href={repo.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {repo.label}
                    <span className="sr-only"> ({t("newTab")})</span>
                    <IconArrowUpRight
                      aria-hidden="true"
                      className="ml-1 inline-block h-3.5 w-3.5 align-[-0.1em]"
                    />
                  </a>
                  {/* 0.78rem is the floor in DESIGN.md; don't take it lower. */}
                  <p className="mt-1 font-mono text-[0.78rem] leading-5 text-ink-muted">
                    {repo.meta}
                  </p>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="section-shell">
        <div className="flex flex-col gap-5 border-t border-rule py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="type-body max-w-2xl text-sm leading-6">{t("colophon")}</p>
          <LocaleSwitcher />
        </div>
      </div>

      <div className="section-shell">
        <div className="flex flex-col gap-2 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta">
            © {year} {SITE_NAME} · {t("location")}
          </p>
          <Link
            className="type-meta transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
            href="/imprint"
          >
            {nav("imprint")}
          </Link>
        </div>
      </div>

      {/* The signature: an unprinted plate that inks up. See `.footer-wordmark`. */}
      <div className="section-shell pb-9 pt-10 sm:pb-12 sm:pt-14">
        <Link aria-label={nav("home")} className="footer-wordmark" href="/">
          <span aria-hidden="true" className="footer-wordmark__row">
            {WORDMARK.map((glyph, index) => (
              <span
                className="footer-wordmark__letter"
                data-glyph={glyph}
                key={`${glyph}-${index}`}
                style={{ "--fw-i": index } as CSSProperties}
              >
                {glyph}
              </span>
            ))}
          </span>
        </Link>
      </div>
    </footer>
  );
}
