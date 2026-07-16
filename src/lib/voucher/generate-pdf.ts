import PDFDocument from "pdfkit";
import { formatPrice } from "@/lib/utils";

export type VoucherPdfInput = {
  voucherCode: string;
  amount: number;
  purchaserName: string;
  recipientName?: string | null;
  dedication?: string | null;
  validUntil: Date;
};

function formatDatePL(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Generuje PDF bonu A4 (Buffer) — działa na Vercel (bez Chromium). */
export async function generateVoucherPdf(input: VoucherPdfInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: `Bon podarunkowy ${input.voucherCode}`,
        Author: "egZOOturystyka",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const margin = 36;

    // Ramka
    doc
      .lineWidth(2)
      .strokeColor("#b8924a")
      .rect(margin, margin, pageW - margin * 2, pageH - margin * 2)
      .stroke();

    doc
      .lineWidth(0.5)
      .strokeColor("#2f3a26")
      .rect(margin + 8, margin + 8, pageW - margin * 2 - 16, pageH - margin * 2 - 16)
      .stroke();

    let y = margin + 56;

    doc
      .fillColor("#2f3a26")
      .fontSize(14)
      .text("egZOOturystyka", margin + 40, y, { align: "center", width: pageW - margin * 2 - 80 });

    y += 36;
    doc
      .fillColor("#b8924a")
      .fontSize(28)
      .text("Bon podarunkowy", margin + 40, y, {
        align: "center",
        width: pageW - margin * 2 - 80,
      });

    y += 44;
    doc
      .fillColor("#4a4640")
      .fontSize(12)
      .text("Spotkanie ze zwierzętami w mini zoo", margin + 40, y, {
        align: "center",
        width: pageW - margin * 2 - 80,
      });

    y += 48;
    doc
      .fillColor("#2f3a26")
      .fontSize(36)
      .text(formatPrice(input.amount), margin + 40, y, {
        align: "center",
        width: pageW - margin * 2 - 80,
      });

    y += 56;
    if (input.recipientName?.trim()) {
      doc
        .fillColor("#4a4640")
        .fontSize(11)
        .text("Dla", margin + 40, y, { align: "center", width: pageW - margin * 2 - 80 });
      y += 18;
      doc
        .fillColor("#2f3a26")
        .fontSize(18)
        .text(input.recipientName.trim(), margin + 40, y, {
          align: "center",
          width: pageW - margin * 2 - 80,
        });
      y += 36;
    }

    if (input.dedication?.trim()) {
      doc.font("Helvetica-Oblique");
      doc
        .fillColor("#6f6a62")
        .fontSize(11)
        .text(`„${input.dedication.trim()}”`, margin + 60, y, {
          align: "center",
          width: pageW - margin * 2 - 120,
        });
      doc.font("Helvetica");
      y += 40;
    }

    y = Math.max(y, pageH / 2 + 20);

    doc
      .fillColor("#71717a")
      .fontSize(10)
      .text("Kod bonu", margin + 40, y, { align: "center", width: pageW - margin * 2 - 80 });
    y += 16;
    doc
      .fillColor("#2f3a26")
      .fontSize(22)
      .font("Courier-Bold")
      .text(input.voucherCode, margin + 40, y, {
        align: "center",
        width: pageW - margin * 2 - 80,
        characterSpacing: 2,
      });

    doc.font("Helvetica");
    y += 48;
    doc
      .fillColor("#4a4640")
      .fontSize(11)
      .text(
        `Ważny do ${formatDatePL(input.validUntil)} · Nabywca: ${input.purchaserName}`,
        margin + 40,
        y,
        { align: "center", width: pageW - margin * 2 - 80 },
      );

    y += 36;
    doc
      .fillColor("#6f6a62")
      .fontSize(9)
      .text(
        "Przy rezerwacji podaj kod bonu. Płatność za wizytę pokrywa bon — odbiorca wybiera termin online lub telefonicznie.",
        margin + 50,
        y,
        { align: "center", width: pageW - margin * 2 - 100 },
      );

    doc.end();
  });
}
