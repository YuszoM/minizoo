export type Educator = {
  name: string;
  /** Krótka linia pod imieniem (rola / doświadczenie) */
  subtitle: string;
  bio: string;
  image?: string;
};

export const educators: Educator[] = [
  {
    name: "Filip Wójcik",
    subtitle: "20+ lat z gadami",
    bio: "Podczas spotkań dzieli się swoją wiedzą i fascynującymi ciekawostkami o gadach, które są jego pasją od dzieciństwa. Urlop? Chętnie, ale zamiast plaży wybiera ekspedycje herpetologiczne i poszukiwania gadów.",
    image: "/images/educator-filip.jpg",
  },
  {
    name: "Patrycja Wójcik",
    subtitle: "opiekunka zwierząt",
    bio: "Na co dzień opiekuje się zwierzętami, więc zna ich codzienność z zupełnie innej perspektywy. Chętnie dzieli się ich historiami i pokazuje, że każde zwierzę ma swój wyjątkowy charakter.",
    image: "/images/educator-patrycja.jpg",
  },
];

/** @deprecated użyj educators */
export const educator = educators[0]!;
