import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import type { AppLocale } from "@/i18n/routing";
import {
  CONTACT_EMAIL,
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
        { href: "/work/velum", label: t("work.velum") },
        { href: "/work/voyager", label: t("work.voyager") },
        { href: "/work/astyle-marine", label: t("work.astyleMarine") },
        { href: "/work/polis", label: t("work.polis") },
        { href: "/work/funda", label: t("work.funda") },
      ],
    },
    {
      id: "footer-company",
      heading: t("company.heading"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/imprint", label: nav("imprint") },
      ],
    },
  ] as const;

  return (
    <footer className="site-footer bg-paper text-ink">
      {/* No rules anywhere in the footer: the field runs from the contact
          close straight into the signature. The signature carries the name,
          so there is no small mark here, and the contact section a screen
          above carries the call, so only the address remains. */}
      {/* The footer is where the field is meant to show, so the address, the
          colophon and the signature carry no quiet at all and the mark draws
          straight through them. The link lists are the one exception: the mark
          gathers at the middle of the viewport, and at full strength it took
          `Velum` and `Imprint` off the page. Each column quiets only its own
          words — `w-fit` keeps the nav as narrow as its longest link, so the
          quiet rectangle is the text and not the column, and the mark still
          runs at full strength through the gap between the two. */}
      <div className="section-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="type-body-sm max-w-sm">{t("tagline")}</p>
          <a
            className="mt-6 block break-words text-sm font-semibold text-accent transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8">
          {internalGroups.map((group) => (
            <nav aria-labelledby={group.id} className="w-fit" data-ground-quiet="" key={group.id}>
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


        </div>
      </div>

      <div className="section-shell">
        <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
          {/* A 38-character sentence, not a label: sentence case keeps the word
              shapes a reader navigates by. Imprint lives under Company above. */}
          <p className="type-caption">
            © {year} {SITE_NAME} · {t("location")}
          </p>
          <LocaleSwitcher />
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
