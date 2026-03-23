import { AocPage } from "@/components/pages/aoc-page";
import type { AppLocale } from "@/i18n/routing";

export default async function LocalizedAocPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <AocPage locale={locale} />;
}
