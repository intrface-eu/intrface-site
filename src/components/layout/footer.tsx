import Image from "next/image";
import Link from "next/link";

export function Footer() {
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
          <p>Intrface builds AI-native platforms, products, and systems.</p>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/#projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/#contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
