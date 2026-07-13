import {
  AnimalsBentoSection,
  BookingSection,
  CtaSection,
  HeroSection,
  OfferPreviewSection,
  ReviewsSection,
  TrustStrip,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <OfferPreviewSection />
      <AnimalsBentoSection />
      <BookingSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}
