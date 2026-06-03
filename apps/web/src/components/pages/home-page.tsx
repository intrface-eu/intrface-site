import type { AppLocale } from "@/i18n/routing";
import { FadeIn } from "@/components/site/fade-in";
import { HalftoneDots } from "@/components/visual/halftone-dots";
import {
  IconArrowRight,
  IconBriefcase,
  IconCode,
  IconDeviceDesktopAnalytics,
  IconMessages,
} from "@tabler/icons-react";

const services = [
  {
    icon: IconBriefcase,
    title: "Business consultancy",
    text: "We help teams clarify service direction, operational requirements, delivery priorities, and the software decisions behind them.",
  },
  {
    icon: IconCode,
    title: "Software development",
    text: "We design, build, and maintain web applications, internal tools, automation, data workflows, and production-ready digital systems.",
  },
  {
    icon: IconDeviceDesktopAnalytics,
    title: "Technical strategy",
    text: "We audit existing systems, map risks, plan modernization, and turn ambiguous business needs into practical engineering execution.",
  },
] as const;

const process = [
  "Discovery and business analysis",
  "Technical planning",
  "Interface and workflow design",
  "Full-stack implementation",
  "Launch support and iteration",
  "Long-term advisory partnership",
] as const;

export async function HomePage({ locale }: { locale: AppLocale }) {
  void locale;

  return (
    <main className="bg-[#f5f1eb] text-[var(--intrface-ink)]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-[-12rem] top-[-16rem] h-[42rem] w-[42rem] rounded-full bg-slate-700/8 blur-[100px]" />
          <div className="absolute bottom-[-20rem] left-[-16rem] h-[42rem] w-[42rem] rounded-full bg-teal-700/8 blur-[100px]" />
          <div className="absolute inset-x-0 top-20 h-80 halftone-field opacity-20 [--halftone-color:var(--intrface-ink)] [--halftone-size:34px]" data-drift="true" />
        </div>
        <div className="section-shell relative grid gap-14 py-24 sm:py-32 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-36">
          <div className="max-w-5xl">
            <FadeIn>
              <p className="type-section-label">Intrface consultancy</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="mt-6 max-w-5xl text-[3.5rem] font-semibold leading-[0.9] tracking-[-0.07em] sm:text-[5.4rem] lg:text-[6.4rem]">
                Business and software development consultancy.
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="mt-8 max-w-3xl text-xl font-medium leading-relaxed text-slate-700 sm:text-2xl">
                Intrface helps organizations plan, design, and build reliable software systems that support real business operations.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#services" className="artifact-button rounded-full bg-[var(--intrface-ink)] px-8 py-4 text-sm font-semibold text-white shadow-xl">
                  View services
                </a>
                <a href="#contact" className="artifact-button inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-8 py-4 text-sm font-semibold text-[var(--intrface-ink)] hover:bg-white">
                  Contact us
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={180}>
            <div className="relative overflow-hidden rounded-[2.75rem] border border-black/10 bg-white/64 p-5 shadow-[0_45px_120px_-70px_rgba(15,23,41,.55)]">
              <HalftoneDots variant="ink" density="coarse" className="pointer-events-none absolute inset-0 h-full w-full opacity-35" />
              <div className="relative rounded-[2rem] border border-black/10 bg-white/72 p-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500">consultancy operating system</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {process.slice(0, 4).map((item, index) => (
                    <div key={item} className="rounded-2xl border border-black/8 bg-[#fbfaf7] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">0{index + 1}</p>
                      <p className="mt-3 text-base font-semibold tracking-[-.03em] text-slate-950">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-teal-900/10 bg-teal-700/8 p-4 text-sm font-medium leading-6 text-teal-950">
                  Strategy, business thinking, and engineering delivery in one accountable partner.
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 border-b border-black/10 bg-[#fbf8f2]">
        <div className="section-shell py-20 sm:py-24">
          <div className="max-w-3xl">
            <FadeIn><p className="type-section-label">Services</p></FadeIn>
            <FadeIn delay={100}><h2 className="type-heading mt-4">Consulting and implementation for serious software work.</h2></FadeIn>
            <FadeIn delay={200}><p className="mt-5 text-base leading-7 text-slate-600">We work where business requirements, user workflows, and technical execution need to be aligned carefully.</p></FadeIn>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <FadeIn key={service.title} delay={100 + index * 80}>
                  <article className="artifact-card h-full rounded-[2rem] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/5">
                      <Icon className="h-6 w-6 text-slate-900" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-.045em] text-slate-950">{service.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{service.text}</p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#f5f1eb]">
        <div className="section-shell py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <FadeIn><p className="type-section-label">How we work</p></FadeIn>
              <FadeIn delay={100}><h2 className="type-heading mt-4 max-w-lg">Clear decisions, pragmatic delivery, maintainable systems.</h2></FadeIn>
              <FadeIn delay={200}><p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Intrface can support early planning, active delivery, or technical cleanup. The engagement is shaped around the business problem and the reliability of the software behind it.</p></FadeIn>
            </div>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/70 p-5 shadow-[0_30px_90px_-62px_rgba(15,23,41,.5)]">
              <div className="pointer-events-none absolute inset-0 halftone-field opacity-25 [--halftone-color:var(--intrface-ink)] [--halftone-size:28px]" aria-hidden="true" />
              <div className="relative grid gap-3 sm:grid-cols-2">
                {process.map((item, index) => (
                  <div key={item} className="artifact-card rounded-[1.5rem] p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
                      <p className="text-sm font-semibold tracking-[-.02em] text-slate-950">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[var(--intrface-ink)] text-white">
        <div className="section-shell py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <FadeIn><p className="text-xs font-semibold uppercase tracking-[.24em] text-white/45">Contact</p></FadeIn>
              <FadeIn delay={100}><h2 className="mt-5 max-w-3xl text-[3rem] font-semibold leading-[.98] tracking-[-.055em] sm:text-[4.2rem]">Talk to Intrface about business or software development.</h2></FadeIn>
              <FadeIn delay={200}><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">Send a short note about the organization, the problem, and what kind of support you need. We will route the conversation from there.</p></FadeIn>
            </div>
            <FadeIn delay={250}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-6">
                <div className="pointer-events-none absolute inset-0 halftone-field opacity-20 [--halftone-color:white] [--halftone-size:24px]" aria-hidden="true" />
                <div className="relative grid gap-3 sm:grid-cols-2">
                  {["Business consulting", "Software development", "Technical strategy", "Delivery partnership"].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[.03] px-4 py-4 text-sm text-white/78">{item}</div>
                  ))}
                </div>
                <a href="mailto:hello@intrface.eu" className="artifact-button relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[var(--intrface-ink)]">
                  hello@intrface.eu
                  <IconMessages className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
