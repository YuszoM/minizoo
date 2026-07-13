import { faqItems } from "@/data/faq";
import { offers } from "@/data/offers";
import { site } from "@/data/site";
import { getSiteUrl } from "@/lib/site-url";

export function JsonLdOrganization() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: site.name,
    description: site.description,
    url,
    image: `${url}/brand/logo.jpeg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: "Dolnośląskie",
      postalCode: site.address.postalCode,
      addressCountry: "PL",
    },
    telephone: site.phone,
    email: site.email,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "27",
      bestRating: "5",
    },
    makesOffer: offers.map((o) => ({
      "@type": "Offer",
      name: o.title,
      price: o.price,
      priceCurrency: "PLN",
      url: `${url}/rezerwacja?pakiet=${o.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdFaq() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
