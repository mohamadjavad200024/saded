"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, Plane, Ship } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function CartContent() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    clearCart, 
    shippingMethod: storeShippingMethod, 
    setShippingMethod,
    initializeSession,
    loadFromDatabase,
  } = useCartStore();
  const { getProduct, loadProductsFromDB } = useProductStore();
  const { toast } = useToast();
  const [localShippingMethod, setLocalShippingMethod] = useState<"air" | "sea" | null>(storeShippingMethod);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and load cart from database on mount
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        initializeSession();
        // Load products first to ensure images are available
        await loadProductsFromDB();
        // Then load cart from database
        await loadFromDatabase();
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initCart();
  }, [initializeSession, loadFromDatabase, loadProductsFromDB]);

  // Helper function to get image for cart item
  const getItemImage = (item: { id: string; image?: string }) => {
    // First, try to get from item itself (if it exists and is not empty)
    if (item.image && item.image.trim() !== "") {
      // If it's a base64 image and too large, try to get from product
      if (item.image.startsWith("data:image") && item.image.length > 50000) {
        // Too large base64, will fetch from product
      } else {
        // Valid image (URL or small base64) - use it
        return item.image;
      }
    }
    
    // If image is empty or too large base64, try to get from product store
    const product = getProduct(item.id);
    if (product && product.images && product.images.length > 0) {
      console.log("Using product image for cart item:", {
        itemId: item.id,
        productImage: product.images[0]?.substring(0, 50),
      });
      return product.images[0];
    }
    
    // Log if no image found
    if (process.env.NODE_ENV === "development") {
      console.warn("No image found for cart item:", {
        itemId: item.id,
        hasItemImage: !!item.image,
        hasProduct: !!product,
        productImages: product?.images?.length || 0,
      });
    }
    
    // Return null if nothing found (will show placeholder)
    return null;
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    try {
      updateQuantity(id, quantity);
    } catch (error: any) {
      if (error?.name === "QuotaExceededError" || error?.message?.includes("quota")) {
        toast({
          title: "خطا در ذخیره",
          description: "فضای ذخیره‌سازی پر شده است. لطفاً برخی از محصولات را از سبد خرید حذف کنید.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا",
          description: "خطایی در به‌روزرسانی تعداد محصول رخ داد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Sync local state with store when store changes
  useEffect(() => {
    if (storeShippingMethod) {
      setLocalShippingMethod(storeShippingMethod);
    }
  }, [storeShippingMethod]);
  
  // Use store shipping method if available, otherwise use local state
  const shippingMethod = storeShippingMethod || localShippingMethod;
  
  const handleShippingMethodChange = (method: "air" | "sea") => {
    setLocalShippingMethod(method);
    setShippingMethod(method);
  };

  // Check which shipping methods are available for all products in cart
  const availableShippingMethods = items.reduce((acc, item) => {
    const product = getProduct(item.id);
    if (product) {
      if (product.airShippingEnabled) acc.air = (acc.air ?? true) && true;
      else acc.air = false;
      if (product.seaShippingEnabled) acc.sea = (acc.sea ?? true) && true;
      else acc.sea = false;
    } else {
      // If product not found, assume both methods are available (fallback)
      acc.air = acc.air ?? true;
      acc.sea = acc.sea ?? true;
    }
    return acc;
  }, { air: undefined, sea: undefined } as { air?: boolean; sea?: boolean });

  const airAvailable = availableShippingMethods.air === true;
  const seaAvailable = availableShippingMethods.sea === true;

  // If current shipping method is not available, reset it
  // This useEffect must be before any conditional returns to maintain hook order
  useEffect(() => {
    if (items.length === 0) return; // Skip if cart is empty
    
    if (shippingMethod) {
      if (shippingMethod === "air" && !airAvailable) {
        if (seaAvailable) {
          setLocalShippingMethod("sea");
          setShippingMethod("sea");
        } else {
          setLocalShippingMethod(null);
          setShippingMethod(null);
        }
      } else if (shippingMethod === "sea" && !seaAvailable) {
        if (airAvailable) {
          setLocalShippingMethod("air");
          setShippingMethod("air");
        } else {
          setLocalShippingMethod(null);
          setShippingMethod(null);
        }
      }
    } else if (airAvailable || seaAvailable) {
      // Auto-select first available method if none selected
      if (airAvailable) {
        setLocalShippingMethod("air");
        setShippingMethod("air");
      } else if (seaAvailable) {
        setLocalShippingMethod("sea");
        setShippingMethod("sea");
      }
    }
  }, [airAvailable, seaAvailable, shippingMethod, setShippingMethod, items.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">در حال بارگذاری سبد خرید...</h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
        <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">سبد خرید شما خالی است</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center">
          محصولات مورد نظر خود را به سبد خرید اضافه کنید
        </p>
        <Link href="/products">
          <Button size="lg" className="h-11 sm:h-12">مشاهده محصولات</Button>
        </Link>
      </div>
    );
  }

  const total = getTotal();
  
  // Calculate shipping cost based on products and selected shipping method
  const calculateShippingCost = () => {
    if (!shippingMethod || items.length === 0) return 0;
    
    // Get the maximum shipping cost from all products (if multiple products, use the highest)
    let maxShippingCost = 0;
    
    for (const item of items) {
      const product = getProduct(item.id);
      if (product) {
        const productShippingCost = shippingMethod === "air" 
          ? (product.airShippingCost ?? null)
          : (product.seaShippingCost ?? null);
        
        if (productShippingCost !== null && productShippingCost > maxShippingCost) {
          maxShippingCost = productShippingCost;
        }
      }
    }
    
    // If no shipping cost is set for products, use default logic (free over 500k)
    if (maxShippingCost === 0) {
      return total > 500000 ? 0 : 50000;
    }
    
    return maxShippingCost;
  };
  
  const shipping = calculateShippingCost();
  const finalTotal = total + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 sm:p-4 md:p-6 ${
              index < items.length - 1
                ? "border-b-[0.25px] border-border/30"
                : ""
            }`}
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {getItemImage(item) ? (
                <Image
                    src={getItemImage(item)!}
                  alt={`${item.name} - سبد خرید`}
                  fill
                  className="object-cover"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".image-placeholder")) {
                        const placeholder = document.createElement("div");
                        placeholder.className = "image-placeholder w-full h-full flex items-center justify-center text-muted-foreground";
                        placeholder.innerHTML = '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">{item.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center border-[0.25px] border-border/30 rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-10 sm:w-12 text-center text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-base sm:text-lg font-bold">
                    {(item.price * item.quantity).toLocaleString("fa-IR")}{" "}
                    تومان
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20 sm:top-24">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">خلاصه سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="flex justify-between text-sm sm:text-base">
              <span>جمع کل:</span>
              <span className="font-semibold">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            {(airAvailable || seaAvailable) && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-sm sm:text-base font-medium">روش ارسال:</div>
                <div className={`grid gap-2 sm:gap-3 ${(airAvailable && seaAvailable) ? "grid-cols-2" : "grid-cols-1"}`}>
                  {airAvailable && (
                    <button
                      onClick={() => handleShippingMethodChange("air")}
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
                        هوایی
                      </span>
                    </button>
                  )}
                  {seaAvailable && (
                    <button
                      onClick={() => handleShippingMethodChange("sea")}
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
                        دریایی
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
            {!airAvailable && !seaAvailable && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-sm sm:text-base font-medium">روش ارسال:</div>
                <div className="p-3 sm:p-4 rounded-lg border-[0.25px] border-border/30 bg-muted/30">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    روش ارسال برای محصولات موجود در سبد خرید توسط مدیر در زمان ارسال مشخص خواهد شد
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base">
              <span>هزینه ارسال:</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-green-600">رایگان</span>
                ) : (
                  `${shipping.toLocaleString("fa-IR")} تومان`
                )}
              </span>
            </div>
            {shipping > 0 && shipping === 50000 && total < 500000 && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                برای ارسال رایگان، {(
                  500000 - total
                ).toLocaleString("fa-IR")} تومان دیگر به سبد خرید خود اضافه
                کنید
              </p>
            )}
            <div className="border-t-[0.25px] border-border/30 pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-bold">
              <span>مبلغ نهایی:</span>
              <span>{finalTotal.toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="flex gap-2 sm:gap-3 min-w-0">
              <Link href="/checkout" className="flex-1 min-w-0">
                <Button className="w-full h-11 sm:h-12 text-xs sm:text-sm" size="lg">
                  ادامه خرید
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-11 sm:h-12 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                size="lg"
                onClick={() => {
                  // TODO: Implement send invoice functionality
                  // This feature will be implemented in a future update
                }}
              >
                ارسال فاکتور خرید
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              onClick={clearCart}
            >
              پاک کردن سبد خرید
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
