import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectShowcase } from "@/components/work/project-showcase";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/site/metadata";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata({
    locale,
    path: "/work/velum",
    title: t("velum.title"),
    description: t("velum.description"),
  });
}

export default async function Page({ params }: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  return <ProjectShowcase locale={locale} projectKey="velum" />;
}
