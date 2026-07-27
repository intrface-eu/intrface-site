import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WorkClientSitesPage } from "@/components/pages/work-client-sites-page";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/site/metadata";

const PATH = "/work/client-sites";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildPageMetadata({
    locale,
    path: PATH,
    title: t("clientSites.title"),
    description: t("clientSites.description"),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <WorkClientSitesPage locale={locale} />;
}
