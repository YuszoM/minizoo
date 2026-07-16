"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdminPanelForm } from "@/lib/admin/hub-auth";

export default function AdminPanelLoginPage() {
  const [state, action, pending] = useActionState(loginAdminPanelForm, null);

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">egZOOturystyka</p>
      <h1 className="mt-2 font-display text-2xl text-forest">Panel administracyjny</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Hasło ustawione w zmiennej{" "}
        <code className="rounded bg-paper-deep px-1">ADMIN_PANEL_PASSWORD</code>.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-forest">
            Hasło
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-forest px-4 py-3 text-sm font-semibold text-paper disabled:opacity-60"
        >
          {pending ? "Sprawdzanie…" : "Zaloguj"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        <Link href="/" className="font-semibold text-forest hover:text-gold">
          Wróć na stronę
        </Link>
      </p>
    </div>
  );
}
