import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "درباره ما - ساد",
  description: "درباره فروشگاه ساد و تیم ما",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">درباره ما</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              فروشگاه آنلاین ساد، ارائه‌دهنده قطعات خودرو وارداتی با بهترین کیفیت و قیمت است.
            </p>
            <p className="text-muted-foreground mb-4">
              ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم و تمام تلاش خود را می‌کنیم تا رضایت شما را جلب کنیم.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

