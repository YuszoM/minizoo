import { wrapResendHtml } from "@/lib/email/resend-layout";

export type ResendAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) return null;
  return { apiKey, from };
}

export function isResendConfigured() {
  return Boolean(getResendConfig());
}

export async function sendResendEmail(opts: {
  to: string | string[];
  subject: string;
  title: string;
  innerHtml: string;
  previewText?: string;
  replyTo?: string;
  attachments?: ResendAttachment[];
}) {
  const config = getResendConfig();
  if (!config) {
    console.warn("[email] Brak RESEND_API_KEY lub RESEND_FROM_EMAIL — pominięto wysyłkę.");
    return { ok: false as const, error: "Brak konfiguracji Resend." };
  }

  const attachments = opts.attachments?.map((a) => ({
    filename: a.filename,
    content:
      typeof a.content === "string"
        ? a.content
        : a.content.toString("base64"),
    content_type: a.contentType,
  }));

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: opts.to,
      subject: opts.subject,
      html: wrapResendHtml({
        title: opts.title,
        innerHtml: opts.innerHtml,
        previewText: opts.previewText,
      }),
      reply_to: opts.replyTo || process.env.RESEND_REPLY_TO?.trim() || undefined,
      attachments,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error:", res.status, body);
    return { ok: false as const, error: "Nie udało się wysłać e-maila." };
  }

  return { ok: true as const };
}

export function notifyEmail(): string {
  return (
    process.env.NOTIFY_EMAIL?.trim() ||
    process.env.RESEND_REPLY_TO?.trim() ||
    "kontakt@egzooturystyka.pl"
  );
}
