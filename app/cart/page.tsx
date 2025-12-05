import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">سبد خرید</h1>
        <CartContent />
      </main>
      <Footer />
    </div>
  );
}

