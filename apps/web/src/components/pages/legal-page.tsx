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
 * The privacy policy (/privacy) and the terms of use (/terms). Both follow the
 * Imprint's layout: a lead band, a hairline ledger of facts, then titled
 * sections. Every string lives in `messages/*.json` under `Privacy` and
 * `Terms`; a section body is an array of paragraphs, plus an optional `items`
 * array rendered as a list after the first paragraph.
 *
 * Section ids are stable anchors. `/privacy#data-deletion` is the data
 * deletion instructions URL registered with Meta for the "Voyager Publishing"
 * app — do not rename it.
 */

/** The date the texts last changed, as ISO for `<time>`. The words live in messages. */
const LEGAL_UPDATED = "2026-10-25";

const AZOP_URL = "https://azop.hr";

const linkClass = "font-semibold text-accent hover:underline";

type Namespace = "Privacy" | "Terms";

type SectionSpec = {
  /** Message key under `sections`. */
  key: string;
  /** Fragment id on the page. */
  id: string;
  /** Render `items` as numbered steps instead of a bulleted list. */
  ordered?: boolean;
};

const PRIVACY_SECTIONS: readonly SectionSpec[] = [
  { key: "scope", id: "scope" },
  { key: "visiting", id: "visiting" },
  { key: "form", id: "contact-form" },
  { key: "social", id: "social-publishing" },
  { key: "transfers", id: "transfers" },
  { key: "rights", id: "rights" },
  { key: "deletion", id: "data-deletion", ordered: true },
  { key: "changes", id: "changes" },
];

const TERMS_SECTIONS: readonly SectionSpec[] = [
  { key: "who", id: "who-we-are" },
  { key: "content", id: "content" },
  { key: "form", id: "contact-form" },
  { key: "warranty", id: "no-warranty" },
  { key: "liability", id: "liability" },
  { key: "clients", id: "client-work" },
  { key: "law", id: "governing-law" },
  { key: "changes", id: "changes" },
];

const richTags = {
  mail: (chunks: ReactNode) => (
    <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
      {chunks}
    </a>
  ),
  imprint: (chunks: ReactNode) => (
    <Link className={linkClass} href="/imprint">
      {chunks}
    </Link>
  ),
  privacy: (chunks: ReactNode) => (
    <Link className={linkClass} href="/privacy">
      {chunks}
    </Link>
  ),
  terms: (chunks: ReactNode) => (
    <Link className={linkClass} href="/terms">
      {chunks}
    </Link>
  ),
  deletion: (chunks: ReactNode) => (
    <Link className={linkClass} href="/privacy#data-deletion">
      {chunks}
    </Link>
  ),
  contact: (chunks: ReactNode) => (
    <Link className={linkClass} href="/about#contact">
      {chunks}
    </Link>
  ),
  azop: (chunks: ReactNode) => (
    <a className={linkClass} href={AZOP_URL} rel="noopener noreferrer">
      {chunks}
    </a>
  ),
  strong: (chunks: ReactNode) => <strong className="font-semibold text-ink">{chunks}</strong>,
};

async function LegalDocument({
  locale,
  namespace,
  facts,
  sections,
}: {
  locale: AppLocale;
  namespace: Namespace;
  facts: (t: Awaited<ReturnType<typeof getTranslations>>) => Fact[];
  sections: readonly SectionSpec[];
}) {
  const t = await getTranslations({ locale, namespace });

  const host = SITE_URL.replace(/^https?:\/\//, "");
  const values = { siteName: SITE_NAME, host, email: CONTACT_EMAIL };
  const rich = (key: string) => t.rich(key, { ...values, ...richTags });

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
            <p className="type-body-lg mt-6">{rich("lead")}</p>
          </FadeIn>
          <FadeIn delay={260}>
            <p className="type-caption mt-6">
              {t("updatedLabel")} <time dateTime={LEGAL_UPDATED}>{t("updated")}</time>
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-rule tone-raised">
        <div className="section-shell py-16 sm:py-20">
          <div className="max-w-3xl">
            <FadeIn>
              <h2 className="type-section-label">{t("factsLabel")}</h2>
            </FadeIn>
            <FadeIn delay={80}>
              <FactLedger className="mt-6" facts={facts(t)} />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-b border-rule tone-paper">
        <div className="section-shell py-16 sm:py-20">
          <div className="grid max-w-3xl gap-12">
            {sections.map(({ key, id, ordered }, index) => {
              const paragraphs = t.raw(`sections.${key}.body`) as string[];
              const items = t.has(`sections.${key}.items`)
                ? (t.raw(`sections.${key}.items`) as string[])
                : [];
              const List = ordered ? "ol" : "ul";

              return (
                <FadeIn delay={index * 60} key={key}>
                  <h2 className="type-title scroll-mt-24 text-ink" id={id}>
                    {t(`sections.${key}.title`)}
                  </h2>
                  <div className="mt-3 grid gap-4">
                    {paragraphs.map((_, paragraph) => (
                      <div className="grid gap-4" key={paragraph}>
                        <p className="type-body">{rich(`sections.${key}.body.${paragraph}`)}</p>
                        {paragraph === 0 && items.length > 0 ? (
                          <List
                            className={`grid gap-2 pl-5 ${ordered ? "list-decimal" : "list-disc"}`}
                          >
                            {items.map((__, item) => (
                              <li className="type-body" key={item}>
                                {rich(`sections.${key}.items.${item}`)}
                              </li>
                            ))}
                          </List>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

const mailValue = (
  <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
    {CONTACT_EMAIL}
  </a>
);

const phoneValue = (
  <a className={linkClass} href={`tel:${CONTACT_PHONE_TEL}`}>
    {CONTACT_PHONE_DISPLAY}
  </a>
);

export async function PrivacyPage({ locale }: { locale: AppLocale }) {
  return (
    <LegalDocument
      facts={(t) => [
        { term: t("facts.controller.term"), value: t("facts.controller.value") },
        { term: t("facts.address.term"), value: t("facts.address.value") },
        {
          term: t("facts.oib.term"),
          value: <span className="type-data">{t("facts.oib.value")}</span>,
        },
        { term: t("facts.director.term"), value: t("facts.director.value") },
        { term: t("facts.email.term"), value: mailValue },
        { term: t("facts.phone.term"), value: phoneValue },
        {
          term: t("facts.authority.term"),
          value: t.rich("facts.authority.value", { azop: richTags.azop }),
        },
      ]}
      locale={locale}
      namespace="Privacy"
      sections={PRIVACY_SECTIONS}
    />
  );
}

export async function TermsPage({ locale }: { locale: AppLocale }) {
  return (
    <LegalDocument
      facts={(t) => [
        { term: t("facts.operator.term"), value: t("facts.operator.value") },
        { term: t("facts.address.term"), value: t("facts.address.value") },
        {
          term: t("facts.oib.term"),
          value: <span className="type-data">{t("facts.oib.value")}</span>,
        },
        { term: t("facts.email.term"), value: mailValue },
        { term: t("facts.law.term"), value: t("facts.law.value") },
        { term: t("facts.court.term"), value: t("facts.court.value") },
      ]}
      locale={locale}
      namespace="Terms"
      sections={TERMS_SECTIONS}
    />
  );
}
