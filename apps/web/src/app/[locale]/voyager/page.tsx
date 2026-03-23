import { VoyagerPage } from "@/components/pages/voyager-page";
import type { AppLocale } from "@/i18n/routing";

export default async function LocalizedVoyagerPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <VoyagerPage locale={locale} />;
}
