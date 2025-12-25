"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, Youtube, Linkedin, MessageCircle, Send } from "lucide-react";

interface FooterContent {
  footer: {
    about: {
      title: string;
      description: string;
      socialLinks: {
        instagram: { url: string; enabled: boolean };
        facebook: { url: string; enabled: boolean };
        twitter: { url: string; enabled: boolean };
        whatsapp: { url: string; enabled: boolean };
        telegram: { url: string; enabled: boolean };
        youtube: { url: string; enabled: boolean };
        linkedin: { url: string; enabled: boolean };
        tiktok: { url: string; enabled: boolean };
      };
    };
    quickLinks?: {
      title: string;
      links: Array<{ label: string; href: string }>;
    };
    support?: {
      title: string;
      links: Array<{ label: string; href: string }>;
    };
    contact: {
      title: string;
      phone: string;
      email: string;
    };
    copyright: string;
  };
}

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

export function Footer() {
  const [content, setContent] = useState<FooterContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/settings/site-content");
        if (response.ok) {
          const data = await response.json();
          if (data.data?.footer) {
            try {
              // Handle old format (string) or new format (object with url and enabled)
              const footerData = data.data;
              if (footerData.footer?.about?.socialLinks) {
                const oldLinks = footerData.footer.about.socialLinks;
                const convertLink = (oldValue: any, defaultLink: { url: string; enabled: boolean }): { url: string; enabled: boolean } => {
                  if (typeof oldValue === "string") {
                    return { url: oldValue, enabled: oldValue !== "#" && oldValue !== "" };
                  } else if (oldValue && typeof oldValue === "object" && "url" in oldValue) {
                    return { url: oldValue.url || "#", enabled: oldValue.enabled ?? false };
                  }
                  return defaultLink;
                };
                
                footerData.footer.about.socialLinks = {
                  instagram: convertLink(oldLinks.instagram, defaultContent.footer.about.socialLinks.instagram),
                  facebook: convertLink(oldLinks.facebook, defaultContent.footer.about.socialLinks.facebook),
                  twitter: convertLink(oldLinks.twitter, defaultContent.footer.about.socialLinks.twitter),
                  whatsapp: convertLink(oldLinks.whatsapp, defaultContent.footer.about.socialLinks.whatsapp),
                  telegram: convertLink(oldLinks.telegram, defaultContent.footer.about.socialLinks.telegram),
                  youtube: convertLink(oldLinks.youtube, defaultContent.footer.about.socialLinks.youtube),
                  linkedin: convertLink(oldLinks.linkedin, defaultContent.footer.about.socialLinks.linkedin),
                  tiktok: convertLink(oldLinks.tiktok, defaultContent.footer.about.socialLinks.tiktok),
                };
              }
              
              // اگر quickLinks و support در دیتابیس نیستند، از defaultContent استفاده کن
              if (!footerData.footer.quickLinks) {
                footerData.footer.quickLinks = defaultContent.footer.quickLinks;
              }
              if (!footerData.footer.support) {
                footerData.footer.support = defaultContent.footer.support;
              }
              
              setContent(footerData);
            } catch (parseError) {
              console.error("Error parsing footer content:", parseError);
              // Use default content if parsing fails
              setContent(defaultContent);
            }
          } else {
            setContent(defaultContent);
          }
        } else {
          setContent(defaultContent);
        }
      } catch (error) {
        console.error("Error fetching footer content:", error);
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <footer className="border-t-[0.25px] border-border/30 bg-background">
        <div className="container py-12">
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </footer>
    );
  }

  return (
      <footer className="border-t-[0.25px] border-border/30 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground">{content.footer.about.title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.footer.about.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.footer.about.socialLinks.instagram.enabled && content.footer.about.socialLinks.instagram.url && content.footer.about.socialLinks.instagram.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.facebook.enabled && content.footer.about.socialLinks.facebook.url && content.footer.about.socialLinks.facebook.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.twitter.enabled && content.footer.about.socialLinks.twitter.url && content.footer.about.socialLinks.twitter.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.whatsapp.enabled && content.footer.about.socialLinks.whatsapp.url && content.footer.about.socialLinks.whatsapp.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.telegram.enabled && content.footer.about.socialLinks.telegram.url && content.footer.about.socialLinks.telegram.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="Telegram"
                >
                  <Send className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.youtube.enabled && content.footer.about.socialLinks.youtube.url && content.footer.about.socialLinks.youtube.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.linkedin.enabled && content.footer.about.socialLinks.linkedin.url && content.footer.about.socialLinks.linkedin.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.tiktok.enabled && content.footer.about.socialLinks.tiktok.url && content.footer.about.socialLinks.tiktok.url !== "#" && (
                <Link
                  href={content.footer.about.socialLinks.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                  aria-label="TikTok"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {content.footer.quickLinks && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{content.footer.quickLinks.title}</h3>
              <ul className="space-y-2 text-sm">
                {content.footer.quickLinks.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support */}
          {content.footer.support && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{content.footer.support.title}</h3>
              <ul className="space-y-2 text-sm">
                {content.footer.support.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground">{content.footer.contact.title}</h3>
            <ul className="space-y-3 text-sm">
              {content.footer.contact.phone && (
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{content.footer.contact.phone}</span>
                </li>
              )}
              {content.footer.contact.email && (
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{content.footer.contact.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-[0.25px] border-border/30 text-center text-sm text-muted-foreground">
          <p>{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

