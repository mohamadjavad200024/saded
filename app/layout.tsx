import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { BottomNavigation } from "@/components/layout/bottom-navigation";

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

export const metadata: Metadata = {
  title: {
    default: "ساد - فروشگاه قطعات خودرو وارداتی",
    template: "%s | ساد",
  },
  description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. بیش از 50,000 قطعه خودرو از برندهای معتبر",
  keywords: ["قطعات خودرو", "قطعات وارداتی", "خودرو", "فروشگاه آنلاین", "قطعات یدکی", "لوازم یدکی خودرو"],
  authors: [{ name: "ساد" }],
  creator: "ساد",
  publisher: "ساد",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: baseUrl,
    siteName: "ساد - فروشگاه قطعات خودرو",
    title: "ساد - فروشگاه قطعات خودرو وارداتی",
    description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. بیش از 50,000 قطعه خودرو از برندهای معتبر",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ساد - فروشگاه قطعات خودرو",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ساد - فروشگاه قطعات خودرو وارداتی",
    description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت",
    images: [`${baseUrl}/og-image.jpg`],
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover", // Support for safe-area-inset
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema.org structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ساد",
    "alternateName": "Saded",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت",
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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
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
            {children}
            <BottomNavigation />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
