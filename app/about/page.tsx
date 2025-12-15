"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const defaultContent = `فروشگاه آنلاین ساد، ارائه‌دهنده قطعات خودرو وارداتی با بهترین کیفیت و قیمت است.

ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم و تمام تلاش خود را می‌کنیم تا رضایت شما را جلب کنیم.`;

export default function AboutPage() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/settings/about");
        if (response.ok) {
          const data = await response.json();
          if (data.data?.content) {
            setContent(data.data.content);
          }
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Split content by newlines and render as paragraphs
  const paragraphs = content.split("\n").filter((p: string) => p.trim() !== "");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">درباره ما</h1>
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

