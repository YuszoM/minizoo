import { cn } from "@/lib/utils";
import { site } from "@/data/site";

export function DemoPhotoLabel({ className }: { className?: string }) {
  if (!site.photosAreDemo) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute right-2 bottom-2 z-10 rounded-md bg-forest/85 px-2 py-1 text-[10px] font-semibold tracking-wide text-paper uppercase backdrop-blur-sm",
        className,
      )}
    >
      Zdjęcie poglądowe
    </span>
  );
}
