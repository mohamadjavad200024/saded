"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Link as LinkIcon, RefreshCw, GripVertical, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
}

interface LinkItem {
  label: string;
  href: string;
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

export function FooterContentEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<FooterContent>({
    footer: {
      about: {
        title: "درباره ساد",
        description: "",
        socialLinks: {
          instagram: "#",
          facebook: "#",
          twitter: "#",
        },
      },
      quickLinks: {
        title: "دسترسی سریع",
        links: [],
      },
      support: {
        title: "پشتیبانی",
        links: [],
      },
      contact: {
        title: "تماس با ما",
        phone: "",
        email: "",
      },
      copyright: "",
    },
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/settings/site-content");
      if (response.ok) {
        const data = await response.json();
        if (data.data?.footer) {
          setContent(data.data);
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateContent = (): string | null => {
    // Validate about section
    if (!content.footer.about.title.trim()) {
      return "عنوان بخش درباره ساد الزامی است";
    }

    // Validate contact section
    if (!content.footer.contact.title.trim()) {
      return "عنوان بخش تماس با ما الزامی است";
    }

    if (content.footer.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.footer.contact.email)) {
      return "ایمیل وارد شده معتبر نیست";
    }

    // Validate links
    for (const link of content.footer.quickLinks.links) {
      if (!link.label.trim() || !link.href.trim()) {
        return "تمام لینک‌های دسترسی سریع باید عنوان و آدرس داشته باشند";
      }
      if (!link.href.startsWith("/") && !link.href.startsWith("http")) {
        return `آدرس لینک "${link.label}" باید با "/" یا "http" شروع شود`;
      }
    }

    for (const link of content.footer.support.links) {
      if (!link.label.trim() || !link.href.trim()) {
        return "تمام لینک‌های پشتیبانی باید عنوان و آدرس داشته باشند";
      }
      if (!link.href.startsWith("/") && !link.href.startsWith("http")) {
        return `آدرس لینک "${link.label}" باید با "/" یا "http" شروع شود`;
      }
    }

    // Validate social links URLs
    const socialLinks = content.footer.about.socialLinks;
    if (socialLinks.instagram && !socialLinks.instagram.startsWith("http") && socialLinks.instagram !== "#") {
      return "لینک اینستاگرام باید با http شروع شود یا # باشد";
    }
    if (socialLinks.facebook && !socialLinks.facebook.startsWith("http") && socialLinks.facebook !== "#") {
      return "لینک فیسبوک باید با http شروع شود یا # باشد";
    }
    if (socialLinks.twitter && !socialLinks.twitter.startsWith("http") && socialLinks.twitter !== "#") {
      return "لینک توییتر باید با http شروع شود یا # باشد";
    }

    return null;
  };

  const handleSave = async () => {
    // Validate content before saving
    const validationError = validateContent();
    if (validationError) {
      toast({
        title: "خطا در اعتبارسنجی",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/settings/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
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

  const addLink = (section: "quickLinks" | "support") => {
    setContent((prev) => ({
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
    setContent((prev) => ({
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
    setContent((prev) => ({
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
          <LinkIcon className="h-5 w-5 text-primary" />
          محتوای Footer
        </CardTitle>
        <CardDescription>
          ویرایش تمام بخش‌های Footer سایت. تغییرات پس از ذخیره در سایت نمایش داده می‌شوند.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* About Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">درباره ساد</h4>
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">عنوان</Label>
            <Input
              id="aboutTitle"
              value={content.footer.about.title}
              onChange={(e) =>
                setContent((prev) => ({
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
            <Label htmlFor="aboutDescription">توضیحات</Label>
            <Textarea
              id="aboutDescription"
              value={content.footer.about.description}
              onChange={(e) =>
                setContent((prev) => ({
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
            <p className="text-xs text-muted-foreground">
              این متن در بخش درباره ساد در Footer نمایش داده می‌شود
            </p>
          </div>
          <div className="space-y-2">
            <Label>لینک‌های شبکه‌های اجتماعی</Label>
            <p className="text-xs text-muted-foreground mb-3">
              آدرس کامل شبکه‌های اجتماعی را وارد کنید یا # برای غیرفعال کردن
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={content.footer.about.socialLinks.instagram}
                  onChange={(e) =>
                    setContent((prev) => ({
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
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={content.footer.about.socialLinks.facebook}
                  onChange={(e) =>
                    setContent((prev) => ({
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
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input
                  value={content.footer.about.socialLinks.twitter}
                  onChange={(e) =>
                    setContent((prev) => ({
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
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">دسترسی سریع</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addLink("quickLinks")}
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن لینک
            </Button>
          </div>
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input
              value={content.footer.quickLinks.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  footer: {
                    ...prev.footer,
                    quickLinks: { ...prev.footer.quickLinks, title: e.target.value },
                  },
                }))
              }
            />
          </div>
          {content.footer.quickLinks.links.length === 0 && (
            <div className="flex items-center gap-2 p-4 border border-dashed rounded-lg text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">هنوز لینکی اضافه نشده است</span>
            </div>
          )}
          <div className="space-y-3">
            {content.footer.quickLinks.links.map((link, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="عنوان لینک (مثال: محصولات)"
                    value={link.label}
                    onChange={(e) => updateLink("quickLinks", index, "label", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="/products یا https://..."
                    value={link.href}
                    onChange={(e) => updateLink("quickLinks", index, "href", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeLink("quickLinks", index)}
                  title="حذف لینک"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Support Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">پشتیبانی</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addLink("support")}
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن لینک
            </Button>
          </div>
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input
              value={content.footer.support.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  footer: {
                    ...prev.footer,
                    support: { ...prev.footer.support, title: e.target.value },
                  },
                }))
              }
            />
          </div>
          {content.footer.support.links.length === 0 && (
            <div className="flex items-center gap-2 p-4 border border-dashed rounded-lg text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">هنوز لینکی اضافه نشده است</span>
            </div>
          )}
          <div className="space-y-3">
            {content.footer.support.links.map((link, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="عنوان لینک (مثال: سوالات متداول)"
                    value={link.label}
                    onChange={(e) => updateLink("support", index, "label", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="/faq یا https://..."
                    value={link.href}
                    onChange={(e) => updateLink("support", index, "href", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeLink("support", index)}
                  title="حذف لینک"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">تماس با ما</h4>
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input
              value={content.footer.contact.title}
              onChange={(e) =>
                setContent((prev) => ({
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
              <Label>شماره تلفن</Label>
              <Input
                value={content.footer.contact.phone}
                onChange={(e) =>
                  setContent((prev) => ({
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
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={content.footer.contact.email}
                onChange={(e) =>
                  setContent((prev) => ({
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

        <Separator />

        {/* Copyright */}
        <div className="space-y-2">
          <Label htmlFor="copyright">متن Copyright</Label>
          <Input
            id="copyright"
            value={content.footer.copyright}
            onChange={(e) =>
              setContent((prev) => ({
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
            این متن در پایین Footer نمایش داده می‌شود. می‌توانید از متغیر {"{"}YEAR{"}"} برای سال جاری استفاده کنید.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                ذخیره محتوای Footer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

