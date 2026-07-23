export type FunFact = {
  id: string;
  value: string;
  label: string;
  icon: string;
};

export const funFacts: FunFact[] = [
  {
    id: "groups",
    value: "max 6",
    label: "osób w grupie — bez tłumów",
    icon: "/images/illustrations/fact-touch.jpg",
  },
  {
    id: "species",
    value: "12+",
    label: "gatunków — karakal, krokodyl i inni",
    icon: "/images/illustrations/fact-magnifier.jpg",
  },
  {
    id: "educator",
    value: "2",
    label: "przewodnicy — Filip i Patrycja",
    icon: "/images/illustrations/fact-journal.jpg",
  },
  {
    id: "booking",
    value: "3 min",
    label: "rezerwacja online · płatność na miejscu",
    icon: "/images/illustrations/fact-butterfly.jpg",
  },
];
