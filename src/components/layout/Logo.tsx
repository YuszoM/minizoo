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
      <div className="min-w-0">
        <p
          className={cn(
            "font-display text-base leading-none tracking-tight sm:text-[1.15rem] md:text-xl",
            inverted ? "text-white" : "text-ink",
          )}
        >
          eg<span className="text-gold">ZOO</span>turystyka
        </p>
        <p
          className={cn(
            "mt-1 text-[0.68rem] font-medium tracking-wide",
            inverted ? "text-white/80" : "text-ink-soft",
          )}
        >
          {site.tagline}
        </p>
      </div>
    </Link>
  );
}
