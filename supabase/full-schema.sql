-- =============================================================================
-- egZOOturystyka — pełny schemat (jeden plik do SQL Editor)
-- Bezpieczne do ponownego uruchomienia
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  offer_id text not null,
  offer_title text not null,
  visit_date date,
  visit_time text,
  guest_count integer not null check (guest_count > 0),
  total_price integer not null,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_visit_date_time_idx
  on public.bookings (visit_date, visit_time);
create index if not exists bookings_email_idx on public.bookings (email);
create index if not exists bookings_order_number_idx on public.bookings (order_number);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  ticket_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists tickets_booking_id_idx on public.tickets (booking_id);
create index if not exists tickets_code_idx on public.tickets (ticket_code);

create table if not exists public.booking_settings (
  id int primary key default 1 check (id = 1),
  max_guests_per_slot int not null default 24
    check (max_guests_per_slot between 1 and 200),
  updated_at timestamptz not null default now()
);

insert into public.booking_settings (id, max_guests_per_slot)
values (1, 24)
on conflict (id) do nothing;

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  voucher_code text not null unique,
  order_number text not null,
  purchaser_name text not null,
  purchaser_email text not null,
  purchaser_phone text not null,
  recipient_name text,
  dedication text,
  amount integer not null,
  valid_until date not null,
  status text not null default 'active'
    check (status in ('active', 'redeemed', 'cancelled')),
  redeemed_at timestamptz,
  redeemed_booking_id uuid references public.bookings (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists vouchers_code_idx on public.vouchers (voucher_code);
create index if not exists vouchers_email_idx on public.vouchers (purchaser_email);
create index if not exists vouchers_status_idx on public.vouchers (status);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'kontakt',
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);
create index if not exists contact_leads_email_idx on public.contact_leads (email);

alter table public.bookings enable row level security;
alter table public.tickets enable row level security;
alter table public.booking_settings enable row level security;
alter table public.vouchers enable row level security;
alter table public.contact_leads enable row level security;
