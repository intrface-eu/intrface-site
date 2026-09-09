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
    path: "/work/astyle-marine",
    title: t("astyleMarine.title"),
    description: t("astyleMarine.description"),
  });
}

export default async function Page({ params }: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  return <ProjectShowcase locale={locale} projectKey="astyleMarine" />;
}
