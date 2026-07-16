import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_HUB_COOKIE } from "@/lib/admin/hub-constants";
import { verifyAdminSessionToken } from "@/lib/admin/hub-session";

const PUBLIC_ADMIN_PATHS = ["/admin/panel/login"];

function isProtectedAdminPath(pathname: string): boolean {
  if (!pathname.startsWith("/admin")) return false;
  return !PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_HUB_COOKIE)?.value;
  const ok = await verifyAdminSessionToken(token);
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/panel/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
