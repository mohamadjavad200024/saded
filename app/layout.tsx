import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";

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
        {/* Organization Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
