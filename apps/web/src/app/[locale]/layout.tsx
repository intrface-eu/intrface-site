import type { Metadata } from "next";
import { Geist_Mono, Google_Sans_Flex } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { OrganizationJsonLd } from "@/components/site/organization-jsonld";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site/config";
import "../globals.css";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  fallback: ["Inter", "Segoe UI", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = routing.locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${t("tagline")}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${t("tagline")}`,
      description: t("description"),
      url: "/",
    },
    icons: {
      icon: [
        { url: "/brand/intrface-icon.svg", media: "(prefers-color-scheme: light)" },
        { url: "/brand/intrface-icon-dark.svg", media: "(prefers-color-scheme: dark)" },
      ],
      shortcut: "/brand/intrface-icon.svg",
      apple: "/brand/intrface-icon.svg",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const activeLocale = locale as (typeof routing.locales)[number];
  setRequestLocale(activeLocale);
  const messages = await getMessages({ locale: activeLocale });
  const nav = await getTranslations({ locale: activeLocale, namespace: "Nav" });

  return (
    <html
      lang={activeLocale}
      className={`${googleSansFlex.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <NextIntlClientProvider locale={activeLocale} messages={messages}>
          <a className="skip-link type-caption" href="#main-content">
            {nav("skipToContent")}
          </a>
          <Header locale={activeLocale} />
          {/* Each page renders its own `<main>`, so the landmark's wrapper is
              what the skip link can name. `tabIndex={-1}` is what makes the
              jump move focus and not just the scroll position; the ring is off
              because this is a region, not a control, and Chrome would draw one
              around the entire page. */}
          <div className="flex-1 focus:outline-none" id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Footer locale={activeLocale} />
        </NextIntlClientProvider>
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
