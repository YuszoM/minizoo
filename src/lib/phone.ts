/** Polski numer: dokładnie 9 cyfr (bez +48 / spacji). */
export const PHONE_DIGIT_COUNT = 9;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function sanitizePhoneInput(value: string) {
  return digitsOnly(value).slice(0, PHONE_DIGIT_COUNT);
}

export function isValidPhone(value: string) {
  return digitsOnly(value).length === PHONE_DIGIT_COUNT;
}
