import Link from "next/link";
import { logoutAdminPanel } from "@/lib/admin/hub-auth";

export function PanelHeader() {
  return (
    <header className="mb-10 flex flex-col gap-4 border-b border-paper-deep pb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">Administracja</p>
        <h1 className="font-display text-2xl text-forest">Panel egZOOturystyka</h1>
        <p className="mt-1 text-sm text-ink-muted">Rezerwacje, bilety i zarządzanie wizytami.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full border border-paper-deep bg-white px-4 py-2 text-sm font-medium text-forest hover:bg-paper"
        >
          Strona główna
        </Link>
        <form action={logoutAdminPanel}>
          <button
            type="submit"
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forest-light"
          >
            Wyloguj
          </button>
        </form>
      </div>
    </header>
  );
}
