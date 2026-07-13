import type { Metadata } from "next";
import { Karla, Spectral } from "next/font/google";
import { JsonLdFaq, JsonLdOrganization } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "egZOOturystyka — Mini zoo | Spotkania ze zwierzętami",
    template: "%s | egZOOturystyka",
  },
  description:
    "Mini zoo pod Wrocławiem — kameralne spotkania ze zwierzętami dla rodzin oraz żywe lekcje biologii dla szkół. Rezerwacja i płatność online.",
  icons: {
    icon: [{ url: "/brand/logo.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/brand/logo.jpeg", type: "image/jpeg" }],
  },
  openGraph: {
    title: "egZOOturystyka — Poznaj świat zwierząt",
    description:
      "Indywidualne grupy, żywa biologia dla szkół. Zarezerwuj termin w kilka minut.",
    locale: "pl_PL",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spotkanie ze zwierzętami w mini zoo egZOOturystyka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "egZOOturystyka — Mini zoo pod Wrocławiem",
    description:
      "Kameralne spotkania ze zwierzętami i lekcje biologii. Rezerwacja online.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${karla.variable} ${spectral.variable}`}>
      <body className="min-h-screen antialiased">
        <JsonLdOrganization />
        <JsonLdFaq />
        {children}
      </body>
    </html>
  );
}
