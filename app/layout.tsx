import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { ErrorHandler } from "./error-handler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://saded.ir";

// Generate metadata dynamically to include logo
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  // Make logo URL absolute if it's relative
  let logoUrl = settings.logoUrl;
  if (logoUrl && !logoUrl.startsWith('http') && !logoUrl.startsWith('data:')) {
    if (logoUrl.startsWith('/')) {
      logoUrl = `${baseUrl}${logoUrl}`;
    } else {
      logoUrl = `${baseUrl}/${logoUrl}`;
    }
  }
  
  // Always use logoUrl if available, otherwise fallback to /favicon.ico
  const finalLogoUrl = logoUrl || `${baseUrl}/favicon.ico`;
  const ogImageUrl = logoUrl || `${baseUrl}/og-image.jpg`;

  return {
    title: {
      default: `${settings.siteName} - فروشگاه قطعات خودرو وارداتی`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription || "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. بیش از 50,000 قطعه خودرو از برندهای معتبر",
    keywords: ["قطعات خودرو", "قطعات وارداتی", "خودرو", "فروشگاه آنلاین", "قطعات یدکی", "لوازم یدکی خودرو"],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: [
        // همیشه از لوگوی سایت استفاده می‌کنیم (اگر وجود داشته باشد)
        ...(logoUrl ? [
          { url: finalLogoUrl, sizes: "32x32", type: "image/png" },
          { url: finalLogoUrl, sizes: "16x16", type: "image/png" },
          { url: finalLogoUrl, sizes: "any" },
        ] : [
          // اگر لوگو وجود ندارد، از favicon.ico استفاده می‌کنیم
          { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        ]),
      ],
      shortcut: logoUrl 
        ? [{ url: finalLogoUrl, sizes: "any" }]
        : [{ url: "/favicon.ico", sizes: "any" }],
      apple: [
        { url: finalLogoUrl, sizes: "180x180" },
      ],
    },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: baseUrl,
      siteName: `${settings.siteName} - فروشگاه قطعات خودرو`,
      title: `${settings.siteName} - فروشگاه قطعات خودرو وارداتی`,
      description: settings.siteDescription || "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. بیش از 50,000 قطعه خودرو از برندهای معتبر",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${settings.siteName} - فروشگاه قطعات خودرو`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.siteName} - فروشگاه قطعات خودرو وارداتی`,
      description: settings.siteDescription || "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت",
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add Google Search Console verification code here when available
      // google: "your-google-verification-code",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get site settings for Schema.org structured data
  const settings = await getSiteSettings();
  const logoUrl = settings.logoUrl || `${baseUrl}/logo.png`;

  // Organization Schema.org structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.siteName,
    "alternateName": "Saded",
    "url": baseUrl,
    "logo": logoUrl,
    "description": settings.siteDescription || "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR"
    },
    "sameAs": [
      // Add social media links here when available
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Persian", "Farsi"]
    }
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* Background with TV Static Effect - Global */}
        <div className="fixed inset-0 -z-10 bg-background">
          {/* Base background */}
          <div className="absolute inset-0 bg-background" />
          
          {/* TV Static/Noise Effect - Layer 1 */}
          <div 
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
          
          {/* TV Static/Noise Effect - Layer 2 */}
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] mix-blend-mode-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px',
            }}
          />
        </div>

        {/* Organization Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ErrorBoundary>
          <Providers>
            <ErrorHandler />
            <div className="flex flex-col min-h-screen w-full">
              {children}
            </div>
            <BottomNavigation />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
