import {
  AnimalsBentoSection,
  BookingSection,
  CtaSection,
  FaqPreviewSection,
  HeroSection,
  OfferPreviewSection,
  ReviewsSection,
} from "@/components/home/HomeSections";
import { EducatorSection } from "@/components/home/EducatorSection";
import { FunFactsStrip } from "@/components/home/FunFactsStrip";
import { BeforeVisitSection } from "@/components/visit/BeforeVisitSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FunFactsStrip />
      <OfferPreviewSection />
      <AnimalsBentoSection />
      <EducatorSection />
      <BeforeVisitSection />
      <FaqPreviewSection />
      <BookingSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}
