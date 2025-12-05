import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedStats } from "@/components/home/featured-stats";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { OrderStatusBar } from "@/components/home/order-status-bar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedStats />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
      <Footer />
      <OrderStatusBar />
    </div>
  );
}
