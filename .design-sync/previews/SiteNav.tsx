import { SiteNav } from "@intrface/web";

export const HeaderNav = () => (
  <SiteNav
    items={[
      { href: "/work", label: "Work", match: "/work" },
      { href: "/method", label: "Method", match: "/method" },
      { href: "/about", label: "About", match: "/about" },
      { href: "/about#contact", label: "Contact" },
    ]}
  />
);
