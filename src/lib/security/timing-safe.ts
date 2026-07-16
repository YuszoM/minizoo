import { timingSafeEqual } from "node:crypto";

/** Porównanie haseł / sekretów bez wycieku czasu (długość musi być taka sama). */
export function timingSafeEqualString(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
