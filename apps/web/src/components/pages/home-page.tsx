import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Ground } from "@/components/home/ground";
import { ProjectPreviews } from "@/components/home/hero-proof";
import { PairStrip } from "@/components/home/pair-strip";
import { SystemLedger, type FeaturedSystem } from "@/components/home/system-ledger";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn } from "@/components/site/fade-in";
import { TactileButton } from "@/components/site/tactile-button";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/site/config";

/**
 * The five products of our own, in the canonical table order. MidiFlow and
 * Patchbay have no case page and no approved numbers yet, so they carry no
 * href — the ledger renders those rows without a link rather than with a dead
 * one. See `docs/site-revamp-contract.md`.
 */
const FEATURED_SYSTEMS = [
  { key: "voyager", href: "/work/voyager" },
  { key: "polis", href: "/work/polis" },
  { key: "funda", href: "/work/funda" },
  { key: "midiflow" },
  { key: "patchbay" },
] as const satisfies readonly { key: string; href?: string }[];

export async function HomePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const path = (href: string) => getPathname({ href, locale });

  const contactTopics = t.raw("contact.topics") as string[];
  const contactHelps = t.raw("contact.helps") as string[];

  // The six interfaces, in the canonical table order, for the strip at the
  // foot of the hero. Same strings the ledger below uses — the client-sites
  // pair lives in the `proof` namespace because that is the section it argues.
  const heroPairs = [
    ...FEATURED_SYSTEMS.map((system, index) => ({
      name: t(`products.${system.key}.name`),
      pair: t(`products.${system.key}.pair`),
      href: `#system-${index}`,
    })),
    { name: t("hero.proofLabel"), pair: t("proof.pair"), href: "#for-businesses" },
  ];

  const featuredSystems: FeaturedSystem[] = FEATURED_SYSTEMS.map((system, index) => {
    const href = "href" in system ? system.href : undefined;

    return {
      id: `system-${index}`,
      name: t(`products.${system.key}.name`),
      status: t(`products.${system.key}.status`),
      interfaceLine: t(`products.${system.key}.interface`),
      pair: t(`products.${system.key}.pair`),
      // SystemLedger renders the locale-aware `Link`, so the raw route goes in —
      // prefixing here produced /en/en/work/voyager.
      ...(href ? { href, linkLabel: t(`products.${system.key}.linkLabel`) } : {}),
    };
  });

  return (
    /* The home page is a place, not a stack of bands: one fixed ground behind
       everything, and continuous content panes extending beyond the viewport.

       Two things this element must not do. It must not create a stacking
       context — no `isolate`, no `z-index`, no `opacity` — because the ground's
       negative z-index has to reach the root context: isolated here, the whole
       of `main` paints after the footer and the fixed ground covers the footer
       at the foot of the page. And it must not take a `transform` or a
       `filter`, either of which would make it the containing block for the
       fixed ground and stop the ground being fixed at all.

       It also carries no background: it is the ground that paints the paper
       under this page, and a background here would cover it. */
    <main className="ground-main text-ink">
      <Ground />

      {/* Clip only the oversized page planes. Ground remains a direct child of
          main, so overflow never changes its fixed viewport containing block. */}
      <div className="home-planes">
        {/* HERO — the claim and the two actions it argues for, on a live
          halftone. The screen is the site's own print metaphor made physical:
          the pointer is pressure on the plate, the dots under it open, the ink
          runs toward the accent, and it closes again behind you. It is the
          live region of the ground: the reader stands in the space here.

          Full viewport height on purpose. The paper behind the copy is a
          masked layer, not a background, so it dissolves over the last stretch
          of the hero and the ground is plainly underneath by the first scroll.
          `isolate` keeps the canvas's stacking context local so the sticky
          header still passes over it. */}
        <section className="hero-sheet relative isolate flex min-h-[calc(100svh-4rem)] flex-col">
          {/* The copy is centred in the sheet above the foot padding. With the
              live ground running the sheet is open and the field runs under the
              words, quiet beneath them; without it the sheet is paper that
              dissolves into the ground over that foot padding. */}
          <div className="relative isolate flex flex-1 flex-col justify-center pb-[var(--hero-fade)]">
            <div className="section-shell py-16 sm:py-20">
              <FadeIn>
                <p className="type-section-label">{t("hero.eyebrow")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                {/* One step above display, used nowhere else on the site: four
                    words on one line have to carry the whole first screen. */}
                <h1 className="type-display-xl mt-4 sm:mt-5" data-ground-quiet="soft">
                  {t("hero.title")}
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="type-body-lg mt-6 max-w-xl font-medium sm:mt-7" data-ground-quiet="">
                  {t("hero.lead")}
                </p>
              </FadeIn>
              {/* Under the sentence that motivates them, not stranded in a column
                  350px to the right of it. */}
              <FadeIn delay={240}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TactileButton
                    className="text-base"
                    href={path("/work")}
                    trailingIcon={<IconArrowRight className="h-4 w-4" />}
                  >
                    {t("hero.seeWork")}
                  </TactileButton>
                  <TactileButton className="text-base" href="#contact" variant="secondary">
                    {t("hero.talk")}
                  </TactileButton>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* The first floating object, hung off the foot of the hero so it
            straddles the boundary between the hero and the ground. */}
        <PairStrip label={t("products.pairLabel")} pairs={heroPairs} />

        {/* Project captures supply the color; captions stay on the paper pane. */}
        <section className="home-proof-pane scroll-mt-24" id="for-businesses" aria-label={t("hero.proofLabel")}>
          <div className="section-shell py-16 sm:py-24 lg:py-28">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 sm:mb-10" data-ground-quiet="">
              <p className="type-section-label">{t("hero.proofLabel")}</p>
              <p className="type-caption">{t("proof.title")}</p>
            </div>
            <ProjectPreviews locale={locale} />
          </div>
        </section>

        {/* Open paper between the evidence and the products: the ground gathers
            its lines into the mark here, then scatters them through depth. */}
        <div className="ground-band" data-ground-key="mark" aria-hidden="true" />

      {/* WHAT WE BUILD — ink band, ledger with the canonical status labels.
          MidiFlow and Patchbay sit here with no link and no figures; the row
          shape is identical so the argument reads as one list, not as three
          products and two footnotes. */}
        <section className="home-pane home-pane-build scroll-mt-24 tone-ink" data-ground-ink="" id="build">
          <div className="section-shell home-build-layout py-20 sm:py-28">
            <div className="home-build-intro" data-ground-quiet="">
              <FadeIn>
                <p className="type-section-label">{t("products.label")}</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="type-heading mt-4 text-white">{t("products.title")}</h2>
              </FadeIn>
              <FadeIn delay={180}>
                <p className="type-body-lg mt-5">{t("products.intro")}</p>
              </FadeIn>
            </div>

            <SystemLedger pairLabel={t("products.pairLabel")} systems={featuredSystems} />
          </div>
        </section>

        <section className="home-pane home-pane-doctrine scroll-mt-24" id="doctrine">
          <div className="section-shell py-16 sm:py-20">
            <h2 className="type-heading" data-ground-quiet="">{t("doctrine.house")}</h2>
          </div>
        </section>

        {/* The last gathering before the close: the field draws Istria. */}
        <div className="ground-band" data-ground-key="land" aria-hidden="true" />

        {/* CONTACT — an ink close with the paper form plane attached to the
            viewport edge. The plane is structural and never fades as a slab. */}
        <section className="home-pane home-pane-contact scroll-mt-24" data-ground-ink="" id="contact">
          <div className="section-shell">
            <div className="home-contact-grid">
              <div className="home-contact-copy tone-ink" data-ground-quiet="">
                <FadeIn>
                  <p className="type-meta text-[color:var(--ink-inverse-label)]">
                    {t("contact.label")}
                  </p>
                  <h2 className="type-heading mt-5 text-white">{t("contact.title")}</h2>
                  <p className="type-body-lg mt-7 max-w-xl text-[color:var(--ink-inverse-muted)]">
                    {t("contact.intro")}
                  </p>
                </FadeIn>
                {/* The same three prompts /about carries. Without them this column
                    stopped at the intro and left the form standing on its own. */}
                <FadeIn delay={100}>
                  <div className="mt-10 border-t border-white/15 pt-6">
                    <p className="type-meta text-[color:var(--ink-inverse-label)]">
                      {t("contact.helpsLabel")}
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {contactHelps.map((help) => (
                        <li
                          className="type-body-sm flex gap-3 text-[color:var(--ink-inverse-muted)]"
                          key={help}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[.6em] h-1 w-1 shrink-0 rounded-full bg-white/45"
                          />
                          {help}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>

              <div className="home-contact-form-plane" data-ground-paper="">
                <FadeIn delay={250}>
                  <ContactForm locale={locale} topics={contactTopics} />
                </FadeIn>
              </div>

              {/* Reply time and the direct channels. Supplementary to the form,
                  so they follow it in the DOM; at `lg` the grid seats them under
                  the copy in the ink column. */}
              <div className="home-contact-aside tone-ink" data-ground-quiet="">
                <FadeIn delay={150}>
                  <div className="border-t border-white/15 pt-6">
                    <p className="type-body-sm text-[color:var(--ink-inverse-muted)]">
                      {t("contact.reply")}
                    </p>
                    <p className="type-body-sm mt-8 text-[color:var(--ink-inverse-muted)]">
                      {t.rich("contact.mailNote", {
                        email: CONTACT_EMAIL,
                        mail: (chunks) => (
                          <a
                            className="font-semibold text-white underline underline-offset-4"
                            href={`mailto:${CONTACT_EMAIL}`}
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                    <p className="type-body-sm mt-2 text-[color:var(--ink-inverse-muted)]">
                      {t.rich("contact.phoneNote", {
                        phone: CONTACT_PHONE_DISPLAY,
                        tel: (chunks) => (
                          <a
                            className="font-semibold text-white underline underline-offset-4"
                            href={`tel:${CONTACT_PHONE_TEL}`}
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                    <p className="type-caption mt-6 text-[color:var(--ink-inverse-muted)]">
                      {t("contact.dataNote")}
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
