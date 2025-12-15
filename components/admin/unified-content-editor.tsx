"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Trash2, FileText, Link as LinkIcon, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

interface SectionInfo {
  key: PageType;
  title: string;
  icon: React.ReactNode;
}

const sections: SectionInfo[] = [
  { key: "about", title: "درباره ما", icon: <FileText className="h-4 w-4" /> },
  { key: "faq", title: "سوالات متداول", icon: <FileText className="h-4 w-4" /> },
  { key: "shipping", title: "ارسال و تحویل", icon: <FileText className="h-4 w-4" /> },
  { key: "returns", title: "بازگشت کالا", icon: <FileText className="h-4 w-4" /> },
  { key: "warranty", title: "گارانتی", icon: <FileText className="h-4 w-4" /> },
  { key: "contact", title: "تماس با ما", icon: <FileText className="h-4 w-4" /> },
  { key: "footer", title: "Footer", icon: <LinkIcon className="h-4 w-4" /> },
];

export function UnifiedContentEditor() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<PageType>("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Page content states
  const [textContent, setTextContent] = useState("");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
  });

  // Footer content state
  const [footerContent, setFooterContent] = useState<FooterContent>({
    footer: {
      about: {
        title: "درباره ساد",
        description: "",
        socialLinks: { instagram: "#", facebook: "#", twitter: "#" },
      },
      quickLinks: { title: "دسترسی سریع", links: [] },
      support: { title: "پشتیبانی", links: [] },
      contact: { title: "تماس با ما", phone: "", email: "" },
      copyright: "",
    },
  });

  // Collapsible states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    footerAbout: true,
    footerQuickLinks: false,
    footerSupport: false,
    footerContact: false,
    footerCopyright: false,
  });

  useEffect(() => {
    if (activeSection === "footer") {
      loadFooterContent();
    } else {
      loadPageContent(activeSection);
    }
  }, [activeSection]);

  const loadPageContent = async (page: PageType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/settings/page-content?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        const content = data.data?.content;

        if (page === "faq") {
          const faqs = typeof content === "string" ? JSON.parse(content) : content;
          setFaqItems(Array.isArray(faqs) ? faqs : []);
        } else if (page === "contact") {
          const contact = typeof content === "string" ? JSON.parse(content) : content;
          setContactInfo(contact || { phone: "", email: "", address: "" });
        } else {
          setTextContent(typeof content === "string" ? content : "");
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
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
        if (data.data?.footer) {
          setFooterContent(data.data);
        }
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeSection === "footer") {
        // Save footer content
        const response = await fetch("/api/settings/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: footerContent }),
        });

        if (response.ok) {
          toast({
            title: "موفق",
            description: "محتوای Footer با موفقیت ذخیره شد",
          });
        } else {
          throw new Error("خطا در ذخیره");
        }
      } else {
        // Save page content
        let content: any;
        if (activeSection === "faq") {
          content = faqItems;
        } else if (activeSection === "contact") {
          content = contactInfo;
        } else {
          content = textContent;
        }

        const response = await fetch(`/api/settings/page-content?page=${activeSection}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          toast({
            title: "موفق",
            description: `محتوای ${sections.find(s => s.key === activeSection)?.title} با موفقیت ذخیره شد`,
          });
        } else {
          throw new Error("خطا در ذخیره");
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

  const addFAQ = () => setFaqItems([...faqItems, { question: "", answer: "" }]);
  const removeFAQ = (index: number) => setFaqItems(faqItems.filter((_, i) => i !== index));
  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setFaqItems(faqItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

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
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-primary/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              مدیریت محتوای صفحات
            </CardTitle>
            <CardDescription className="mt-1">
              ویرایش محتوای تمام صفحات سایت
            </CardDescription>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                ذخیره
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as PageType)} className="w-full">
          <div className="border-b bg-muted/30">
            <TabsList className="h-auto w-full justify-start bg-transparent p-2 gap-1">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 px-4 py-2.5"
                >
                  {section.icon}
                  <span className="text-sm font-medium">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6">
            {/* About Page */}
            <TabsContent value="about" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">محتوای صفحه درباره ما</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="محتوای صفحه درباره ما را اینجا وارد کنید..."
                  className="min-h-[200px] resize-none"
                  rows={8}
                />
              </div>
            </TabsContent>

            {/* FAQ Page */}
            <TabsContent value="faq" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">سوالات متداول</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFAQ} className="gap-2">
                  <Plus className="h-4 w-4" />
                  افزودن سوال
                </Button>
              </div>
              <div className="space-y-3">
                {faqItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    هنوز سوالی اضافه نشده است
                  </div>
                ) : (
                  faqItems.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, "question", e.target.value)}
                        placeholder="سوال..."
                        className="font-medium"
                      />
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                        placeholder="پاسخ..."
                        rows={2}
                        className="resize-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Shipping Page */}
            <TabsContent value="shipping" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">محتوای صفحه ارسال و تحویل</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="محتوای صفحه ارسال و تحویل را اینجا وارد کنید..."
                  className="min-h-[200px] resize-none"
                  rows={8}
                />
              </div>
            </TabsContent>

            {/* Returns Page */}
            <TabsContent value="returns" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">محتوای صفحه بازگشت کالا</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="محتوای صفحه بازگشت کالا را اینجا وارد کنید..."
                  className="min-h-[200px] resize-none"
                  rows={8}
                />
              </div>
            </TabsContent>

            {/* Warranty Page */}
            <TabsContent value="warranty" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">محتوای صفحه گارانتی</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="محتوای صفحه گارانتی را اینجا وارد کنید..."
                  className="min-h-[200px] resize-none"
                  rows={8}
                />
              </div>
            </TabsContent>

            {/* Contact Page */}
            <TabsContent value="contact" className="mt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    شماره تلفن
                  </Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="021-12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    ایمیل
                  </Label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="info@saded.ir"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    آدرس
                  </Label>
                  <Textarea
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    placeholder="تهران، ایران"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Footer */}
            <TabsContent value="footer" className="mt-0 space-y-3">
              {/* Footer About */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSections({ ...openSections, footerAbout: !openSections.footerAbout })}
                  className="flex w-full items-center justify-between rounded-lg border-0 p-4 hover:bg-accent transition-colors bg-muted/30"
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
                    <Label className="text-xs">عنوان</Label>
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
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">توضیحات</Label>
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
                      className="resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
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
                        className="h-9 text-xs"
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
                        className="h-9 text-xs"
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
                        className="h-9 text-xs"
                      />
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
                  className="flex w-full items-center justify-between rounded-lg border-0 p-4 hover:bg-accent transition-colors bg-muted/30"
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
                    <Label className="text-xs">عنوان</Label>
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
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">لینک‌ها</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addLink("quickLinks")} className="h-7 gap-1 text-xs">
                        <Plus className="h-3 w-3" />
                        افزودن
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {footerContent.footer.quickLinks.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) => updateLink("quickLinks", index, "label", e.target.value)}
                            placeholder="عنوان"
                            className="h-8 text-xs flex-1"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) => updateLink("quickLinks", index, "href", e.target.value)}
                            placeholder="/products"
                            className="h-8 text-xs flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink("quickLinks", index)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
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
                  className="flex w-full items-center justify-between rounded-lg border-0 p-4 hover:bg-accent transition-colors bg-muted/30"
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
                      <Label className="text-xs">عنوان</Label>
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
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">لینک‌ها</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addLink("support")} className="h-7 gap-1 text-xs">
                        <Plus className="h-3 w-3" />
                        افزودن
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {footerContent.footer.support.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) => updateLink("support", index, "label", e.target.value)}
                            placeholder="عنوان"
                            className="h-8 text-xs flex-1"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) => updateLink("support", index, "href", e.target.value)}
                            placeholder="/faq"
                            className="h-8 text-xs flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink("support", index)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
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
                  className="flex w-full items-center justify-between rounded-lg border-0 p-4 hover:bg-accent transition-colors bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">تماس با ما (Footer)</span>
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
                      <Label className="text-xs">عنوان</Label>
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
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs">تلفن</Label>
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
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">ایمیل</Label>
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
                        className="h-9"
                      />
                    </div>
                  </div>
                  </div>
                )}

              {/* Copyright */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSections({ ...openSections, footerCopyright: !openSections.footerCopyright })}
                  className="flex w-full items-center justify-between rounded-lg border-0 p-4 hover:bg-accent transition-colors bg-muted/30"
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
                    <Label className="text-xs">متن Copyright</Label>
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
                      className="h-9"
                    />
                  </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

