import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { FactLedger, type Fact } from "@/components/about/fact-ledger";
import { FadeIn } from "@/components/site/fade-in";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site/config";

/*
 * OPERATOR NOTE — what this page states, and what is still open.
 *
 * Registered name and legal form, seat, OIB, MBS, registering court, NKD activity,
 * VAT status, the person authorised to represent the company, email and phone are
 * all rendered below from the court register. Every string is translated in
 * `messages/*.json` under the `Imprint` namespace; the registered name and the NKD
 * activity stay in Croatian in all four locales, because they are registry entries
 * and not prose.
 *
 * Still open, to add only once each one is known and correct — never as placeholder
 * text on the live page:
 *
 *   - Share capital and whether it is paid in full
 *   - Bank and IBAN, if a client's accounting asks for it on the site rather than
 *     on the invoice (deliberately omitted: a published IBAN invites invoice fraud)
 *   - Supervisory authority and professional-body details, if any ever apply
 *   - If the site ever sells to consumers: the EU ODR platform link and a statement
 *     on participation in consumer dispute resolution
 */

type Section = {
  title: string;
  body: ReactNode;
};

export async function ImprintPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Imprint" });

  const host = SITE_URL.replace(/^https?:\/\//, "");

  const mailLink = (chunks: ReactNode) => (
    <a className="font-semibold text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
      {chunks}
    </a>
  );

  const operatorDetails: Fact[] = [
    { term: t("operator.operator.term"), value: t("operator.operator.value") },
    { term: t("operator.location.term"), value: t("operator.location.value") },
    { term: t("operator.address.term"), value: t("operator.address.value") },
    { term: t("operator.director.term"), value: t("operator.director.value") },
    {
      term: t("operator.oib.term"),
      value: <span className="type-data">{t("operator.oib.value")}</span>,
    },
    {
      term: t("operator.mbs.term"),
      value: <span className="type-data">{t("operator.mbs.value")}</span>,
    },
    { term: t("operator.court.term"), value: t("operator.court.value") },
    { term: t("operator.activity.term"), value: t("operator.activity.value") },
    { term: t("operator.vat.term"), value: t("operator.vat.value") },
    {
      term: t("operator.email.term"),
      value: (
        <a className="font-semibold text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      ),
    },
    {
      term: t("operator.phone.term"),
      value: (
        <a className="font-semibold text-accent hover:underline" href={`tel:${CONTACT_PHONE_TEL}`}>
          {CONTACT_PHONE_DISPLAY}
        </a>
      ),
    },
    { term: t("operator.website.term"), value: host },
  ];

  const sections: Section[] = [
    {
      title: t("sections.content.title"),
      body: (
        <p className="type-body">{t("sections.content.body", { siteName: SITE_NAME, host })}</p>
      ),
    },
    {
      title: t("sections.links.title"),
      body: (
        <p className="type-body">
          {t.rich("sections.links.body", { email: CONTACT_EMAIL, mail: mailLink })}
        </p>
      ),
    },
    {
      title: t("sections.copyright.title"),
      body: <p className="type-body">{t("sections.copyright.body", { siteName: SITE_NAME })}</p>,
    },
    {
      title: t("sections.form.title"),
      body: (
        <p className="type-body">
          {t.rich("sections.form.body", {
            link: (chunks) => (
              <Link className="font-semibold text-accent hover:underline" href="/about#contact">
                {chunks}
              </Link>
            ),
          })}
        </p>
      ),
    },
  ];

  return (
    <main className="bg-paper text-ink">
      <section className="border-b border-rule tone-paper">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <p className="type-section-label">{t("label")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="type-heading mt-6 max-w-3xl">{t("title")}</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="type-body-lg mt-6">
              {t("lead", { siteName: SITE_NAME, host })}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-rule tone-raised">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl">
            <FadeIn>
              {/* Reads as a section label, not as a repeat of the first row's term. */}
              <h2 className="type-section-label">{t("operatorLabel")}</h2>
            </FadeIn>
            <FadeIn delay={80}>
              <FactLedger className="mt-6" facts={operatorDetails} />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-b border-rule tone-paper">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid max-w-3xl gap-12">
            {sections.map((section, index) => (
              <FadeIn delay={index * 60} key={section.title}>
                <h2 className="type-title text-ink">
                  {section.title}
                </h2>
                <div className="mt-3">{section.body}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
