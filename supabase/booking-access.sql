-- Horyzont rezerwacji, tryb ręcznego odblokowania, godziny (w tym 18:00)
-- Uruchom w Supabase SQL Editor

alter table public.booking_settings
  add column if not exists booking_mode text not null default 'horizon';

alter table public.booking_settings
  drop constraint if exists booking_settings_booking_mode_check;

alter table public.booking_settings
  add constraint booking_settings_booking_mode_check
  check (booking_mode in ('horizon', 'manual'));

alter table public.booking_settings
  add column if not exists max_days_ahead int not null default 14;

alter table public.booking_settings
  drop constraint if exists booking_settings_max_days_ahead_check;

alter table public.booking_settings
  add constraint booking_settings_max_days_ahead_check
  check (max_days_ahead between 1 and 365);

alter table public.booking_settings
  add column if not exists time_slots text[] not null
  default array['10:00','12:00','14:00','16:00','18:00'];

update public.booking_settings
set time_slots = array['10:00','12:00','14:00','16:00','18:00']
where id = 1
  and (
    time_slots is null
    or cardinality(time_slots) = 0
    or not ('18:00' = any (time_slots))
  );

alter table public.booking_day_overrides
  add column if not exists unlocked boolean not null default false;

create index if not exists booking_day_overrides_unlocked_idx
  on public.booking_day_overrides (visit_date)
  where unlocked = true;
