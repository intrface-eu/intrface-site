import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import type { AppLocale } from "@/i18n/routing";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  GITHUB_URL,
  SITE_NAME,
} from "@/lib/site/config";

/** The letters of the oversized signature mark, split so each can ink up on its own. */
const WORDMARK = [..."INTRFACE"];

const linkClass =
  "type-caption text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none";

/**
 * The footer: one short block and the signature. Name and place, the tagline,
 * the two direct channels, GitHub, the imprint, the locale and the year. No
 * link groups and no form; the header (on every page but home) carries the
 * navigation, and the grid is the home page's index.
 *
 * On the home page the footer is also where the ground draws Istria and puts
 * the X on Vrsar: `data-ground-key="land"` sits on the footer itself, and the
 * footer is at least 55vh tall (`.site-footer`), so at the foot of the page
 * its centre is within a quarter viewport of the viewport's centre and
 * `stageFor` brings the gathering to completion. On about the page's own land
 * band comes first in the document, so the ground keys from that instead, and
 * pages without the ground ignore the attribute.
 */
export async function Footer({ locale }: { locale: AppLocale }) {
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const t = await getTranslations({ locale, namespace: "Footer" });
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer bg-paper text-ink" data-ground-key="land">
      {/* The ground's lines quiet under the block and stay at full strength
          everywhere else in the footer, so the map reads through it. */}
      <div className="section-shell site-footer__block pt-16 sm:pt-20">
        <div className="site-footer__about" data-ground-quiet="">
          <p className="type-title">
            {SITE_NAME} · {t("location")}
          </p>
          <p className="type-body-sm mt-2">{t("tagline")}</p>
        </div>

        {/* The target of every "Contact" link on the site (`/#contact`). */}
        <div className="site-footer__contact" data-ground-quiet="" id="contact">
          <h2 className="type-meta">{t("contact")}</h2>
          <ul className="mt-3 grid gap-1">
            <li>
              <a
                className="type-caption font-semibold text-accent transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a className={linkClass} href={`tel:${CONTACT_PHONE_TEL}`}>
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </div>

        <div className="site-footer__colophon" data-ground-quiet="">
          <a className={linkClass} href={GITHUB_URL} rel="me noopener noreferrer">
            {t("github")}
          </a>
          <Link className={linkClass} href="/imprint">
            {t("imprint")}
          </Link>
          <LocaleSwitcher />
          <p className="type-caption">
            © {year} {SITE_NAME}
          </p>
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
