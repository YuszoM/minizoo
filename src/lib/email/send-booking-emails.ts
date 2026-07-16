import { sendResendEmail } from "@/lib/email/resend-client";
import { formatDatePL, formatPrice } from "@/lib/utils";

type BookingEmailPayload = {
  to: string;
  customerName: string;
  orderNumber: string;
  offerTitle: string;
  visitDate: Date;
  visitTime: string;
  guestCount: number;
  totalPrice: number;
  ticketCodes: string[];
};

export async function sendBookingConfirmationEmail(payload: BookingEmailPayload) {
  const dateLabel = formatDatePL(payload.visitDate);
  const innerHtml = `
    <p>Cześć ${payload.customerName.split(" ")[0] || payload.customerName},</p>
    <p>Twoja rezerwacja w mini zoo została <strong>potwierdzona</strong>.</p>
    <table role="presentation" style="width:100%;margin:16px 0;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#71717a;">Numer zamówienia</td><td style="padding:6px 0;font-weight:600;text-align:right;">${payload.orderNumber}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Pakiet</td><td style="padding:6px 0;font-weight:600;text-align:right;">${payload.offerTitle}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Termin</td><td style="padding:6px 0;font-weight:600;text-align:right;">${dateLabel}, godz. ${payload.visitTime}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Liczba osób</td><td style="padding:6px 0;font-weight:600;text-align:right;">${payload.guestCount}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Kwota do zapłaty na miejscu</td><td style="padding:6px 0;font-weight:600;text-align:right;">${formatPrice(payload.totalPrice)}</td></tr>
    </table>
    <p>Bilety wysyłamy w osobnej wiadomości. Pokaż numery biletów przy wejściu i ureguluj płatność na miejscu.</p>
    <p>Do zobaczenia!</p>
  `;

  return sendResendEmail({
    to: payload.to,
    subject: `Potwierdzenie rezerwacji ${payload.orderNumber} — egZOOturystyka`,
    title: "Rezerwacja potwierdzona",
    previewText: `Termin: ${dateLabel}, godz. ${payload.visitTime}`,
    innerHtml,
  });
}

export async function sendBookingTicketsEmail(payload: BookingEmailPayload) {
  const dateLabel = formatDatePL(payload.visitDate);
  const ticketsList = payload.ticketCodes
    .map(
      (code, i) =>
        `<li style="margin:8px 0;font-family:monospace;font-size:18px;font-weight:700;letter-spacing:0.08em;">Bilet ${i + 1}: ${code}</li>`,
    )
    .join("");

  const innerHtml = `
    <p>Cześć ${payload.customerName.split(" ")[0] || payload.customerName},</p>
    <p>Oto numery biletów na wizytę <strong>${dateLabel}</strong>, godz. <strong>${payload.visitTime}</strong>.</p>
    <p style="margin:12px 0 8px;font-size:13px;color:#71717a;">Zamówienie ${payload.orderNumber} · ${payload.guestCount} ${payload.guestCount === 1 ? "osoba" : payload.guestCount < 5 ? "osoby" : "osób"}</p>
    <ul style="list-style:none;padding:16px;margin:16px 0;background:#faf8f4;border-radius:8px;border:1px solid #e4e4e7;">${ticketsList}</ul>
    <p style="font-size:14px;color:#52525b;">Zachowaj tę wiadomość. Przy wejściu podaj numer biletów lub imię z rezerwacji.</p>
  `;

  return sendResendEmail({
    to: payload.to,
    subject: `Twoje bilety — ${dateLabel}, ${payload.visitTime}`,
    title: "Bilety na wizytę",
    previewText: `Numery biletów: ${payload.ticketCodes.join(", ")}`,
    innerHtml,
  });
}

export async function sendBookingEmails(payload: BookingEmailPayload) {
  const confirmation = await sendBookingConfirmationEmail(payload);
  const tickets = await sendBookingTicketsEmail(payload);

  if (!confirmation.ok || !tickets.ok) {
    return {
      ok: false as const,
      error: confirmation.ok ? tickets.error : confirmation.error,
    };
  }

  return { ok: true as const };
}
