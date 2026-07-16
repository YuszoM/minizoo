import { DashboardCard } from "@/components/admin/dashboard-card";
import { PanelHeader } from "@/components/admin/panel-header";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel zarządzania",
  robots: { index: false, follow: false },
};

export default async function AdminPanelPage() {
  await requireAdminHub();

  return (
    <div className="container-site max-w-5xl py-10">
      <PanelHeader />

      <div className="grid gap-6 sm:grid-cols-2">
        <DashboardCard
          title="Rezerwacje i bilety"
          description="Lista gości wg dnia i godziny — numery biletów, kontakt, liczba osób."
          href="/admin/rezerwacje"
          highlight
        />
        <DashboardCard
          title="Wiadomości z kontaktu"
          description="Leady z formularza kontaktowego — e-mail, telefon, treść."
          href="/admin/leady"
        />
        <DashboardCard
          title="Bony podarunkowe"
          description="Wygenerowane kody PDF — nabywca, kwota, status."
          href="/admin/bony"
        />
        <DashboardCard
          title="Strona rezerwacji"
          description="Publiczny formularz, który widzą klienci."
          href="/rezerwacja"
        />
      </div>
    </div>
  );
}
