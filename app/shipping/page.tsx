import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "ارسال و تحویل - ساد",
  description: "اطلاعات مربوط به ارسال و تحویل سفارشات",
};

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">ارسال و تحویل</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              ما دو روش ارسال هوایی و دریایی را برای شما فراهم کرده‌ایم.
            </p>
            <p className="text-muted-foreground mb-4">
              هزینه ارسال بر اساس محصول و روش انتخابی شما محاسبه می‌شود.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

