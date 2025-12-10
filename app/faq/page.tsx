import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "سوالات متداول - ساد",
  description: "پاسخ به سوالات متداول مشتریان",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "چگونه می‌توانم سفارش بدهم؟",
      answer: "شما می‌توانید با مراجعه به صفحه محصولات، محصول مورد نظر خود را انتخاب کرده و به سبد خرید اضافه کنید.",
    },
    {
      question: "روش‌های پرداخت چیست؟",
      answer: "پرداخت از طریق درگاه پرداخت آنلاین انجام می‌شود.",
    },
    {
      question: "زمان تحویل چقدر است؟",
      answer: "زمان تحویل بسته به روش ارسال انتخابی شما متفاوت است.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">سوالات متداول</h1>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

