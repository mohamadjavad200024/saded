"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const defaultContent = `در صورت وجود مشکل در محصول، می‌توانید درخواست بازگشت کالا را ثبت کنید.

لطفاً قبل از ثبت درخواست، با پشتیبانی تماس بگیرید.`;

export default function ReturnsPage() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/settings/page-content?page=returns");
        if (response.ok) {
          const data = await response.json();
          if (data.data?.content) {
            setContent(data.data.content);
          }
        }
      } catch (error) {
        console.error("Error fetching returns content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const paragraphs = content.split("\n").filter((p: string) => p.trim() !== "");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">بازگشت کالا</h1>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              {paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-muted-foreground mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

