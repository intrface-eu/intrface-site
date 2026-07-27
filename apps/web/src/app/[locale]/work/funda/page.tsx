import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WorkFundaPage } from "@/components/pages/work-funda-page";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/site/metadata";

const PATH = "/work/funda";

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
    title: t("funda.title"),
    description: t("funda.description"),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <WorkFundaPage locale={locale} />;
}
