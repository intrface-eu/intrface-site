import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { FactLedger, type Fact } from "@/components/about/fact-ledger";
import { FadeIn } from "@/components/site/fade-in";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site/config";

/*
 * OPERATOR TODO — required before this page goes live in the EU.
 *
 * This page deliberately renders only what we can state truthfully today. Add the
 * registry details below to `operatorDetails` (and delete them from this note) once
 * the legal entity's paperwork is at hand:
 *
 *   - Full registered company name, including legal form (d.o.o., j.d.o.o., obrt, …)
 *   - Registered seat: street, postal code, town, country
 *   - OIB (Croatian personal identification number of the entity)
 *   - MBS / court register number and the commercial court that keeps the register
 *   - VAT identification number (HR…), or a line stating the entity is not VAT-registered
 *   - Share capital and whether it is paid in full (required for d.o.o. / j.d.o.o.)
 *   - Name(s) of the board member(s) / person authorised to represent the company
 *   - Bank and IBAN, if the legal form requires it on business communications
 *   - A telephone number, if one exists — an email address alone is acceptable but
 *     a phone number is expected for "direct and effective" contact
 *   - Supervisory authority and professional-body details, if any apply
 *   - If the site ever sells to consumers: the EU ODR platform link and a statement
 *     on participation in consumer dispute resolution
 *
 * Do not ship placeholder text such as "to be completed" on the live page — leave a
 * detail out entirely until it is known and correct. Every string is translated in
 * `messages/*.json` under the `Imprint` namespace.
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
    {
      term: t("operator.operator.term"),
      value: t("operator.operator.value", { siteName: SITE_NAME }),
    },
    { term: t("operator.location.term"), value: t("operator.location.value") },
    {
      term: t("operator.email.term"),
      value: (
        <a className="font-semibold text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
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
