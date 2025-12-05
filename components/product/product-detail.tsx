"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2, Star, Check, Truck, Shield, Plane, Ship, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { getPlaceholderImage } from "@/lib/image-utils";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<"air" | "sea" | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const getProduct = useProductStore((state) => state.getProduct);
  const addProduct = useProductStore((state) => state.addProduct);

  // Only access store after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    
    // First try to get from store
    const productData = getProduct(productId);
    if (productData) {
      setProduct(productData);
      setIsLoading(false);
      return;
    }

    // If not in store, fetch from API
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const fetchedProduct = result.data;
            // Add to store for future use
            addProduct(fetchedProduct);
            setProduct(fetchedProduct);
          } else {
            setProduct(null);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getProduct, addProduct]);

  const setShippingMethodInStore = useCartStore((state) => state.setShippingMethod);

  // Show loading state during hydration or while fetching
  if (!isHydrated || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4" suppressHydrationWarning>
        <div className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">در حال بارگذاری...</h2>
      </div>
    );
  }

  // After loading, show error if product not found
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">محصول یافت نشد</h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
          متأسفانه محصول مورد نظر شما یافت نشد
        </p>
        <Link href="/products">
          <Button variant="default">
            بازگشت به لیست محصولات
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || getPlaceholderImage(300, 300),
      quantity,
    });
    // Save shipping method to store when adding to cart
    // Only save if a method is selected and it's enabled for this product
    if (shippingMethod) {
      if ((shippingMethod === "air" && product.airShippingEnabled) || 
          (shippingMethod === "sea" && product.seaShippingEnabled)) {
        setShippingMethodInStore(shippingMethod);
      } else {
        // If selected method is not enabled, set the first available method
        if (product.airShippingEnabled) {
          setShippingMethodInStore("air");
        } else if (product.seaShippingEnabled) {
          setShippingMethodInStore("sea");
        }
      }
    } else {
      // Auto-select first available method if none selected
      if (product.airShippingEnabled) {
        setShippingMethodInStore("air");
      } else if (product.seaShippingEnabled) {
        setShippingMethodInStore("sea");
      }
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_URL || 'https://saded.ir';
  const productUrl = `${baseUrl}/products/${product.id}`;
  const productImage = product.images?.[0] || getPlaceholderImage(600, 600);
  const price = product.price / 1000; // Convert from Rials to Tomans
  const availability = product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  // Generate Product Schema.org structured data
  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - قطعه خودرو ${product.brand || ''}`,
    "image": product.images.length > 0 ? product.images : [productImage],
    "brand": {
      "@type": "Brand",
      "name": product.brand || "نامشخص"
    },
    "category": product.category,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "IRR",
      "price": product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "ساد"
      }
    }
  };

  // Add aggregateRating only if rating exists
  if (product.rating) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": (product.reviews || 0).toString()
    };
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-0">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Breadcrumb - Minimal */}
      <nav className="text-[10px] sm:text-xs text-muted-foreground overflow-x-auto mb-2">
        <span>خانه</span> / <span>محصولات</span> / <span>{product.category}</span> /{" "}
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      {/* Category */}
      <div>
        <span className="text-xs sm:text-sm text-muted-foreground">{product.category}</span>
      </div>

      {/* Shipping Method Selection - At the top (Desktop only) */}
      {(product.airShippingEnabled || product.seaShippingEnabled) && (
        <div className="hidden lg:block space-y-2 sm:space-y-3 lg:max-w-lg lg:mr-auto">
          <label className="text-xs sm:text-sm font-medium block">روش ارسال:</label>
          <div className={`grid gap-2 sm:gap-3 ${(product.airShippingEnabled && product.seaShippingEnabled) ? "grid-cols-2" : "grid-cols-1"}`}>
            {product.airShippingEnabled && (
              <button
                onClick={() => setShippingMethod("air")}
                className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${
                  shippingMethod === "air"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 hover:border-primary/20"
                }`}
              >
                <Plane className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  shippingMethod === "air" ? "text-primary" : "text-muted-foreground"
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  shippingMethod === "air" ? "text-primary" : "text-foreground"
                }`}>
                  ارسال هوایی
                </span>
              </button>
            )}
            {product.seaShippingEnabled && (
              <button
                onClick={() => setShippingMethod("sea")}
                className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${
                  shippingMethod === "sea"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 hover:border-primary/20"
                }`}
              >
                <Ship className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  shippingMethod === "sea" ? "text-primary" : "text-muted-foreground"
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  shippingMethod === "sea" ? "text-primary" : "text-foreground"
                }`}>
                  ارسال دریایی
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Image Gallery */}
        <div className="space-y-2 sm:space-y-3 lg:-mt-32">
          <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || getPlaceholderImage(600, 600)}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {(product.images.length > 0 ? product.images : [getPlaceholderImage(600, 600)]).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-[0.25px] transition-all ${
                  selectedImage === index
                    ? "border-primary/30"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - تصویر ${index + 1} از ${product.images.length}`}
                  fill
                  className="object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 25vw, 20vw"
                />
              </button>
            ))}
          </div>

          {/* Shipping Method Selection - Below images (Mobile only) */}
          {(product.airShippingEnabled || product.seaShippingEnabled) && (
            <div className="block lg:hidden space-y-2 sm:space-y-3 pt-2 sm:pt-3">
              <label className="text-xs sm:text-sm font-medium block">روش ارسال:</label>
              <div className={`grid gap-2 sm:gap-3 ${(product.airShippingEnabled && product.seaShippingEnabled) ? "grid-cols-2" : "grid-cols-1"}`}>
                {product.airShippingEnabled && (
                  <button
                    onClick={() => setShippingMethod("air")}
                    className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${
                      shippingMethod === "air"
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/30 hover:border-primary/20"
                    }`}
                  >
                    <Plane className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      shippingMethod === "air" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className={`text-xs sm:text-sm font-medium ${
                      shippingMethod === "air" ? "text-primary" : "text-foreground"
                    }`}>
                      ارسال هوایی
                    </span>
                  </button>
                )}
                {product.seaShippingEnabled && (
                  <button
                    onClick={() => setShippingMethod("sea")}
                    className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${
                      shippingMethod === "sea"
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/30 hover:border-primary/20"
                    }`}
                  >
                    <Ship className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      shippingMethod === "sea" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className={`text-xs sm:text-sm font-medium ${
                      shippingMethod === "sea" ? "text-primary" : "text-foreground"
                    }`}>
                      ارسال دریایی
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-xs text-muted-foreground">{product.brand}</span>
              <span className="text-muted-foreground hidden sm:inline text-xs">•</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{product.category}</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 sm:gap-3 mb-0">
              {product.rating && (
                <>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-accent text-accent" />
                    <span className="text-sm sm:text-base font-semibold mr-1">{product.rating}</span>
                  </div>
                  {product.reviews && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({product.reviews} نظر)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("fa-IR")}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[10px] sm:text-xs text-secondary font-semibold">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                % تخفیف
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-1.5">
            {product.inStock ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-green-600 font-semibold">
                  موجود در انبار{product.stockCount ? ` (${product.stockCount} عدد)` : ""}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm text-secondary font-semibold">ناموجود</span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm font-medium">تعداد:</label>
              <div className="flex items-center border-[0.25px] border-border/30 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="text-sm">-</span>
                </Button>
                <span className="w-8 sm:w-10 text-center text-xs sm:text-sm">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="text-sm">+</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <Button
                size="default"
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                <span>افزودن به سبد</span>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5 border-t-[0.25px] border-border/30">
            <div className="flex items-start gap-2">
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-[10px] sm:text-xs leading-relaxed">ارسال رایگان بالای 500 هزار تومان</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-[10px] sm:text-xs leading-relaxed">گارانتی اصالت کالا</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto">
          <TabsTrigger value="description" className="text-[10px] sm:text-xs py-1.5 sm:py-2">توضیحات</TabsTrigger>
          <TabsTrigger value="specifications" className="text-[10px] sm:text-xs py-1.5 sm:py-2">مشخصات</TabsTrigger>
          <TabsTrigger value="reviews" className="text-[10px] sm:text-xs py-1.5 sm:py-2">
            نظرات {product.reviews ? `(${product.reviews})` : ""}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4 sm:mt-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.description || "توضیحات محصول در دسترس نیست"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4 sm:mt-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b-[0.25px] border-border/30 gap-1 sm:gap-0">
                    <dt className="font-medium text-xs sm:text-sm">{key}:</dt>
                    <dd className="text-xs sm:text-sm text-muted-foreground">
                      {typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' 
                        ? String(value) 
                        : JSON.stringify(value)}
                    </dd>
                  </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">مشخصات محصول در دسترس نیست</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4 sm:mt-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground">
                نظرات کاربران {product.reviews ? `(${product.reviews})` : ""} به زودی...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

