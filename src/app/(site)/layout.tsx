import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Header />
      <main id="main" className="overflow-x-clip pt-[76px] pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <MobileStickyCta />
    </SmoothScroll>
  );
}
