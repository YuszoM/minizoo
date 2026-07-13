export type Animal = {
  id: string;
  name: string;
  latin: string;
  description: string;
  funFact: string;
  image: string;
  habitat: string;
};

export const animals: Animal[] = [
  {
    id: "karakal",
    name: "Karakal",
    latin: "Caracal caracal",
    description:
      "Elegancki kot dziki z charakterystycznymi czarnymi pędzelkami na uszach. U nas poznasz jego zwyczaje, sposób komunikacji i rolę w ekosystemie sawanny.",
    funFact: "Karakal potrafi wyskoczyć ponad 3 metry w górę, by złapać ptaka w locie.",
    image: "/images/animal-caracal.png",
    habitat: "Afryka, Azja",
  },
  {
    id: "lemur",
    name: "Lemur katta",
    latin: "Lemur catta",
    description:
      "Towarzyski ssak z Madagaskaru, rozpoznawalny po czarno-białym ogonie. Podczas spotkania zobaczysz, jak żyje w grupie i dlaczego ochrona gatunku jest tak ważna.",
    funFact: "Lemury komunikują się między sobą za pomocą ponad 20 różnych dźwięków.",
    image: "/images/animal-lemur.png",
    habitat: "Madagaskar",
  },
  {
    id: "kajman",
    name: "Kajman",
    latin: "Caiman crocodilus",
    description:
      "Reptyl z Ameryki Południowej — bezpieczne, edukacyjne spotkanie z opiekunem. Dowiesz się o adaptacjach do życia w wodzie i na lądzie.",
    funFact: "Kajmany potrafią zanurzyć się pod wodą i pozostać niewidoczne przez ponad godzinę.",
    image: "/images/animal-crocodile.png",
    habitat: "Ameryka Południowa",
  },
  {
    id: "koza",
    name: "Koza domowa",
    latin: "Capra hircus",
    description:
      "Przyjazne zwierzęta, które uwielbiają kontakt z dziećmi. Idealne na pierwsze spotkanie ze zwierzętami gospodarskimi.",
    funFact: "Kozy mają prostokątne źrenice — widzą prawie dookoła głowy.",
    image: "/images/animal-goat.png",
    habitat: "Cały świat",
  },
  {
    id: "krolik",
    name: "Królik domowy",
    latin: "Oryctolagus cuniculus",
    description:
      "Miękkie, spokojne towarzyszki spotkań. Dzieci uczą się delikatnego dotyku i odpowiedzialności za mniejsze zwierzęta.",
    funFact: "Króliki mruczą, gdy są szczęśliwe — podobnie jak koty.",
    image: "/images/animal-rabbit.png",
    habitat: "Udomowiony na całym świecie",
  },
  {
    id: "waz",
    name: "Wąż królewski",
    latin: "Lampropeltis getula",
    description:
      "Łagodny wąż, który pomaga przełamać strach przed gadami. Edukator opowiada o ich roli w naturze i sposobach ochrony.",
    funFact: "Węże królewskie są odporne na jad innych węży — stąd ich nazwa.",
    image: "/images/animal-snake.png",
    habitat: "Ameryka Północna",
  },
];
