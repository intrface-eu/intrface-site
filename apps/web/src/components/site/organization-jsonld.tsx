import {
  AOC_REPO_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_TEL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site/config";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  // The registered name from the court register, not the wordmark.
  legalName: "INTRFACE j.d.o.o.",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE_TEL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/brand/intrface-icon.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dalmatinska 34",
    postalCode: "52440",
    addressLocality: "Vrsar",
    addressRegion: "Istria",
    addressCountry: "HR",
  },
  // OIB — the Croatian entity identifier. Named so a consumer knows what the
  // number is, rather than seeing a bare string.
  identifier: {
    "@type": "PropertyValue",
    name: "OIB",
    value: "34363240459",
  },
  areaServed: "EU",
  knowsAbout: [
    "Software engineering",
    "AI-assisted delivery",
    "Place intelligence",
    "Civic data infrastructure",
  ],
  sameAs: [AOC_REPO_URL],
};

/** Organization structured data. Rendered once, in the root layout. */
export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Static, author-controlled object — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
