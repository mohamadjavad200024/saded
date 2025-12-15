"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Trash2, FileText, AlertCircle, Link as LinkIcon, ChevronDown, ChevronUp, Instagram, Facebook, Twitter, Phone, Mail } from "lucide-react";
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

interface LinkItem {
  label: string;
  href: string;
}

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
}

interface FooterContent {
  footer: {
    about: {
      title: string;
      description: string;
      socialLinks: SocialLinks;
    };
    quickLinks: {
      title: string;
      links: LinkItem[];
    };
    support: {
      title: string;
      links: LinkItem[];
    };
    contact: {
      title: string;
      phone: string;
      email: string;
    };
    copyright: string;
  };
}

type PageType = "about" | "faq" | "shipping" | "returns" | "warranty" | "contact" | "footer";

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
  {
    key: "footer",
    title: "Footer",
    description: "ویرایش محتوای فوتر",
    icon: <LinkIcon className="h-4 w-4" />,
  },
];

// Default content که کاربر در سایت می‌بیند
const defaultFooterContent: FooterContent = {
  footer: {
    about: {
      title: "درباره ساد",
      description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم.",
      socialLinks: {
        instagram: "#",
        facebook: "#",
        twitter: "#",
      },
    },
    quickLinks: {
      title: "دسترسی سریع",
      links: [
        { label: "محصولات", href: "/products" },
        { label: "درباره ما", href: "/about" },
        { label: "تماس با ما", href: "/contact" },
        { label: "وبلاگ", href: "/blog" },
      ],
    },
    support: {
      title: "پشتیبانی",
      links: [
        { label: "سوالات متداول", href: "/faq" },
        { label: "ارسال و تحویل", href: "/shipping" },
        { label: "بازگشت کالا", href: "/returns" },
        { label: "گارانتی", href: "/warranty" },
      ],
    },
    contact: {
      title: "تماس با ما",
      phone: "021-12345678",
      email: "info@saded.ir",
    },
    copyright: `© ${new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.`,
  },
};

// Default content برای صفحات مختلف
const defaultPageContents: Record<string, any> = {
  about: `فروشگاه آنلاین ساد، ارائه‌دهنده قطعات خودرو وارداتی با بهترین کیفیت و قیمت است.

ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم و تمام تلاش خود را می‌کنیم تا رضایت شما را جلب کنیم.`,
  
  faq: [
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
  ],
  
  shipping: `ما دو روش ارسال هوایی و دریایی را برای شما فراهم کرده‌ایم.

هزینه ارسال بر اساس محصول و روش انتخابی شما محاسبه می‌شود.`,
  
  returns: `در صورت وجود مشکل در محصول، می‌توانید درخواست بازگشت کالا را ثبت کنید.

لطفاً قبل از ثبت درخواست، با پشتیبانی تماس بگیرید.`,
  
  warranty: `تمام محصولات ما دارای گارانتی اصالت و کیفیت هستند.

در صورت وجود مشکل در محصول، می‌توانید از خدمات گارانتی استفاده کنید.`,
  
  contact: {
    phone: "021-12345678",
    email: "info@saded.ir",
    address: "تهران، ایران",
  },
};

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

  // Footer content state - با defaultFooterContent مقداردهی می‌شود
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent);

  // Collapsible sections for footer
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    footerAbout: true,
    footerQuickLinks: false,
    footerSupport: false,
    footerContact: false,
    footerCopyright: false,
  });

  useEffect(() => {
    if (activePage === "footer") {
      loadFooterContent();
    } else {
      loadContent(activePage);
    }
  }, [activePage]);

  const loadContent = async (page: PageType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/settings/page-content?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        let content = data.data?.content;

        // اگر محتوا خالی یا null است، از default content استفاده کن
        if (!content || content === "" || content === null) {
          content = defaultPageContents[page];
        }

        if (page === "faq") {
          // FAQ is an array
          const faqs = typeof content === "string" ? JSON.parse(content) : content;
          // اگر خالی بود یا array نبود، از default استفاده کن
          setFaqItems(Array.isArray(faqs) && faqs.length > 0 ? faqs : (defaultPageContents.faq || []));
        } else if (page === "contact") {
          // Contact is an object
          const contact = typeof content === "string" ? JSON.parse(content) : content;
          // اگر خالی بود، از default استفاده کن
          setContactInfo(contact && Object.keys(contact).length > 0 ? contact : (defaultPageContents.contact || { phone: "", email: "", address: "" }));
        } else {
          // Other pages are text - اگر خالی بود از default استفاده کن
          const text = typeof content === "string" ? content : "";
          setTextContent(text || defaultPageContents[page] || "");
        }
      } else {
        // اگر خطا بود، از default content استفاده کن
        if (page === "faq") {
          setFaqItems(defaultPageContents.faq || []);
        } else if (page === "contact") {
          setContactInfo(defaultPageContents.contact || { phone: "", email: "", address: "" });
        } else {
          setTextContent(defaultPageContents[page] || "");
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
      // در صورت خطا، از default content استفاده کن
      if (page === "faq") {
        setFaqItems(defaultPageContents.faq || []);
      } else if (page === "contact") {
        setContactInfo(defaultPageContents.contact || { phone: "", email: "", address: "" });
      } else {
        setTextContent(defaultPageContents[page] || "");
      }
      toast({
        title: "خطا",
        description: "خطا در بارگذاری محتوا. از محتوای پیش‌فرض استفاده می‌شود.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFooterContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/site-content");
      if (response.ok) {
        const data = await response.json();
        // اگر محتوا از API آمد، استفاده کن، در غیر این صورت از defaultFooterContent استفاده می‌شود
        if (data.data?.footer) {
          // Merge کردن با defaultFooterContent برای اطمینان از وجود همه فیلدها
          setFooterContent({
            footer: {
              ...defaultFooterContent.footer,
              ...data.data.footer,
              about: {
                ...defaultFooterContent.footer.about,
                ...data.data.footer.about,
                socialLinks: {
                  ...defaultFooterContent.footer.about.socialLinks,
                  ...data.data.footer.about?.socialLinks,
                },
              },
              quickLinks: {
                ...defaultFooterContent.footer.quickLinks,
                ...data.data.footer.quickLinks,
                links: data.data.footer.quickLinks?.links?.length > 0 
                  ? data.data.footer.quickLinks.links 
                  : defaultFooterContent.footer.quickLinks.links,
              },
              support: {
                ...defaultFooterContent.footer.support,
                ...data.data.footer.support,
                links: data.data.footer.support?.links?.length > 0 
                  ? data.data.footer.support.links 
                  : defaultFooterContent.footer.support.links,
              },
              contact: {
                ...defaultFooterContent.footer.contact,
                ...data.data.footer.contact,
              },
            },
          });
        } else {
          // اگر محتوا موجود نبود، از defaultFooterContent استفاده کن
          setFooterContent(defaultFooterContent);
        }
      } else {
        // اگر خطا بود، از defaultFooterContent استفاده کن
        setFooterContent(defaultFooterContent);
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
      // در صورت خطا، از defaultFooterContent استفاده کن
      setFooterContent(defaultFooterContent);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری محتوای فوتر. از محتوای پیش‌فرض استفاده می‌شود.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activePage === "footer") {
        // Save footer content
        const response = await fetch("/api/settings/site-content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: footerContent }),
        });

        if (response.ok) {
          toast({
            title: "موفق",
            description: "محتوای Footer با موفقیت ذخیره شد",
          });
        } else {
          const error = await response.json();
          toast({
            title: "خطا",
            description: error.error || "خطا در ذخیره محتوا",
            variant: "destructive",
          });
        }
      } else {
        // Save page content
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

  // Footer functions
  const addLink = (section: "quickLinks" | "support") => {
    setFooterContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: {
          ...prev.footer[section],
          links: [...prev.footer[section].links, { label: "", href: "" }],
        },
      },
    }));
  };

  const removeLink = (section: "quickLinks" | "support", index: number) => {
    setFooterContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: {
          ...prev.footer[section],
          links: prev.footer[section].links.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateLink = (section: "quickLinks" | "support", index: number, field: "label" | "href", value: string) => {
    setFooterContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: {
          ...prev.footer[section],
          links: prev.footer[section].links.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
          ),
        },
      },
    }));
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
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

          {/* Footer */}
          <TabsContent value="footer" className="space-y-3 mt-6">
            {/* Footer About */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSections({ ...openSections, footerAbout: !openSections.footerAbout })}
                className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">درباره ساد</span>
                </div>
                {openSections.footerAbout ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openSections.footerAbout && (
                <div className="space-y-4 p-4 pt-2 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm">عنوان</Label>
                    <Input
                      value={footerContent.footer.about.title}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            about: { ...prev.footer.about, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">توضیحات</Label>
                    <Textarea
                      value={footerContent.footer.about.description}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            about: { ...prev.footer.about, description: e.target.value },
                          },
                        }))
                      }
                      rows={3}
                      placeholder="توضیحات کوتاه درباره فروشگاه..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">شبکه‌های اجتماعی</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          Instagram
                        </Label>
                        <Input
                          value={footerContent.footer.about.socialLinks.instagram}
                          onChange={(e) =>
                            setFooterContent((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                about: {
                                  ...prev.footer.about,
                                  socialLinks: {
                                    ...prev.footer.about.socialLinks,
                                    instagram: e.target.value,
                                  },
                                },
                              },
                            }))
                          }
                          placeholder="#"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          <Facebook className="h-3 w-3" />
                          Facebook
                        </Label>
                        <Input
                          value={footerContent.footer.about.socialLinks.facebook}
                          onChange={(e) =>
                            setFooterContent((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                about: {
                                  ...prev.footer.about,
                                  socialLinks: {
                                    ...prev.footer.about.socialLinks,
                                    facebook: e.target.value,
                                  },
                                },
                              },
                            }))
                          }
                          placeholder="#"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          <Twitter className="h-3 w-3" />
                          Twitter
                        </Label>
                        <Input
                          value={footerContent.footer.about.socialLinks.twitter}
                          onChange={(e) =>
                            setFooterContent((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                about: {
                                  ...prev.footer.about,
                                  socialLinks: {
                                    ...prev.footer.about.socialLinks,
                                    twitter: e.target.value,
                                  },
                                },
                              },
                            }))
                          }
                          placeholder="#"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSections({ ...openSections, footerQuickLinks: !openSections.footerQuickLinks })}
                className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">دسترسی سریع</span>
                </div>
                {openSections.footerQuickLinks ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openSections.footerQuickLinks && (
                <div className="space-y-4 p-4 pt-2 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm">عنوان</Label>
                    <Input
                      value={footerContent.footer.quickLinks.title}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            quickLinks: { ...prev.footer.quickLinks, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">لینک‌ها</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addLink("quickLinks")}>
                        <Plus className="h-4 w-4 ml-2" />
                        افزودن لینک
                      </Button>
                    </div>
                    {footerContent.footer.quickLinks.links.length === 0 && (
                      <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg text-muted-foreground text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>هنوز لینکی اضافه نشده است</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      {footerContent.footer.quickLinks.links.map((link, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={link.label}
                              onChange={(e) => updateLink("quickLinks", index, "label", e.target.value)}
                              placeholder="عنوان لینک"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Input
                              value={link.href}
                              onChange={(e) => updateLink("quickLinks", index, "href", e.target.value)}
                              placeholder="/products"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeLink("quickLinks", index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Support Links */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSections({ ...openSections, footerSupport: !openSections.footerSupport })}
                className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">پشتیبانی</span>
                </div>
                {openSections.footerSupport ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openSections.footerSupport && (
                <div className="space-y-4 p-4 pt-2 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm">عنوان</Label>
                    <Input
                      value={footerContent.footer.support.title}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            support: { ...prev.footer.support, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">لینک‌ها</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addLink("support")}>
                        <Plus className="h-4 w-4 ml-2" />
                        افزودن لینک
                      </Button>
                    </div>
                    {footerContent.footer.support.links.length === 0 && (
                      <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg text-muted-foreground text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>هنوز لینکی اضافه نشده است</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      {footerContent.footer.support.links.map((link, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={link.label}
                              onChange={(e) => updateLink("support", index, "label", e.target.value)}
                              placeholder="عنوان لینک"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Input
                              value={link.href}
                              onChange={(e) => updateLink("support", index, "href", e.target.value)}
                              placeholder="/faq"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeLink("support", index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Contact */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSections({ ...openSections, footerContact: !openSections.footerContact })}
                className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">تماس با ما</span>
                </div>
                {openSections.footerContact ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openSections.footerContact && (
                <div className="space-y-4 p-4 pt-2 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm">عنوان</Label>
                    <Input
                      value={footerContent.footer.contact.title}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            contact: { ...prev.footer.contact, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        تلفن
                      </Label>
                      <Input
                        value={footerContent.footer.contact.phone}
                        onChange={(e) =>
                          setFooterContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: { ...prev.footer.contact, phone: e.target.value },
                            },
                          }))
                        }
                        placeholder="021-12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        ایمیل
                      </Label>
                      <Input
                        type="email"
                        value={footerContent.footer.contact.email}
                        onChange={(e) =>
                          setFooterContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: { ...prev.footer.contact, email: e.target.value },
                            },
                          }))
                        }
                        placeholder="info@saded.ir"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Copyright */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSections({ ...openSections, footerCopyright: !openSections.footerCopyright })}
                className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Copyright</span>
                </div>
                {openSections.footerCopyright ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openSections.footerCopyright && (
                <div className="p-4 pt-2 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm">متن Copyright</Label>
                    <Input
                      value={footerContent.footer.copyright}
                      onChange={(e) =>
                        setFooterContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            copyright: e.target.value,
                          },
                        }))
                      }
                      placeholder={`© ${new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.`}
                    />
                    <p className="text-xs text-muted-foreground">
                      این متن در پایین Footer نمایش داده می‌شود
                    </p>
                  </div>
                </div>
              )}
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

