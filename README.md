# minizoo — egZOOturystyka

Strona mini zoo z systemem rezerwacji i biletów.

**Produkcja:** https://minizoo.duodev.pl

## System biletowy

1. Klient rezerwuje wizytę na `/rezerwacja`.
2. Po potwierdzeniu zapis w Supabase + unikalne numery biletów (10 cyfr, jeden na osobę).
3. Dwa e-maile przez **Resend**: potwierdzenie zamówienia + numery biletów.
4. Panel admina: **`/admin/panel/login`** → **Rezerwacje** — harmonogram gości + **limit miejsc na godzinę** (edytowalny).

## Konfiguracja (Vercel + Supabase)

1. W Supabase uruchom SQL z plików **`supabase/bookings.sql`** i **`supabase/booking_settings.sql`**.
2. W Vercel ustaw zmienne z **`.env.example`**:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PANEL_PASSWORD`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`
   - `NEXT_PUBLIC_SITE_URL`
3. W Resend zweryfikuj domenę nadawcy (`RESEND_FROM_EMAIL`).

## Bezpieczeństwo (produkcja)

- **Sesja admina:** podpis HMAC (`ADMIN_SESSION_SECRET` lub fallback `ADMIN_PANEL_PASSWORD`) — samodzielne ustawienie `admin_hub_session=1` **nie działa**.
- **Rate limit (Upstash):** logowanie admina (5 / 15 min), rezerwacje (8/h IP, 5/h e-mail) — bez Upstash na produkcji te akcje są **blokowane** (`failClosed`).
- **Nagłówki:** X-Frame-Options, nosniff, Referrer-Policy (next.config.ts).
- **Cookie admina:** `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/admin` tylko.

Wygeneruj sekret: `openssl rand -base64 32`

## Deploy

Push na `YuszoM/minizoo` → Vercel project `minizoo` → domena `minizoo.duodev.pl`.

Moduły wzorowane na klocki: panel admina, Resend layout, Supabase service role.
