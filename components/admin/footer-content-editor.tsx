"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Link as LinkIcon, RefreshCw, Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SocialLink {
  url: string;
  enabled: boolean;
}

interface SocialLinks {
  instagram: SocialLink;
  facebook: SocialLink;
  twitter: SocialLink;
  whatsapp: SocialLink;
  telegram: SocialLink;
  youtube: SocialLink;
  linkedin: SocialLink;
  tiktok: SocialLink;
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
    contact: {
      title: string;
      phone: string;
      email: string;
    };
    copyright: string;
  };
}

// Default content که کاربر در سایت می‌بیند
const defaultContent: FooterContent = {
  footer: {
    about: {
      title: "درباره ساد",
      description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم.",
      socialLinks: {
        instagram: { url: "#", enabled: false },
        facebook: { url: "#", enabled: false },
        twitter: { url: "#", enabled: false },
        whatsapp: { url: "#", enabled: false },
        telegram: { url: "#", enabled: false },
        youtube: { url: "#", enabled: false },
        linkedin: { url: "#", enabled: false },
        tiktok: { url: "#", enabled: false },
      },
    },
    contact: {
      title: "تماس با ما",
      phone: "021-12345678",
      email: "info@saded.ir",
    },
    copyright: `© ${new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.`,
  },
};

export function FooterContentEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<FooterContent>(defaultContent);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/settings/site-content");
      if (response.ok) {
        const data = await response.json();
        // اگر محتوا از API آمد، استفاده کن، در غیر این صورت از defaultContent استفاده می‌شود
        if (data.data?.footer) {
          // Merge کردن با defaultContent برای اطمینان از وجود همه فیلدها
          setContent({
            footer: {
              ...defaultContent.footer,
              ...data.data.footer,
              about: {
                ...defaultContent.footer.about,
                ...data.data.footer.about,
                socialLinks: (() => {
                  const oldLinks = data.data.footer.about?.socialLinks;
                  if (!oldLinks) return defaultContent.footer.about.socialLinks;
                  
                  // Handle old format (string) or new format (object with url and enabled)
                  const convertLink = (oldValue: any, defaultLink: SocialLink): SocialLink => {
                    if (typeof oldValue === "string") {
                      // Old format: just a URL string
                      return { url: oldValue, enabled: oldValue !== "#" && oldValue !== "" };
                    } else if (oldValue && typeof oldValue === "object") {
                      // New format: object with url and enabled
                      return { url: oldValue.url || "#", enabled: oldValue.enabled ?? false };
                    }
                    return defaultLink;
                  };
                  
                  return {
                    instagram: convertLink(oldLinks.instagram, defaultContent.footer.about.socialLinks.instagram),
                    facebook: convertLink(oldLinks.facebook, defaultContent.footer.about.socialLinks.facebook),
                    twitter: convertLink(oldLinks.twitter, defaultContent.footer.about.socialLinks.twitter),
                    whatsapp: convertLink(oldLinks.whatsapp, defaultContent.footer.about.socialLinks.whatsapp),
                    telegram: convertLink(oldLinks.telegram, defaultContent.footer.about.socialLinks.telegram),
                    youtube: convertLink(oldLinks.youtube, defaultContent.footer.about.socialLinks.youtube),
                    linkedin: convertLink(oldLinks.linkedin, defaultContent.footer.about.socialLinks.linkedin),
                    tiktok: convertLink(oldLinks.tiktok, defaultContent.footer.about.socialLinks.tiktok),
                  };
                })(),
              },
              contact: {
                ...defaultContent.footer.contact,
                ...data.data.footer.contact,
              },
            },
          });
        } else {
          // اگر محتوا موجود نبود، از defaultContent استفاده کن
          setContent(defaultContent);
        }
      } else {
        // اگر خطا بود، از defaultContent استفاده کن
        setContent(defaultContent);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      // در صورت خطا، از defaultContent استفاده کن
      setContent(defaultContent);
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

    // Validate social links URLs (only if enabled)
    const socialLinks = content.footer.about.socialLinks;
    const socialNetworks = [
      { key: "instagram", name: "اینستاگرام" },
      { key: "facebook", name: "فیسبوک" },
      { key: "twitter", name: "توییتر" },
      { key: "whatsapp", name: "واتساپ" },
      { key: "telegram", name: "تلگرام" },
      { key: "youtube", name: "یوتیوب" },
      { key: "linkedin", name: "لینکدین" },
      { key: "tiktok", name: "تیک‌تاک" },
    ];

    for (const network of socialNetworks) {
      const link = socialLinks[network.key as keyof SocialLinks];
      if (link && link.enabled && link.url && link.url !== "#") {
        const url = link.url;
        if (typeof url === "string" && url.trim() !== "") {
          if (!url.startsWith("http") && !url.startsWith("https") && !url.startsWith("wa.me") && !url.startsWith("t.me")) {
            return `لینک ${network.name} باید با http، https، wa.me یا t.me شروع شود`;
          }
        }
      }
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
          <div className="space-y-4">
            <Label>لینک‌های شبکه‌های اجتماعی</Label>
            <p className="text-xs text-muted-foreground mb-3">
              آدرس کامل شبکه‌های اجتماعی را وارد کنید و با Switch آن‌ها را فعال/غیرفعال کنید
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <Label>Instagram</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.instagram.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              instagram: { ...prev.footer.about.socialLinks.instagram, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.instagram.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            instagram: { ...prev.footer.about.socialLinks.instagram, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://instagram.com/..."
                  disabled={!content.footer.about.socialLinks.instagram.enabled}
                />
              </div>

              {/* Facebook */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <Label>Facebook</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.facebook.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              facebook: { ...prev.footer.about.socialLinks.facebook, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.facebook.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            facebook: { ...prev.footer.about.socialLinks.facebook, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://facebook.com/..."
                  disabled={!content.footer.about.socialLinks.facebook.enabled}
                />
              </div>

              {/* Twitter/X */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <Label>Twitter/X</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.twitter.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              twitter: { ...prev.footer.about.socialLinks.twitter, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.twitter.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            twitter: { ...prev.footer.about.socialLinks.twitter, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://twitter.com/... یا https://x.com/..."
                  disabled={!content.footer.about.socialLinks.twitter.enabled}
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <Label>WhatsApp</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.whatsapp.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              whatsapp: { ...prev.footer.about.socialLinks.whatsapp, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.whatsapp.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            whatsapp: { ...prev.footer.about.socialLinks.whatsapp, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://wa.me/..."
                  disabled={!content.footer.about.socialLinks.whatsapp.enabled}
                />
              </div>

              {/* Telegram */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    <Label>Telegram</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.telegram.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              telegram: { ...prev.footer.about.socialLinks.telegram, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.telegram.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            telegram: { ...prev.footer.about.socialLinks.telegram, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://t.me/..."
                  disabled={!content.footer.about.socialLinks.telegram.enabled}
                />
              </div>

              {/* YouTube */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <Label>YouTube</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.youtube.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              youtube: { ...prev.footer.about.socialLinks.youtube, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.youtube.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            youtube: { ...prev.footer.about.socialLinks.youtube, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://youtube.com/..."
                  disabled={!content.footer.about.socialLinks.youtube.enabled}
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <Label>LinkedIn</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.linkedin.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              linkedin: { ...prev.footer.about.socialLinks.linkedin, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.linkedin.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            linkedin: { ...prev.footer.about.socialLinks.linkedin, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://linkedin.com/..."
                  disabled={!content.footer.about.socialLinks.linkedin.enabled}
                />
              </div>

              {/* TikTok */}
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-black dark:text-white" />
                    <Label>TikTok</Label>
                  </div>
                  <Switch
                    checked={content.footer.about.socialLinks.tiktok.enabled}
                    onCheckedChange={(checked) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          about: {
                            ...prev.footer.about,
                            socialLinks: {
                              ...prev.footer.about.socialLinks,
                              tiktok: { ...prev.footer.about.socialLinks.tiktok, enabled: checked },
                            },
                          },
                        },
                      }))
                    }
                  />
                </div>
                <Input
                  value={content.footer.about.socialLinks.tiktok.url}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        about: {
                          ...prev.footer.about,
                          socialLinks: {
                            ...prev.footer.about.socialLinks,
                            tiktok: { ...prev.footer.about.socialLinks.tiktok, url: e.target.value },
                          },
                        },
                      },
                    }))
                  }
                  placeholder="https://tiktok.com/..."
                  disabled={!content.footer.about.socialLinks.tiktok.enabled}
                />
              </div>
            </div>
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

