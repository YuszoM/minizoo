export const site = {
  name: "egZOOturystyka",
  tagline: "Poznaj świat zwierząt",
  description:
    "Mini zoo na Dolnym Śląsku — indywidualne spotkania ze zwierzętami dla rodzin oraz żywe lekcje biologii dla szkół, 30 minut od Wrocławia.",
  email: "kontakt@egzooturystyka.pl",
  phone: "600 123 456",
  startingPrice: 249,
  photosAreDemo: true,
  address: {
    street: "Sadków 12",
    city: "Sadków",
    municipality: "Kąty Wrocławskie",
    region: "dolnośląskie",
    postalCode: "55-080",
    full: "Sadków, 55-080 Kąty Wrocławskie",
    mapQuery: "Sadków, Kąty Wrocławskie, dolnośląskie",
    lat: 51.049167,
    lng: 16.836389,
  },
  hours: "Wt–Nd: 10:00–18:00 (poniedziałek zamknięte)",
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
  const query = encodeURIComponent(site.address.mapQuery);
  return `https://www.google.com/maps?q=${query}&hl=pl&z=14&output=embed`;
}

export function getMapLinkUrl() {
  const query = encodeURIComponent(site.address.full);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
