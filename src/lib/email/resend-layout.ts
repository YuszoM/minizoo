/**
 * Wspólny szkielet HTML dla wiadomości wysyłanych przez Resend.
 */

export type WrapResendHtmlOptions = {
  title: string;
  innerHtml: string;
  previewText?: string;
  brandName?: string;
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function wrapResendHtml(opts: WrapResendHtmlOptions): string {
  const brand = opts.brandName?.trim() || "egZOOturystyka";
  const preview = opts.previewText?.trim()
    ? `<span style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(opts.previewText)}</span>`
    : "";

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
  ${preview}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;padding:28px 24px;border:1px solid #e4e4e7;">
          <tr><td style="font-size:14px;color:#71717a;padding-bottom:16px;">${esc(brand)}</td></tr>
          <tr><td style="font-size:18px;font-weight:600;color:#18181b;padding-bottom:12px;">${esc(opts.title)}</td></tr>
          <tr><td style="font-size:15px;line-height:1.55;color:#3f3f46;">${opts.innerHtml}</td></tr>
          <tr><td style="padding-top:24px;font-size:12px;color:#a1a1aa;border-top:1px solid #e4e4e7;">
            Ta wiadomość została wysłana automatycznie — w razie pytań odpisz na ${esc(process.env.RESEND_REPLY_TO?.trim() || "kontakt@egzooturystyka.pl")}.
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
