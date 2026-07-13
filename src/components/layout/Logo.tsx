import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-3">
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full ring-2 ring-gold/40 ring-offset-2 ring-offset-transparent">
        <Image
          src="/brand/logo.jpeg"
          alt={site.name}
          fill
          className="object-cover"
          sizes="52px"
          priority
        />
      </div>
      <div className="hidden min-w-0 sm:block">
        <p
          className={cn(
            "font-display text-[1.15rem] leading-none tracking-tight md:text-xl",
            inverted ? "text-white" : "text-ink",
          )}
        >
          eg<span className="text-gold">ZOO</span>turystyka
        </p>
        <p
          className={cn(
            "mt-1 text-[0.68rem] font-medium tracking-wide",
            inverted ? "text-white/70" : "text-ink-muted",
          )}
        >
          {site.tagline}
        </p>
      </div>
    </Link>
  );
}
