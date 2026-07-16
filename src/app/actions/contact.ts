"use server";

import { createHash } from "node:crypto";
import { getClientIp } from "@/lib/rate-limit/client-ip";
import { rateLimitHit } from "@/lib/rate-limit/upstash";
import { notifyEmail, sendResendEmail } from "@/lib/email/resend-client";
import { createServiceRoleClient } from "@/lib/supabase/clients";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactAction(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Honeypot — musi być puste */
  website?: string;
}): Promise<ContactResult> {
  if (input.website?.trim()) {
    // Bot — udaj sukces
    return { ok: true };
  }

  const ip = await getClientIp();
  const rl = await rateLimitHit({
    identifier: `contact:${ip}`,
    max: 5,
    windowSeconds: 3600,
    failClosed: false,
  });
  if (!rl.ok) {
    return { ok: false, error: "Zbyt wiele wiadomości. Spróbuj później." };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() || null;
  const subject = input.subject.trim() || "Kontakt";
  const message = input.message.trim();

  if (name.length < 2) return { ok: false, error: "Podaj imię." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Podaj poprawny e-mail." };
  }
  if (message.length < 10) {
    return { ok: false, error: "Wiadomość jest za krótka." };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Formularz nie jest skonfigurowany (Supabase)." };
  }

  const fullMessage = `Temat: ${subject}\n\n${message}`;
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

  const { error } = await supabase.from("contact_leads").insert({
    name,
    email,
    phone,
    message: fullMessage,
    source: "kontakt",
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[contact] insert error:", error);
    return { ok: false, error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." };
  }

  // Powiadomienie do admina — gdy Resend będzie skonfigurowany
  await sendResendEmail({
    to: notifyEmail(),
    subject: `Nowa wiadomość z formularza — ${subject}`,
    title: "Nowa wiadomość z kontakt",
    previewText: `${name}: ${message.slice(0, 80)}`,
    replyTo: email,
    innerHtml: `
      <p><strong>${escapeHtml(name)}</strong> napisał(a) przez formularz kontaktowy.</p>
      <table role="presentation" style="width:100%;margin:16px 0;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#71717a;">E-mail</td><td style="padding:6px 0;text-align:right;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#71717a;">Telefon</td><td style="padding:6px 0;text-align:right;">${escapeHtml(phone)}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#71717a;">Temat</td><td style="padding:6px 0;text-align:right;">${escapeHtml(subject)}</td></tr>
      </table>
      <p style="white-space:pre-wrap;background:#faf8f4;padding:16px;border-radius:8px;border:1px solid #e4e4e7;">${escapeHtml(message)}</p>
      <p style="font-size:13px;color:#71717a;">Wiadomość jest też w panelu: /admin/leady</p>
    `,
  });

  return { ok: true };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
