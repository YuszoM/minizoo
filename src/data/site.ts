export const site = {
  name: "egZOOturystyka",
  tagline: "Poznaj świat zwierząt",
  description:
    "Mini zoo na Dolnym Śląsku — indywidualne spotkania ze zwierzętami dla rodzin oraz żywe lekcje biologii dla szkół. Ok. 45 minut od Wrocławia, 20 minut od Oleśnicy i Trzebnicy.",
  email: "kontakt@egzooturystyka.pl",
  phone: "600 123 456",
  startingPrice: 249,
  photosAreDemo: false,
  address: {
    street: "Sadków 20B",
    city: "Sadków",
    municipality: "Dobroszyce",
    region: "dolnośląskie",
    postalCode: "56-410",
    full: "Sadków 20B, 56-410 Sadków",
    mapQuery: "Sadków 20B, 56-410 Sadków, Polska",
    lat: 51.30747,
    lng: 17.3146,
  },
  hours: "Wt–Nd: 10:00–18:00 (poniedziałek zamknięte)",
  travel: {
    wroclaw: "45 min",
    olesnica: "20 min",
    trzebnica: "20 min",
  },
  googleReviews: {
    rating: "4,9",
    reviewCount: 27,
    /** Podmień na link do profilu Google po uruchomieniu wizytówki */
    url: "https://www.google.com/maps/search/?api=1&query=egZOOturystyka+Sadk%C3%B3w+mini+zoo",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;

export const navLinks = [
  { href: "/oferta", label: "Oferta" },
  { href: "/o-miejscu", label: "O miejscu" },
  { href: "/zwierzeta", label: "Zwierzęta" },
  { href: "/opinie", label: "Opinie" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const footerLinks = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;

export function getMapEmbedUrl() {
  const { lat, lng, mapQuery } = site.address;
  const query = encodeURIComponent(`${lat},${lng} (${mapQuery})`);
  return `https://www.google.com/maps?q=${query}&hl=pl&z=16&output=embed`;
}

export function getMapLinkUrl() {
  const query = encodeURIComponent(site.address.full);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
