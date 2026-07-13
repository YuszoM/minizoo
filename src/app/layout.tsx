import type { Metadata } from "next";
import { Karla, Spectral } from "next/font/google";
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
    "Mini zoo pod Warszawą — kameralne spotkania ze zwierzętami dla rodzin oraz żywe lekcje biologii dla szkół. Rezerwacja i płatność online.",
  openGraph: {
    title: "egZOOturystyka — Poznaj świat zwierząt",
    description:
      "Indywidualne grupy, żywa biologia dla szkół. Zarezerwuj termin w kilka minut.",
    locale: "pl_PL",
    type: "website",
    url: siteUrl,
    images: [{ url: "/brand/logo.jpeg", width: 800, height: 800, alt: "egZOOturystyka" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${karla.variable} ${spectral.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
