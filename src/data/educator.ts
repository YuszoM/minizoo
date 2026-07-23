export type Educator = {
  name: string;
  role: string;
  experience: string;
  bio: string;
  highlights: string[];
  image: string;
};

export const educators: Educator[] = [
  {
    name: "Filip Wójcik",
    role: "Przewodnik",
    experience: "20+ lat z gadami",
    bio: "Podczas spotkań dzieli się wiedzą i ciekawostkami o gadach — to jego pasja od dzieciństwa. Urlop? Chętnie, ale zamiast plaży wybiera ekspedycje herpetologiczne i poszukiwania gadów.",
    highlights: [
      "Specjalizacja: gady i herpetologia",
      "Opowieści z wypraw terenowych",
      "Spokojne prowadzenie grup rodzinnych i szkolnych",
    ],
    image: "/images/educator-portrait.png",
  },
  {
    name: "Patrycja Wójcik",
    role: "Opiekunka zwierząt",
    experience: "Codzienna opieka nad mieszkańcami mini zoo",
    bio: "Na co dzień opiekuje się zwierzętami, więc zna ich codzienność z zupełnie innej perspektywy. Chętnie dzieli się ich historiami i pokazuje, że każde zwierzę ma swój wyjątkowy charakter.",
    highlights: [
      "Codzienna opieka i dobrostan zwierząt",
      "Historie i charaktery podopiecznych",
      "Kontakt z dziećmi przy karmieniu i obserwacji",
    ],
    image: "/images/educator-portrait.png",
  },
];

/** @deprecated użyj educators */
export const educator = educators[0]!;
