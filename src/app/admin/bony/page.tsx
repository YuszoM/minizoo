import Link from "next/link";
import { PanelHeader } from "@/components/admin/panel-header";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import { fetchVouchers } from "@/lib/voucher/service";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bony podarunkowe",
  robots: { index: false, follow: false },
};

export default async function AdminVouchersPage() {
  await requireAdminHub();
  const vouchers = await fetchVouchers();

  return (
    <div className="container-site max-w-4xl py-10">
      <PanelHeader />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-forest">Bony podarunkowe</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {vouchers.length === 0
              ? "Brak bonów."
              : `${vouchers.length} ${vouchers.length === 1 ? "bon" : vouchers.length < 5 ? "bony" : "bonów"}`}
          </p>
        </div>
        <Link href="/admin/panel" className="text-sm font-semibold text-gold hover:text-gold-bright">
          ← Panel główny
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-paper-deep bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-paper-deep bg-paper/50 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Kod</th>
              <th className="px-4 py-3 font-semibold">Nabywca</th>
              <th className="px-4 py-3 font-semibold">Kwota</th>
              <th className="px-4 py-3 font-semibold">Ważny do</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-b border-paper-deep/60 last:border-0">
                <td className="px-4 py-3 font-mono tracking-wide text-forest">{v.voucher_code}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-forest">{v.purchaser_name}</p>
                  <p className="text-xs text-ink-muted">{v.purchaser_email}</p>
                  {v.recipient_name ? (
                    <p className="text-xs text-ink-muted">Dla: {v.recipient_name}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">{formatPrice(v.amount)}</td>
                <td className="px-4 py-3 text-ink-muted">{v.valid_until}</td>
                <td className="px-4 py-3 capitalize text-ink-soft">{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
