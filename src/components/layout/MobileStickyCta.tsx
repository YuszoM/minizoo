"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/utils";

export function MobileStickyCta() {
  const pathname = usePathname();

  if (pathname === "/rezerwacja") return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-paper-deep bg-paper/98 p-3 shadow-[0_-8px_24px_rgba(47,58,38,0.08)] backdrop-blur-md sm:hidden">
      <Link href="/rezerwacja" className="btn-gold w-full">
        <CalendarDays className="h-4 w-4" />
        Rezerwuj · od {formatPrice(site.startingPrice)}
      </Link>
    </div>
  );
}
