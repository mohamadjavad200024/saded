"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Trash2, FileText, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FAQItem {
  question: string;
  answer: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

type PageType = "about" | "faq" | "shipping" | "returns" | "warranty" | "contact";

interface PageInfo {
  key: PageType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const pages: PageInfo[] = [
  {
    key: "about",
    title: "درباره ما",
    description: "ویرایش محتوای صفحه درباره ما",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "faq",
    title: "سوالات متداول",
    description: "مدیریت سوالات و پاسخ‌های متداول",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "shipping",
    title: "ارسال و تحویل",
    description: "ویرایش محتوای صفحه ارسال و تحویل",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "returns",
    title: "بازگشت کالا",
    description: "ویرایش محتوای صفحه بازگشت کالا",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "warranty",
    title: "گارانتی",
    description: "ویرایش محتوای صفحه گارانتی",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "contact",
    title: "تماس با ما",
    description: "ویرایش اطلاعات تماس",
    icon: <FileText className="h-4 w-4" />,
  },
];

export function PageContentEditor() {
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<PageType>("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Content states
  const [textContent, setTextContent] = useState("");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadContent(activePage);
  }, [activePage]);

  const loadContent = async (page: PageType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/settings/page-content?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        const content = data.data?.content;

        if (page === "faq") {
          // FAQ is an array
          const faqs = typeof content === "string" ? JSON.parse(content) : content;
          setFaqItems(Array.isArray(faqs) ? faqs : []);
        } else if (page === "contact") {
          // Contact is an object
          const contact = typeof content === "string" ? JSON.parse(content) : content;
          setContactInfo(contact || { phone: "", email: "", address: "" });
        } else {
          // Other pages are text
          setTextContent(typeof content === "string" ? content : "");
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری محتوا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let content: any;

      if (activePage === "faq") {
        content = faqItems;
      } else if (activePage === "contact") {
        content = contactInfo;
      } else {
        content = textContent;
      }

      const response = await fetch(`/api/settings/page-content?page=${activePage}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: `محتوای ${pages.find(p => p.key === activePage)?.title} با موفقیت ذخیره شد`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "خطا",
          description: error.error || "خطا در ذخیره محتوا",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره محتوا",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addFAQ = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setFaqItems(
      faqItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          مدیریت محتوای صفحات
        </CardTitle>
        <CardDescription>
          ویرایش محتوای تمام صفحات سایت
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs value={activePage} onValueChange={(value) => setActivePage(value as PageType)}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {pages.map((page) => (
              <TabsTrigger key={page.key} value={page.key} className="text-xs">
                {page.icon}
                <span className="mr-1 hidden sm:inline">{page.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* About Page */}
          <TabsContent value="about" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>محتوای صفحه درباره ما</Label>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="محتوای صفحه درباره ما را اینجا وارد کنید..."
                className="min-h-[300px] font-sans"
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                می‌توانید از چند خط استفاده کنید. هر خط به صورت یک پاراگراف نمایش داده می‌شود.
              </p>
            </div>
          </TabsContent>

          {/* FAQ Page */}
          <TabsContent value="faq" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <Label>سوالات متداول</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFAQ}>
                <Plus className="h-4 w-4 ml-2" />
                افزودن سوال
              </Button>
            </div>
            {faqItems.length === 0 && (
              <div className="flex items-center gap-2 p-4 border border-dashed rounded-lg text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">هنوز سوالی اضافه نشده است</span>
              </div>
            )}
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <Label>سوال</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, "question", e.target.value)}
                      placeholder="سوال را اینجا وارد کنید..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>پاسخ</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                      placeholder="پاسخ را اینجا وارد کنید..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Shipping Page */}
          <TabsContent value="shipping" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>محتوای صفحه ارسال و تحویل</Label>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="محتوای صفحه ارسال و تحویل را اینجا وارد کنید..."
                className="min-h-[300px] font-sans"
                rows={10}
              />
            </div>
          </TabsContent>

          {/* Returns Page */}
          <TabsContent value="returns" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>محتوای صفحه بازگشت کالا</Label>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="محتوای صفحه بازگشت کالا را اینجا وارد کنید..."
                className="min-h-[300px] font-sans"
                rows={10}
              />
            </div>
          </TabsContent>

          {/* Warranty Page */}
          <TabsContent value="warranty" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>محتوای صفحه گارانتی</Label>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="محتوای صفحه گارانتی را اینجا وارد کنید..."
                className="min-h-[300px] font-sans"
                rows={10}
              />
            </div>
          </TabsContent>

          {/* Contact Page */}
          <TabsContent value="contact" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>شماره تلفن</Label>
                <Input
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="021-12345678"
                />
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="info@saded.ir"
                />
              </div>
              <div className="space-y-2">
                <Label>آدرس</Label>
                <Textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="تهران، ایران"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                ذخیره تغییرات
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

