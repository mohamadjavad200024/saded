import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroCanvas } from "@/components/home/hero-canvas";
import { ReviewsSection } from "@/components/home/reviews-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 relative z-0 w-full max-w-full mx-auto">
        {/* Canvas with overlay content */}
        <div className="relative w-full max-w-full">
          <HeroCanvas />
          <HeroSection />
        </div>
        <FeaturedProducts />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}
