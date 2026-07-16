# minizoo — egZOOturystyka

Strona mini zoo z rezerwacjami, biletami, kontaktem i bonami podarunkowymi.

**Produkcja:** https://minizoo.duodev.pl

## Funkcje

1. **Rezerwacja** `/rezerwacja` — pakiet, termin, bilety (10 cyfr), płatność na miejscu.
2. **Kontakt** `/kontakt` — leady w Supabase + panel `/admin/leady` (mail do admina po Resend).
3. **Bon** `/bon` — kod + PDF (mail z PDF po Resend) + panel `/admin/bony`.
4. **Admin** `/admin/panel/login` — rezerwacje, limit miejsc/slot, leady, bony.

## Konfiguracja

1. W Supabase SQL Editor uruchom **`supabase/full-schema.sql`** (jeden plik, idempotentny).
2. Zmienne z **`.env.example`** na Vercel (lub `npm run env:vercel`):
   - Supabase: `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`
   - Admin: `ADMIN_PANEL_PASSWORD`, `ADMIN_SESSION_SECRET`
   - Resend (opcjonalnie na start): `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, `NOTIFY_EMAIL`
   - Upstash (opcjonalnie): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_SITE_URL`
3. W Resend zweryfikuj domenę nadawcy.

## Bezpieczeństwo

- Sesja admina: HMAC (`ADMIN_SESSION_SECRET`) — cookie `=1` nie działa.
- Rate limit (Upstash): bez kluczy limity są **pomijane** (`failClosed: false`); włącz Upstash przed ostrzejszą produkcją.
- Nagłówki w `next.config.ts`; cookie admina: `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/admin`.

Wygeneruj sekret: `openssl rand -base64 32`

## Deploy

Push na `YuszoM/minizoo` → Vercel `minizoo` → `minizoo.duodev.pl`.
