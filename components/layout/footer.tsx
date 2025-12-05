import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-[0.25px] border-border/30 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">درباره ساد</h3>
            <p className="text-sm text-muted-foreground">
              فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت.
              ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم.
            </p>
            <div className="flex space-x-2 space-x-reverse">
              <Link
                href="#"
                className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  وبلاگ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">پشتیبانی</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  ارسال و تحویل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground hover:text-foreground transition-colors">
                  گارانتی
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">021-12345678</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@saded.ir</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-[0.25px] border-border/30 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

