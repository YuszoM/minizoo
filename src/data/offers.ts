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
};

export const offers: OfferPackage[] = [
  {
    id: "rodzinna",
    title: "Spotkanie rodzinne",
    subtitle: "Kameralna wizyta dla 2–6 osób",
    price: 249,
    duration: "90 minut",
    groupSize: "2–6 osób",
    highlights: [
      "Poznanie 8–10 gatunków zwierząt",
      "Możliwość karmienia pod okiem opiekuna",
      "Pamiątkowe zdjęcia w cenie",
      "Przekąska dla dzieci",
    ],
    popular: true,
    image: "/images/hero-encounter.png",
  },
  {
    id: "urodziny",
    title: "Urodziny w mini zoo",
    subtitle: "Niezapomniana impreza dla dziecka",
    price: 899,
    priceNote: "do 10 dzieci",
    duration: "2 godziny",
    groupSize: "do 10 dzieci + opiekunowie",
    highlights: [
      "Prywatna sala na tort i prezenty",
      "Program z opiekunem zwierząt",
      "Karmienie królików i kóz",
      "Dyplom uczestnika dla każdego dziecka",
    ],
    image: "/images/place-interior.png",
  },
  {
    id: "szkola",
    title: "Żywa lekcja biologii",
    subtitle: "Program edukacyjny dla klas 1–8",
    price: 35,
    priceNote: "za ucznia",
    duration: "2 godziny",
    groupSize: "15–30 uczniów",
    highlights: [
      "Materiały dydaktyczne zgodne z podstawą programową",
      "Interaktywne pokazy i doświadczenia",
      "Opieka przewodnika-edukatora",
      "Możliwość dopasowania tematu lekcji",
    ],
    image: "/images/school-lesson.png",
  },
];
