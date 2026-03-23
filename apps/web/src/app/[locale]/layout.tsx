import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";

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

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      <Header locale={activeLocale} />
      <div className="flex-1">{children}</div>
      <Footer locale={activeLocale} />
    </NextIntlClientProvider>
  );
}
