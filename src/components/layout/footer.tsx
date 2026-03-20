import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const nav = await getTranslations("Nav");
  const footer = await getTranslations("Footer");

  return (
    <footer className="border-t border-rule bg-background">
      <div className="section-shell flex flex-col gap-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/intrface-icon-dark.svg"
            alt="Intrface icon"
            width={18}
            height={18}
          />
          <p>{footer("tagline")}</p>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/#projects" className="hover:text-foreground">
            {nav("projects")}
          </Link>
          <Link href="/aoc" className="hover:text-foreground">
            {nav("aoc")}
          </Link>
          <Link href="/voyager" className="hover:text-foreground">
            {nav("voyager")}
          </Link>
          <Link href="/#contact" className="hover:text-foreground">
            {nav("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
