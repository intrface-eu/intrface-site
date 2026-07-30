import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** The order of the work index. A case hands the reader the next file in it,
    so the last thing on a case page is another case rather than a dead end. */
const ORDER = [
  { key: "voyager", href: "/work/voyager" },
  { key: "polis", href: "/work/polis" },
  { key: "funda", href: "/work/funda" },
  { key: "clientSites", href: "/work/client-sites" },
] as const;

export type CaseKey = (typeof ORDER)[number]["key"];

export async function CaseNav({ current }: { current: CaseKey }) {
  const t = await getTranslations("CaseNav");
  const index = await getTranslations("WorkIndex");

  const position = ORDER.findIndex((entry) => entry.key === current);
  const next = ORDER[(position + 1) % ORDER.length];

  return (
    <nav aria-label={t("label")} className="border-t border-rule bg-paper">
      <div className="section-shell flex flex-wrap items-end justify-between gap-x-10 gap-y-8 py-10 sm:py-12">
        <Link
          className="type-meta inline-flex items-center gap-2 border-b border-rule pb-1.5 transition-colors hover:border-current hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none"
          href="/work"
        >
          <IconArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t("index")}
        </Link>

        <Link
          className="group inline-flex flex-col items-start gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:items-end"
          href={next.href}
        >
          <span className="type-meta">{t("next")}</span>
          <span className="type-subheading inline-flex items-center gap-2 border-b border-rule pb-1.5 text-ink transition-colors group-hover:border-current motion-reduce:transition-none">
            {index(`entries.${next.key}.name`)}
            <IconArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </nav>
  );
}
