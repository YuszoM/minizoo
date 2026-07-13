import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Opinie",
};

export default function OpiniePage() {
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          title="Goście o nas mówią najlepiej"
          description={`Średnia ${avg.toFixed(1)}/5 · ${reviews.length} opinii`}
          align="center"
          className="mx-auto"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <blockquote key={review.id} className="rounded-xl bg-white p-6">
              <div className="mb-3 flex gap-1 text-gold">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="leading-relaxed text-ink">&ldquo;{review.text}&rdquo;</p>
              <footer className="mt-4 border-t border-paper-deep pt-4">
                <p className="font-semibold text-forest">{review.name}</p>
                <p className="text-xs text-ink-muted">
                  {review.role} · {review.date}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/rezerwacja" className="btn-primary">
            Rezerwuj termin
          </Link>
        </div>
      </div>
    </div>
  );
}
