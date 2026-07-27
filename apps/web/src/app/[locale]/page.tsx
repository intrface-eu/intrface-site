import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HomePage } from "@/components/pages/home-page";
import type { AppLocale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/site/metadata";

const PATH = "/";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    ...buildPageMetadata({
      locale,
      path: PATH,
      title: t("tagline"),
      description: t("description"),
    }),
    // The home page carries the site name itself rather than the `%s · INTRFACE` template.
    title: {
      absolute: `${SITE_NAME} — ${t("tagline")}`,
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
