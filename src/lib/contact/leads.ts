import { createServiceRoleClient } from "@/lib/supabase/clients";

export type ContactLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  created_at: string;
};

export async function fetchContactLeads(limit = 100): Promise<ContactLead[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("contact_leads")
    .select("id, name, email, phone, message, source, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[contact] fetch leads:", error);
    return [];
  }

  return data;
}
