import { generateNumericTicketCode, generateOrderNumber } from "@/lib/booking/ticket-code";
import { isResendConfigured, sendResendEmail } from "@/lib/email/resend-client";
import { createServiceRoleClient } from "@/lib/supabase/clients";
import { generateVoucherPdf } from "@/lib/voucher/generate-pdf";
import { formatPrice } from "@/lib/utils";
import { site } from "@/data/site";

export type CreateVoucherInput = {
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone: string;
  recipientName?: string;
  dedication?: string;
  amount?: number;
};

export type CreateVoucherResult =
  | {
      ok: true;
      voucherCode: string;
      orderNumber: string;
      validUntil: string;
      amount: number;
      emailSent: boolean;
    }
  | { ok: false; error: string };

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function insertUniqueVoucherCode(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  payload: Record<string, unknown>,
): Promise<{ code: string; id: string } | null> {
  for (let i = 0; i < 12; i++) {
    const code = generateNumericTicketCode();
    const { data, error } = await supabase
      .from("vouchers")
      .insert({ ...payload, voucher_code: code })
      .select("id, voucher_code")
      .single();

    if (!error && data) {
      return { code: data.voucher_code, id: data.id };
    }
    if (error?.code !== "23505") {
      console.error("[voucher] insert error:", error);
      return null;
    }
  }
  return null;
}

export async function createVoucher(input: CreateVoucherInput): Promise<CreateVoucherResult> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "System bonów nie jest skonfigurowany (Supabase)." };
  }

  const purchaserName = input.purchaserName.trim();
  const purchaserEmail = input.purchaserEmail.trim().toLowerCase();
  const purchaserPhone = input.purchaserPhone.trim();
  const recipientName = input.recipientName?.trim() || null;
  const dedication = input.dedication?.trim() || null;
  const amount = input.amount ?? site.startingPrice;

  if (purchaserName.length < 3) return { ok: false, error: "Podaj imię i nazwisko." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(purchaserEmail)) {
    return { ok: false, error: "Podaj poprawny e-mail." };
  }
  if (purchaserPhone.replace(/\D/g, "").length < 9) {
    return { ok: false, error: "Podaj poprawny numer telefonu." };
  }
  if (amount < 1) return { ok: false, error: "Nieprawidłowa kwota bonu." };

  const validUntil = addMonths(new Date(), 12);
  const orderNumber = generateOrderNumber().replace("EGZ-", "BON-");

  const inserted = await insertUniqueVoucherCode(supabase, {
    order_number: orderNumber,
    purchaser_name: purchaserName,
    purchaser_email: purchaserEmail,
    purchaser_phone: purchaserPhone,
    recipient_name: recipientName,
    dedication,
    amount,
    valid_until: toIsoDate(validUntil),
    status: "active",
  });

  if (!inserted) {
    return { ok: false, error: "Nie udało się utworzyć bonu. Spróbuj ponownie." };
  }

  let emailSent = false;
  try {
    const pdf = await generateVoucherPdf({
      voucherCode: inserted.code,
      amount,
      purchaserName,
      recipientName,
      dedication,
      validUntil,
    });

    if (isResendConfigured()) {
      const mail = await sendResendEmail({
        to: purchaserEmail,
        subject: `Twój bon podarunkowy ${inserted.code} — egZOOturystyka`,
        title: "Bon podarunkowy",
        previewText: `Kod: ${inserted.code} · ${formatPrice(amount)}`,
        attachments: [
          {
            filename: `bon-${inserted.code}.pdf`,
            content: pdf,
            contentType: "application/pdf",
          },
        ],
        innerHtml: `
          <p>Cześć ${purchaserName.split(" ")[0] || purchaserName},</p>
          <p>Dziękujemy za zakup bonu. PDF jest w załączniku — możesz go wydrukować lub przesłać dalej.</p>
          <p><strong>Kod bonu:</strong> <span style="font-family:monospace;font-size:18px;letter-spacing:0.08em;">${inserted.code}</span></p>
          <p>Kwota: <strong>${formatPrice(amount)}</strong> · Ważny do ${toIsoDate(validUntil)}</p>
          <p style="font-size:14px;color:#52525b;">Płatność za bon uregulujesz na miejscu przy odbiorze / w ustalony sposób z organizatorem. Odbiorca rezerwuje termin online lub telefonicznie, podając kod.</p>
        `,
      });
      emailSent = mail.ok;
    }
  } catch (e) {
    console.error("[voucher] pdf/email error:", e);
  }

  return {
    ok: true,
    voucherCode: inserted.code,
    orderNumber,
    validUntil: toIsoDate(validUntil),
    amount,
    emailSent,
  };
}

export type VoucherRow = {
  id: string;
  voucher_code: string;
  order_number: string;
  purchaser_name: string;
  purchaser_email: string;
  purchaser_phone: string;
  recipient_name: string | null;
  dedication: string | null;
  amount: number;
  valid_until: string;
  status: string;
  created_at: string;
};

export async function fetchVouchers(limit = 100): Promise<VoucherRow[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("vouchers")
    .select(
      "id, voucher_code, order_number, purchaser_name, purchaser_email, purchaser_phone, recipient_name, dedication, amount, valid_until, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.error("[voucher] fetch:", error);
    return [];
  }
  return data as VoucherRow[];
}
