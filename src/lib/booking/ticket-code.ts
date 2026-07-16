const TICKET_CODE_LENGTH = 10;

/** Losowy ciąg cyfr (10 znaków, bez wiodącego zera). */
export function generateNumericTicketCode(): string {
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  const n = (bytes[0]! * 0x100000000 + bytes[1]!) % 9_000_000_000 + 1_000_000_000;
  return String(n).padStart(TICKET_CODE_LENGTH, "0").slice(0, TICKET_CODE_LENGTH);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = generateNumericTicketCode().slice(-4);
  return `EGZ-${y}${m}${d}-${suffix}`;
}
