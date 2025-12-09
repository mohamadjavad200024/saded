import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <main className="flex-1 relative z-0">
        <HeroSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
