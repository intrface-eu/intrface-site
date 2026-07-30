import { IconArrowUpRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CaseSection } from "@/components/case";
import { FactLedger, type Fact } from "@/components/about/fact-ledger";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn } from "@/components/site/fade-in";
import { ProcessSteps, type ProcessStep } from "@/components/site/process-steps";
import {
  AOC_REPO_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/site/config";

const OWN_PLATFORMS = [
  { key: "voyager", href: "/work/voyager" },
  { key: "polis", href: "/work/polis" },
  { key: "funda", href: "/work/funda" },
] as const;

export async function AboutPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "About" });

  const facts: Fact[] = [
    { term: t("company.facts.company.term"), value: t("company.facts.company.value") },
    { term: t("company.facts.person.term"), value: t("company.facts.person.value") },
    { term: t("company.facts.based.term"), value: t("company.facts.based.value") },
    { term: t("company.facts.languages.term"), value: t("company.facts.languages.value") },
    { term: t("company.facts.work.term"), value: t("company.facts.work.value") },
    {
      term: t("company.facts.delivery.term"),
      value: t.rich("company.facts.delivery.value", {
        repo: (chunks) => (
          <a
            className="font-semibold text-accent hover:underline"
            href={AOC_REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            {chunks}
          </a>
        ),
      }),
    },
    // Prose type, not `.type-data`: the value is a mixed run of a legal name, two
    // identifiers and a court, and mono rags badly in the aside's column width.
    { term: t("company.facts.registry.term"), value: t("company.facts.registry.value") },
    { term: t("company.facts.vat.term"), value: t("company.facts.vat.value") },
    {
      term: t("company.facts.phone.term"),
      value: (
        <a className="font-semibold text-accent hover:underline" href={`tel:${CONTACT_PHONE_TEL}`}>
          {CONTACT_PHONE_DISPLAY}
        </a>
      ),
    },
    {
      term: t("company.facts.contact.term"),
      value: (
        <a className="font-semibold text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      ),
    },
  ];

  const helps = t.raw("contact.helps") as string[];

  return (
    <main className="bg-paper text-ink">
      <section className="border-b border-rule tone-paper">
        <div className="section-shell py-20 sm:py-28">
          <FadeIn>
            <p className="type-section-label">{t("hero.label")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="type-display mt-6">{t("hero.title")}</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="type-body-lg mt-7 font-medium">{t("hero.lead")}</p>
          </FadeIn>
        </div>
      </section>

      <CaseSection
        aside={<FactLedger facts={facts} />}
        label={t("company.label")}
        title={t("company.title")}
        tone="raised"
      >
        <div className="grid max-w-2xl gap-5">
          <p className="type-body">{t("company.p1")}</p>
          <p className="type-body">{t("company.p2")}</p>
          <p className="type-body">{t("company.p3")}</p>
        </div>
      </CaseSection>

      <CaseSection
        intro={t("engagement.intro")}
        label={t("engagement.label")}
        title={t("engagement.title")}
        tone="paper"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_.72fr] lg:items-start">
          <ProcessSteps steps={t.raw("engagement.steps") as ProcessStep[]} />

          <div className="lg:pt-2">
            <p className="type-body max-w-md">{t("engagement.aside")}</p>
            <FadeIn delay={80}>
              <Link
                className="type-meta mt-8 inline-flex items-center gap-2 border-b border-rule pb-1.5 transition-colors hover:border-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none"
                href="/method"
              >
                {t("engagement.link")}
                <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </CaseSection>

      <CaseSection
        intro={t("platforms.intro")}
        label={t("platforms.label")}
        title={t("platforms.title")}
        tone="ink"
      >
        <dl className="divide-y divide-rule border-y border-rule">
          {OWN_PLATFORMS.map((platform, index) => (
            <FadeIn
              className="grid gap-3 py-7 lg:grid-cols-[14rem_1fr] lg:gap-10"
              delay={index * 70}
              key={platform.key}
            >
              <dt>
                <Link
                  className="type-subheading inline-flex items-center gap-2 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  href={platform.href}
                >
                  {t(`platforms.${platform.key}.name`)}
                  <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <p className="type-caption mt-2">{t(`platforms.${platform.key}.status`)}</p>
              </dt>
              <dd className="type-body">{t(`platforms.${platform.key}.description`)}</dd>
            </FadeIn>
          ))}
        </dl>

        <FadeIn delay={220}>
          <p className="type-body mt-8">
            {t.rich("platforms.clientNote", {
              link: (chunks) => (
                <Link className="font-semibold text-accent hover:underline" href="/work/client-sites">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </FadeIn>
      </CaseSection>

      <section className="scroll-mt-24 border-b border-rule tone-raised" id="contact">
        <div className="section-shell py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1fr] lg:gap-16">
            <div>
              <FadeIn>
                <p className="type-section-label">{t("contact.label")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                <h2 className="type-heading mt-4">{t("contact.title")}</h2>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="type-body-lg mt-5 max-w-md">{t("contact.intro")}</p>
              </FadeIn>
              <FadeIn delay={240}>
                <div className="mt-8 border-t border-rule pt-6">
                  <p className="type-meta">{t("contact.helpsLabel")}</p>
                  <ul className="type-body-sm mt-3 grid gap-2">
                    {helps.map((help) => (
                      <li key={help}>{help}</li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="type-body-sm mt-6">
                  {t.rich("contact.mailNote", {
                    email: CONTACT_EMAIL,
                    mail: (chunks) => (
                      <a
                        className="font-semibold text-accent hover:underline"
                        href={`mailto:${CONTACT_EMAIL}`}
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </FadeIn>
              <FadeIn delay={340}>
                <p className="type-body-sm mt-2">
                  {t.rich("contact.phoneNote", {
                    phone: CONTACT_PHONE_DISPLAY,
                    tel: (chunks) => (
                      <a
                        className="font-semibold text-accent hover:underline"
                        href={`tel:${CONTACT_PHONE_TEL}`}
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </FadeIn>
              <FadeIn delay={380}>
                <p className="type-caption mt-6">{t("contact.dataNote")}</p>
              </FadeIn>
            </div>

            <FadeIn delay={120}>
              <ContactForm locale={locale} topics={t.raw("contact.topics") as string[]} />
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
