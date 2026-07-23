export type Animal = {
  id: string;
  name: string;
  latin: string;
  description: string;
  funFact: string;
  image: string;
  illustration: string;
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
    illustration: "/images/illustrations/animal-karakal.jpg",
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
    illustration: "/images/illustrations/animal-lemur.jpg",
    habitat: "Madagaskar",
  },
  {
    id: "krokodyl",
    name: "Krokodyl krótkopyski",
    latin: "Osteolaemus tetraspis",
    description:
      "Niewielki krokodyl z Afryki — bezpieczne, edukacyjne spotkanie z opiekunem. Dowiesz się o adaptacjach do życia w wodzie i na lądzie oraz o ochronie gatunku.",
    funFact:
      "Krokodyl krótkopyski to jeden z najmniejszych krokodyli świata — dorosłe osobniki rzadko przekraczają 1,5 metra.",
    image: "/images/animal-crocodile.png",
    illustration: "/images/illustrations/animal-caiman.jpg",
    habitat: "Afryka",
  },
  {
    id: "alpaka",
    name: "Alpaka",
    latin: "Vicugna pacos",
    description:
      "Spokojne, ciekawskie zwierzęta z Ameryki Południowej. Idealne na pierwsze spotkanie — dzieci uczą się delikatnego kontaktu i obserwacji z bliska.",
    funFact: "Alpaki komunikują się przez delikatne mruczenie i pozycję uszu — każde ma swój charakter.",
    /** Zdjęcie docelowe klientka dośle — na razie placeholder demo */
    image: "/images/animal-goat.png",
    illustration: "/images/illustrations/animal-goat.jpg",
    habitat: "Andy (udomowiona)",
  },
  {
    id: "krolik",
    name: "Królik domowy",
    latin: "Oryctolagus cuniculus",
    description:
      "Miękkie, spokojne towarzyszki spotkań. Dzieci uczą się delikatnego dotyku i odpowiedzialności za mniejsze zwierzęta.",
    funFact: "Króliki mruczą, gdy są szczęśliwe — podobnie jak koty.",
    image: "/images/animal-rabbit.png",
    illustration: "/images/illustrations/animal-rabbit.jpg",
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
    illustration: "/images/illustrations/animal-snake.jpg",
    habitat: "Ameryka Północna",
  },
];
