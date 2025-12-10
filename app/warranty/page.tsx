import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "گارانتی - ساد",
  description: "اطلاعات مربوط به گارانتی محصولات",
};

export default function WarrantyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">گارانتی</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              تمام محصولات ما دارای گارانتی اصالت و کیفیت هستند.
            </p>
            <p className="text-muted-foreground mb-4">
              در صورت وجود مشکل در محصول، می‌توانید از خدمات گارانتی استفاده کنید.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

