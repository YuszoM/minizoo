-- Nadpisania dnia: blokada całego dnia + limity per slot
-- Bezpieczne do ponownego uruchomienia

create table if not exists public.booking_day_overrides (
  visit_date date primary key,
  blocked boolean not null default false,
  note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_slot_limits (
  visit_date date not null references public.booking_day_overrides (visit_date)
    on delete cascade,
  visit_time text not null,
  max_guests integer not null
    check (max_guests between 0 and 200),
  primary key (visit_date, visit_time)
);

create index if not exists booking_day_overrides_blocked_idx
  on public.booking_day_overrides (visit_date)
  where blocked = true;

alter table public.booking_day_overrides enable row level security;
alter table public.booking_slot_limits enable row level security;
