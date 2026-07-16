#!/usr/bin/env bash
# Wgrywa zmienne z .env.local na Vercel (production / preview).
# Użycie: npm run env:vercel
#         VERCEL_ENV=preview npm run env:vercel
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
ENV_FILE="${ENV_FILE:-.env.local}"
TARGET_ENV="${VERCEL_ENV:-production}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Brak $ENV_FILE — skopiuj .env.example i uzupełnij wartości." >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Brak Vercel CLI. Zainstaluj: npm i -g vercel" >&2
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Brak .vercel/project.json. Uruchom: vercel link --project minizoo" >&2
  exit 1
fi

VARS=(
  NEXT_PUBLIC_SITE_URL
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SERVICE_ROLE_KEY
  ADMIN_PANEL_PASSWORD
  ADMIN_SESSION_SECRET
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  RESEND_REPLY_TO
  NOTIFY_EMAIL
)

get_val() {
  local key="$1"
  grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- \
    | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/"
}

pushed=0
skipped=0

for key in "${VARS[@]}"; do
  val="$(get_val "$key" || true)"
  if [[ -z "${val:-}" ]]; then
    echo "Pomijam (puste): $key"
    skipped=$((skipped + 1))
    continue
  fi
  # Usuń starą wartość jeśli istnieje (żeby --force nie pytał interaktywne)
  vercel env rm "$key" "$TARGET_ENV" --yes >/dev/null 2>&1 || true
  printf '%s' "$val" | vercel env add "$key" "$TARGET_ENV" --yes >/dev/null
  echo "OK: $key → $TARGET_ENV"
  pushed=$((pushed + 1))
done

echo ""
echo "Wgrano: $pushed · pominięto: $skipped · środowisko: $TARGET_ENV"
echo "Zrób Redeploy w Vercel albo git push, żeby env się wczytały."
