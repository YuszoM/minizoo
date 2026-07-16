import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  highlight?: boolean;
};

export function DashboardCard({ title, description, href, highlight }: Props) {
  return (
    <Link
      href={href}
      className={`block h-full rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
        highlight
          ? "border-gold/40 bg-white hover:border-gold"
          : "border-paper-deep bg-white hover:border-gold/50"
      }`}
    >
      <h2 className="font-display text-lg text-forest">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
      <p className="mt-4 text-sm font-semibold text-gold">Przejdź →</p>
    </Link>
  );
}
