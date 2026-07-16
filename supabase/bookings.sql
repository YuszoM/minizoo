-- Rezerwacje i bilety egZOOturystyka
-- Uruchom w Supabase → SQL Editor

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  offer_id text not null,
  offer_title text not null,
  visit_date date not null,
  visit_time text not null,
  guest_count integer not null check (guest_count > 0),
  total_price integer not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_visit_date_time_idx
  on public.bookings (visit_date, visit_time);

create index if not exists bookings_email_idx on public.bookings (email);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  ticket_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists tickets_booking_id_idx on public.tickets (booking_id);

alter table public.bookings enable row level security;
alter table public.tickets enable row level security;

-- Brak polityk dla anon/authenticated — dostęp tylko przez service role z serwera Next.js
