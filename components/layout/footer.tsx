"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

interface FooterContent {
  footer: {
    about: {
      title: string;
      description: string;
      socialLinks: {
        instagram: string;
        facebook: string;
        twitter: string;
      };
    };
    quickLinks: {
      title: string;
      links: Array<{ label: string; href: string }>;
    };
    support: {
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
            setContent(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching footer content:", error);
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
            <div className="flex space-x-2 space-x-reverse">
              {content.footer.about.socialLinks.instagram && (
                <Link
                  href={content.footer.about.socialLinks.instagram}
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.facebook && (
                <Link
                  href={content.footer.about.socialLinks.facebook}
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {content.footer.about.socialLinks.twitter && (
                <Link
                  href={content.footer.about.socialLinks.twitter}
                  className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
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

          {/* Customer Service */}
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

