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
    value: "20+",
    label: "gatunków do poznania z bliska",
    icon: "/images/illustrations/fact-magnifier.jpg",
  },
  {
    id: "educator",
    value: "1",
    label: "stały edukator przy każdej wizycie",
    icon: "/images/illustrations/fact-journal.jpg",
  },
];
