import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PrivacyPage } from "@/components/pages/legal-page";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/site/metadata";

const PATH = "/privacy";

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
    title: t("privacy.title"),
    description: t("privacy.description"),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <PrivacyPage locale={locale} />;
}
