import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PatchbayPage } from "@/components/pages/patchbay-page";
import { buildPageMetadata } from "@/lib/site/metadata";
import { PRODUCT_PAGE_LOCALE } from "@/lib/site/product-roots";

const PATH = "/patchbay";
const locale = PRODUCT_PAGE_LOCALE;

// English only, like every page of a product not open yet: next.config.ts
// sends the other locales to /en/patchbay, so only the English page is built.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale }];
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "WorkIndex.entries.patchbay" });

  // The same shape as Polis and Funda: the name, then "{interface}. {status}."
  return buildPageMetadata({
    locale,
    path: PATH,
    translated: false,
    title: t("name"),
    description: `${t("interface")}. ${t("status")}.`,
  });
}

export default function Page() {
  return <PatchbayPage locale={locale} />;
}
