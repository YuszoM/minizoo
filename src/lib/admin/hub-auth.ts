"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_HUB_COOKIE, ADMIN_HUB_COOKIE_MAX_AGE } from "@/lib/admin/hub-constants";
import { signAdminSession, verifyAdminSessionToken } from "@/lib/admin/hub-session";
import { getClientIp } from "@/lib/rate-limit/client-ip";
import { rateLimitHit } from "@/lib/rate-limit/upstash";
import { timingSafeEqualString } from "@/lib/security/timing-safe";

export async function isAdminHubAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(ADMIN_HUB_COOKIE)?.value);
}

export async function requireAdminHub() {
  if (!(await isAdminHubAuthenticated())) {
    redirect("/admin/panel/login");
  }
}

export async function loginAdminPanelForm(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const ip = await getClientIp();
  const rl = await rateLimitHit({
    identifier: `admin-login:${ip}`,
    max: 5,
    windowSeconds: 900,
    failClosed: true,
  });
  if (!rl.ok) {
    return { error: "Zbyt wiele prób logowania. Spróbuj za kilka minut." };
  }

  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PANEL_PASSWORD?.trim();
  if (!expected || !timingSafeEqualString(password, expected)) {
    return { error: "Nieprawidłowe hasło." };
  }

  let token: string;
  try {
    token = await signAdminSession();
  } catch {
    return {
      error:
        "Panel niedostępny — ustaw ADMIN_SESSION_SECRET (min. 32 znaki) lub ADMIN_PANEL_PASSWORD.",
    };
  }

  const jar = await cookies();
  jar.set(ADMIN_HUB_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_HUB_COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin/panel");
}

export async function logoutAdminPanel() {
  const jar = await cookies();
  jar.set(ADMIN_HUB_COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/panel/login");
}
