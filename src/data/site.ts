export const site = {
  name: "egZOOturystyka",
  tagline: "Poznaj świat zwierząt",
  description:
    "Mini zoo w sercu Mazowsza — indywidualne spotkania ze zwierzętami dla rodzin oraz żywe lekcje biologii dla szkół.",
  email: "kontakt@egzooturystyka.pl",
  phone: "600 123 456",
  address: {
    street: "ul. Leśna 12",
    city: "Otwock",
    postalCode: "05-400",
    full: "ul. Leśna 12, 05-400 Otwock",
  },
  hours: "Wt–Nd: 10:00–18:00 (poniedziałek zamknięte)",
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
