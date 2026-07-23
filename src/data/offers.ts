export type OfferPackage = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  priceNote?: string;
  duration: string;
  groupSize: string;
  highlights: string[];
  popular?: boolean;
  image: string;
  icon?: string;
};

export const offers: OfferPackage[] = [
  {
    id: "rodzinna",
    title: "Spotkanie rodzinne",
    subtitle: "Kameralna wizyta dla 2–6 osób",
    price: 249,
    duration: "60–90 min",
    groupSize: "2–6 osób",
    highlights: [
      "Karakal, krokodyl i wiele innych gatunków",
      "Możliwość karmienia pod okiem opiekuna",
      "Pamiątkowe zdjęcia w cenie",
      "Przekąska dla dzieci",
    ],
    popular: true,
    image: "/images/hero-encounter.jpg",
    icon: "/images/illustrations/offer-family.jpg",
  },
  {
    id: "urodziny",
    title: "Przyjęcie urodzinowe",
    subtitle: "Niezapomniana impreza urodzinowa dla dzieci",
    price: 899,
    priceNote: "do 6 dzieci",
    duration: "2 godziny",
    groupSize: "6 dzieci + opiekunowie",
    highlights: [
      "Prywatna sala na tort i prezenty",
      "Program z opiekunem zwierząt",
      "Karmienie i kontakt ze zwierzętami",
      "Zaproszenia do pobrania przed imprezą",
    ],
    image: "/images/place-interior.png",
    icon: "/images/illustrations/offer-birthday.jpg",
  },
  {
    id: "szkola",
    title: "Żywa lekcja biologii",
    subtitle: "Różnorodny program edukacyjny dla klas 1–8 i nie tylko",
    price: 35,
    priceNote: "za ucznia",
    duration: "2 godziny",
    groupSize: "15–30 uczniów",
    highlights: [
      "Tematy dopasowane do wieku i sezonu",
      "Interaktywne pokazy i doświadczenia",
      "Opieka przewodnika-edukatora",
      "Możliwość dopasowania tematu lekcji",
    ],
    image: "/images/school-lesson.png",
    icon: "/images/illustrations/offer-school.jpg",
  },
];
