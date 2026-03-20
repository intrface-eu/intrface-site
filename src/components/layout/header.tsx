import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b border-rule bg-background/95 backdrop-blur-sm">
      <div className="section-shell flex h-18 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Intrface home">
          <Image
            src="/brand/intrface-icon-dark.svg"
            alt="Intrface icon"
            width={26}
            height={26}
            priority
          />
          <Image
            src="/brand/intrface-logo-text-dark.svg"
            alt="Intrface"
            width={122}
            height={22}
            priority
            className="h-auto w-[122px]"
          />
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-[-0.01em] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
