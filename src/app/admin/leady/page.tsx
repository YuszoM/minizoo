import Link from "next/link";
import { PanelHeader } from "@/components/admin/panel-header";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import { fetchContactLeads } from "@/lib/contact/leads";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leady kontaktowe",
  robots: { index: false, follow: false },
};

export default async function AdminLeadyPage() {
  await requireAdminHub();
  const leads = await fetchContactLeads();

  return (
    <div className="container-site max-w-3xl py-10">
      <PanelHeader />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-forest">Wiadomości z formularza</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {leads.length === 0
              ? "Brak wiadomości."
              : `${leads.length} ${leads.length === 1 ? "wiadomość" : leads.length < 5 ? "wiadomości" : "wiadomości"}`}
          </p>
        </div>
        <Link href="/admin/panel" className="text-sm font-semibold text-gold hover:text-gold-bright">
          ← Panel główny
        </Link>
      </div>

      <ul className="space-y-4">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className="rounded-xl border border-paper-deep bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-forest">{lead.name}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  <a href={`mailto:${lead.email}`} className="hover:text-gold">
                    {lead.email}
                  </a>
                  {lead.phone ? (
                    <>
                      {" · "}
                      <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                        {lead.phone}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <time className="text-xs text-ink-muted" dateTime={lead.created_at}>
                {new Intl.DateTimeFormat("pl-PL", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(lead.created_at))}
              </time>
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-paper/60 p-4 font-sans text-sm text-ink-soft">
              {lead.message}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
