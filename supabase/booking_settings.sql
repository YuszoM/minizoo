-- Ustawienia rezerwacji (pojedynczy wiersz)
-- Uruchom w Supabase po bookings.sql

create table if not exists public.booking_settings (
  id int primary key default 1 check (id = 1),
  max_guests_per_slot int not null default 24 check (max_guests_per_slot between 1 and 200),
  updated_at timestamptz not null default now()
);

insert into public.booking_settings (id, max_guests_per_slot)
values (1, 24)
on conflict (id) do nothing;

alter table public.booking_settings enable row level security;
