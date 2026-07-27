import { AOC_REPO_URL, CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site/config";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/brand/intrface-icon.svg`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Istria",
    addressCountry: "HR",
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
