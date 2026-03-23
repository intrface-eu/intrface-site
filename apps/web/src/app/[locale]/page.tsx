import { HomePage } from "@/components/pages/home-page";
import type { AppLocale } from "@/i18n/routing";

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
