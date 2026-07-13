import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Skontaktuj się z ${site.name} — pytania o rezerwacje, wizyty szkolne i dojazd.`,
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
