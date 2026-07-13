import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = [
    "",
    "/rezerwacja",
    "/oferta",
    "/o-miejscu",
    "/zwierzeta",
    "/opinie",
    "/faq",
    "/kontakt",
    "/regulamin",
    "/polityka-prywatnosci",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" || path === "/rezerwacja" ? 1 : 0.8,
  }));
}
