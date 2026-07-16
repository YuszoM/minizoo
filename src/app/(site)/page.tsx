import {
  AnimalsBentoSection,
  BookingSection,
  CtaSection,
  FaqPreviewSection,
  HeroSection,
  OfferPreviewSection,
  ReviewsSection,
  TrustStrip,
} from "@/components/home/HomeSections";
import { EducatorSection } from "@/components/home/EducatorSection";
import { FunFactsStrip } from "@/components/home/FunFactsStrip";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { BeforeVisitSection } from "@/components/visit/BeforeVisitSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <SectionDivider />
      <FunFactsStrip />
      <SectionDivider />
      <OfferPreviewSection />
      <SectionDivider />
      <AnimalsBentoSection />
      <SectionDivider />
      <EducatorSection />
      <BeforeVisitSection />
      <SectionDivider />
      <FaqPreviewSection />
      <BookingSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}
