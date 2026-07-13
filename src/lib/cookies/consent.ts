export const COOKIE_CONSENT_KEY = "mz_cookie_consent";

export type CookieConsentLevel = "all" | "necessary";

export type CookieConsentState = {
  level: CookieConsentLevel;
  analytics: boolean;
  personalization: boolean;
  savedAt: string;
};

export function buildConsentState(level: CookieConsentLevel): CookieConsentState {
  return {
    level,
    analytics: level === "all",
    personalization: level === "all",
    savedAt: new Date().toISOString(),
  };
}

export function parseConsentState(value: string | null | undefined): CookieConsentState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as {
      level?: string;
      analytics?: unknown;
      personalization?: unknown;
      savedAt?: unknown;
    };
    if (!parsed || typeof parsed !== "object") return null;
    const level = parsed.level === "personalized" ? "necessary" : parsed.level;
    if (level !== "all" && level !== "necessary") {
      return null;
    }
    return {
      level,
      analytics: level === "all",
      personalization: level === "all",
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
