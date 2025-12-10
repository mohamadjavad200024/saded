import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "بازگشت کالا - ساد",
  description: "قوانین و شرایط بازگشت کالا",
};

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">بازگشت کالا</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              در صورت وجود مشکل در محصول، می‌توانید درخواست بازگشت کالا را ثبت کنید.
            </p>
            <p className="text-muted-foreground mb-4">
              لطفاً قبل از ثبت درخواست، با پشتیبانی تماس بگیرید.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

