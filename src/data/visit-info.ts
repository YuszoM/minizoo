import { Clock, Footprints, ParkingCircle, Shield, Shirt } from "lucide-react";

export const beforeVisitTips = [
  {
    icon: Clock,
    title: "Przyjedź 5 minut wcześniej",
    text: "Krótkie powitanie, omówienie zasad i spokojne rozpoczęcie spotkania.",
  },
  {
    icon: ParkingCircle,
    title: "Parking gratis",
    text: "Miejsca parkingowe przy wejściu — bez dodatkowych opłat.",
  },
  {
    icon: Footprints,
    title: "Wygodne obuwie",
    text: "Część programu odbywa się na świeżym powietrzu i w strefie zwierząt.",
  },
  {
    icon: Shirt,
    title: "Strój na pogodę",
    text: "Warstwy ubrań — część spotkań jest w ogrzewanym pawilonie, część na zewnątrz.",
  },
  {
    icon: Shield,
    title: "Zasady bezpieczeństwa",
    text: "Dotyk zwierząt tylko za zgodą edukatora. Dzieci do 14 lat pod stałą opieką dorosłego.",
  },
] as const;
