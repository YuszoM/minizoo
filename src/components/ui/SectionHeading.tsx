import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "light" | "dark";
  /** "h1" dla głównego nagłówka strony (jeden na stronę), domyślnie "h2". */
  as?: "h1" | "h2";
};

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
  tone = "dark",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Tag
        className={cn(
          "display-lg font-semibold",
          tone === "light" ? "text-paper" : "text-forest",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            tone === "light" ? "text-paper/80" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
