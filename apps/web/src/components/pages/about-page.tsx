import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Ground } from "@/components/home/ground";
import { FadeIn } from "@/components/site/fade-in";
import { TactileButton } from "@/components/site/tactile-button";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

/**
 * About is five moves on the same ground the home page runs: the claim, the
 * person, the manifesto, the place, and the way out.
 *
 * The page carries no studio blurb, no product list and no second contact
 * form — the home page argues the work and the footer carries the channels.
 * What it has instead is a name, a face, the stance in the owner's words, and
 * the map gathering on Vrsar.
 */
export async function AboutPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "About" });
  const path = (href: string) => getPathname({ href, locale });
  const body = t.raw("person.body") as string[];
  const manifesto = {
    open: t.raw("manifesto.open") as string[],
    questions: t.raw("manifesto.questions") as string[],
    examples: t.raw("manifesto.examples") as string[],
    layers: t.raw("manifesto.layers") as string[],
    close: t.raw("manifesto.close") as string[],
  };

  return (
    /* Same two prohibitions as the home page: this element must not create a
       stacking context (no `isolate`, no `z-index`, no `opacity`), or the
       ground's negative z-index stops reaching the root context and the fixed
       ground paints over the footer; and it must not take a `transform` or a
       `filter`, either of which would make it the containing block for the
       ground and stop it being fixed. It carries no background either — the
       ground is what paints the paper. */
    <main className="ground-main text-ink">
      <Ground />

      <div className="home-planes">
        {/* 1 — THE CLAIM. Set like the home hero: the field runs under the
            words and quiets beneath them. The sentence itself is fixed copy
            in every locale. */}
        <section className="hero-sheet relative isolate flex min-h-[calc(100svh-4rem)] flex-col">
          <div className="relative isolate flex flex-1 flex-col justify-center pb-[var(--hero-fade)]">
            <div className="section-shell py-16 sm:py-20">
              <FadeIn>
                <p className="type-section-label">{t("hero.label")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 className="type-display mt-4 sm:mt-5" data-ground-quiet="soft">
                  {t("hero.title")}
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="type-body-lg mt-6 font-medium sm:mt-7" data-ground-quiet="">
                  {t("hero.lead")}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 2 — THE PERSON. The heaviest block on the page: the plate crosses
            the pane's own edge at `lg` and the paragraph stands beside it. */}
        <section className="home-pane about-person-pane">
          <div className="section-shell about-person">
            <div className="about-portrait">
              {/* Placeholder plate, not the photograph: swap
                  `public/about/alex-basic-placeholder.svg` for the picture and
                  keep the 4:5 box. `unoptimized` because the optimizer refuses
                  SVG; a JPEG replacement can drop it. */}
              <Image
                alt={t("person.portraitAlt")}
                height={1000}
                priority={false}
                sizes="(min-width: 1024px) 32rem, 100vw"
                src="/about/alex-basic-placeholder.svg"
                unoptimized
                width={800}
              />
            </div>

            <div className="about-person-copy" data-ground-quiet="">
              <FadeIn>
                <p className="type-section-label">{t("person.label")}</p>
              </FadeIn>
              <FadeIn delay={80}>
                <h2 className="type-heading mt-4">{t("person.name")}</h2>
              </FadeIn>
              <FadeIn className="mt-6 grid gap-4 sm:mt-7" delay={160}>
                {body.map((line) => (
                  <p className="type-body-lg" key={line}>
                    {line}
                  </p>
                ))}
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 3 — THE MANIFESTO. The owner's text, set as a statement and not a
            list: the title as the kicker, the opening pair as the lead, the
            body in an offset column with its stanzas kept as broken lines,
            and the owner's bold lines set heaviest. It comes after the
            person and before the land band because its last line hands over
            to the world, and the map is the next thing the reader sees. */}
        <section aria-labelledby="manifesto-title" className="home-pane about-manifesto-pane">
          <div className="section-shell about-manifesto">
            <div className="about-manifesto__head" data-ground-quiet="">
              <FadeIn>
                <h2 className="type-section-label" id="manifesto-title">
                  {t("manifesto.title")}
                </h2>
              </FadeIn>
              <FadeIn className="about-manifesto__open" delay={80}>
                {manifesto.open.map((line) => (
                  <p className="type-heading" key={line}>
                    {line}
                  </p>
                ))}
              </FadeIn>
            </div>

            <div className="about-manifesto__body" data-ground-quiet="">
              <FadeIn>
                <p className="type-body-lg">{t("manifesto.first")}</p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg">{t("manifesto.arrive")}</p>
              </FadeIn>
              <FadeIn>
                <p className="type-subheading about-manifesto__bold">
                  <strong>{t("manifesto.formula")}</strong>
                </p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg about-manifesto__stanza">
                  {manifesto.questions.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg">{t("manifesto.identity")}</p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg">{t("manifesto.public")}</p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg">{t("manifesto.adapt")}</p>
              </FadeIn>
              <FadeIn>
                <p className="type-body-lg about-manifesto__stanza">
                  {manifesto.examples.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </FadeIn>
              <FadeIn className="about-manifesto__pair">
                {manifesto.layers.map((line) => (
                  <p className="type-body-lg" key={line}>
                    {line}
                  </p>
                ))}
              </FadeIn>
              <FadeIn>
                <p className="type-heading about-manifesto__bold about-manifesto__close">
                  <strong>
                    {manifesto.close.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </strong>
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 4 — THE PLACE. One viewport of open paper: the field gathers into
            Istria and marks Vrsar. No caption and no label — the map is the
            section. The two phrases stay a home-only moment. */}
        <div className="ground-band" data-ground-key="land" aria-hidden="true" />

        {/* 5 — THE WAY OUT. One sentence and two doors. The footer already
            carries the email and the phone. */}
        <section className="home-pane about-close-pane">
          <div className="section-shell">
            <div data-ground-quiet="">
              <FadeIn>
                <h2 className="type-heading">{t("close.title")}</h2>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TactileButton
                    className="text-base"
                    href={path("/work")}
                    trailingIcon={<IconArrowRight className="h-4 w-4" />}
                  >
                    {t("close.work")}
                  </TactileButton>
                  <TactileButton
                    className="text-base"
                    href={`${path("/")}#contact`}
                    variant="secondary"
                  >
                    {t("close.contact")}
                  </TactileButton>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
