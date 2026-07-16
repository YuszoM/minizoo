import { ADMIN_HUB_COOKIE_MAX_AGE } from "@/lib/admin/hub-constants";

function sessionSecret(): string {
  const dedicated = process.env.ADMIN_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;

  const password = process.env.ADMIN_PANEL_PASSWORD?.trim();
  if (password) return password;

  if (process.env.NODE_ENV !== "production") {
    return "egzooturystyka-dev-insecure";
  }

  return "";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded =
      str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function getHmacKey(secret: string): Promise<CryptoKey | null> {
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function hmacSign(payloadB64: string): Promise<string | null> {
  const key = await getHmacKey(sessionSecret());
  if (!key) return null;
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return toBase64Url(new Uint8Array(sig));
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

/** Podpisany token sesji — działa w middleware (Edge) i w Server Actions. */
export async function signAdminSession(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_HUB_COOKIE_MAX_AGE;
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify({ exp, v: 1 })));
  const sig = await hmacSign(payloadB64);
  if (!sig) {
    throw new Error(
      "Brak sekretu sesji — ustaw ADMIN_SESSION_SECRET (zalecane) lub ADMIN_PANEL_PASSWORD.",
    );
  }
  return `${payloadB64}.${sig}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || token === "1") return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const expectedSig = await hmacSign(payloadB64);
  if (!expectedSig || !timingSafeEqualStr(sigB64, expectedSig)) return false;

  const payloadBytes = fromBase64Url(payloadB64);
  if (!payloadBytes) return false;

  try {
    const { exp } = JSON.parse(new TextDecoder().decode(payloadBytes)) as { exp?: number };
    if (typeof exp !== "number" || exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}
