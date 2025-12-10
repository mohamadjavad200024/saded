import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroVideo } from "@/components/home/hero-video";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <main className="flex-1 relative z-0">
        <HeroVideo />
        <HeroSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
