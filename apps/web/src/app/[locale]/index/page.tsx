import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { IndexAboutPage } from "@/components/pages/index-about-page";
import { buildPageMetadata } from "@/lib/site/metadata";
import { PRODUCT_PAGE_LOCALE } from "@/lib/site/product-roots";

const PATH = "/index";
const locale = PRODUCT_PAGE_LOCALE;

// English only, like every page of a product not open yet: next.config.ts
// sends the other locales to /en/index, so only the English page is built.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale }];
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "IndexAbout" });

  return buildPageMetadata({
    locale,
    path: PATH,
    translated: false,
    title: t("eyebrow"),
    description: `${t("lede")} ${t("status")}.`,
  });
}

export default function Page() {
  return <IndexAboutPage locale={locale} />;
}
