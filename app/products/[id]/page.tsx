import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetail } from "@/components/product/product-detail";
import { getRow } from "@/lib/db/index";
import type { Product } from "@/types/product";
import { getPlaceholderImage } from "@/lib/image-utils";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://saded.ir";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getRow<any>(
      "SELECT * FROM products WHERE id = ? AND enabled = TRUE",
      [id]
    );

    if (!product) {
      return null;
    }

    // Parse JSON fields
    const parsedProduct: Product = {
      ...product,
      images: Array.isArray(product.images) 
        ? product.images 
        : (typeof product.images === 'string' ? JSON.parse(product.images) : []),
      tags: Array.isArray(product.tags) 
        ? product.tags 
        : (typeof product.tags === 'string' ? JSON.parse(product.tags) : []),
      specifications: typeof product.specifications === 'object' && product.specifications !== null 
        ? product.specifications 
        : (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : {}),
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      stockCount: Number(product.stockCount),
      inStock: Boolean(product.inStock),
      enabled: Boolean(product.enabled),
      vinEnabled: Boolean(product.vinEnabled),
      airShippingEnabled: Boolean(product.airShippingEnabled),
      seaShippingEnabled: Boolean(product.seaShippingEnabled),
      airShippingCost: product.airShippingCost !== null && product.airShippingCost !== undefined 
        ? Number(product.airShippingCost) 
        : null,
      seaShippingCost: product.seaShippingCost !== null && product.seaShippingCost !== undefined 
        ? Number(product.seaShippingCost) 
        : null,
      createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt),
    };

    return parsedProduct;
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "محصول یافت نشد - ساد",
      description: "محصول مورد نظر شما یافت نشد",
    };
  }

  const productImage = product.images?.[0] || getPlaceholderImage(1200, 630);
  const productUrl = `${baseUrl}/products/${id}`;
  const price = product.price / 1000; // Convert from Rials to Tomans for display
  const description = product.description || `${product.name} - قطعه خودرو ${product.brand} با بهترین کیفیت و قیمت`;

  return {
    title: `${product.name} - ساد`,
    description: description.substring(0, 160),
    keywords: [
      product.name,
      product.brand,
      product.category,
      "قطعات خودرو",
      "قطعات وارداتی",
      ...(product.tags || []),
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.name,
      description: description.substring(0, 160),
      url: productUrl,
      siteName: "ساد - فروشگاه قطعات خودرو",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description.substring(0, 160),
      images: [productImage],
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
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-4 sm:py-6 md:py-8">
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </div>
  );
}

