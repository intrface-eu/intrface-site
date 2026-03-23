import { FundaPage } from "@/components/pages/funda-page";
import type { AppLocale } from "@/i18n/routing";

export default async function LocalizedFundaPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <FundaPage locale={locale} />;
}
