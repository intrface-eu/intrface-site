/**
 * Stands in for `@/i18n/navigation` outside the Next app.
 *
 * The real module is next-intl's locale-aware navigation: its `Link` prefixes
 * every href with the active locale, which needs a request context that does
 * not exist in a preview card or in a design built with this system. Here
 * `Link` is a plain anchor and the hooks answer with the defaults a static
 * render needs, so a component that navigates still renders and still carries
 * its href.
 */
import type { AnchorHTMLAttributes } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; locale?: string };

export function Link({ href, locale: _locale, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function getPathname({ href }: { href: string; locale?: string }) {
  return href;
}

export function usePathname() {
  return "/";
}

export function useRouter() {
  return {
    push: () => undefined,
    replace: () => undefined,
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
    prefetch: () => undefined,
  };
}

export function redirect({ href }: { href: string }) {
  return href;
}
