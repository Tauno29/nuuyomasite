import { getContent } from "@/lib/site";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import AnalyticsTracker from "@/components/site/AnalyticsTracker";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: content["site.name"],
    description: content["site.about_short"],
    url: siteUrl,
    logo: `${siteUrl}/assets/school-crest.webp`,
    telephone: content["site.phone"],
    email: content["site.email"],
    foundingDate: content["site.founded"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Oshikuku",
      addressRegion: "Omusati",
      addressCountry: "NA",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Secondary education",
      itemListElement: ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => ({
        "@type": "Course",
        name: grade,
      })),
    },
  };

  return (
    <>
      <AnalyticsTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader
        content={{
          name: content["site.name"],
          shortName: content["site.short_name"],
          phone: content["site.phone"],
          email: content["site.email"],
          location: content["site.location"],
          registration: content["site.registration"],
          alertEnabled: content["alert.enabled"] === "yes",
          alertMessage: content["alert.message"],
          alertLabel: content["alert.label"],
          alertUrl: content["alert.url"].startsWith("/") ? content["alert.url"] : "/admissions",
        }}
      />
      <main>{children}</main>
      <SiteFooter
        content={{
          name: content["site.name"],
          about: content["site.about_short"],
          location: content["site.location"],
          email: content["site.email"],
          phone: content["site.phone"],
          founded: content["site.founded"],
          region: content["site.region"],
          newsletterText: content["footer.newsletter_text"],
        }}
      />
    </>
  );
}
