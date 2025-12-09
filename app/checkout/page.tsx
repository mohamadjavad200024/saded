"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Loader2, ArrowRight, AlertCircle, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { checkoutFormSchema, sanitizeCheckoutInput, type CheckoutFormData } from "@/lib/validations/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, getTotal, shippingMethod, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { getProduct } = useProductStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange", // اعتبارسنجی هنگام تغییر
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      province: "",
      notes: "",
    },
  });

  // بارگذاری اطلاعات checkout از localStorage یا auth store
  useEffect(() => {
    if (isAuthenticated && user) {
      // اگر کاربر لاگین است، از اطلاعات کاربر استفاده کن
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      reset({
        firstName,
        lastName,
        phone: user.phone || "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        province: "",
        notes: "",
      });
    } else {
      // اگر لاگین نیست، از localStorage استفاده کن
      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        try {
          const data = JSON.parse(checkoutData);
          if (data.formData) {
            reset({
              firstName: data.formData.firstName || "",
              lastName: data.formData.lastName || "",
              phone: data.formData.phone || "",
              email: data.formData.email || "",
              address: data.formData.address || "",
              city: data.formData.city || "",
              postalCode: data.formData.postalCode || "",
              province: data.formData.province || "",
              notes: data.formData.notes || "",
            });
          }
        } catch (error) {
          console.error("Error loading checkout data:", error);
        }
      }
    }
  }, [reset, isAuthenticated, user]);

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

  // Sanitize phone input (only numbers)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setValue("phone", value);
    }
  };

  // Sanitize postal code input (only numbers)
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setValue("postalCode", value);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      console.log("onSubmit called with data:", data);
      setSubmitAttempted(true);
      setIsSubmitting(true);

      // Sanitize data
      const sanitizedData = sanitizeCheckoutInput(data);
      console.log("Sanitized data:", sanitizedData);
      console.log("Items count:", items.length);
      console.log("Items:", items);

      // بررسی اینکه سبد خرید خالی نباشد
      if (items.length === 0) {
        console.error("Cart is empty!");
        toast({
          title: "خطا",
          description: "سبد خرید شما خالی است",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // بررسی اینکه مبلغ نهایی معتبر باشد
      console.log("Final total:", finalTotal);
      if (finalTotal <= 0 || !isFinite(finalTotal)) {
        console.error("Invalid final total:", finalTotal);
        toast({
          title: "خطا",
          description: "مبلغ سفارش نامعتبر است",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // بررسی و اعتبارسنجی items قبل از ارسال
      console.log("Validating items...");
      let validatedItems;
      try {
        validatedItems = items.map((item) => {
          console.log("Validating item:", item);
          // بررسی فیلدهای ضروری
          if (!item || typeof item !== "object") {
            console.error("Invalid item object:", item);
            throw new Error("آیتم سفارش نامعتبر است");
          }

          if (!item.id || String(item.id).trim() === "") {
            console.error("Item missing id:", item);
            throw new Error("شناسه محصول مشخص نشده است");
          }

          if (!item.name || String(item.name).trim() === "") {
            console.error("Item missing name:", item);
            throw new Error(`نام محصول برای شناسه "${item.id}" مشخص نشده است`);
          }

          if (item.price === undefined || item.price === null || isNaN(Number(item.price))) {
            console.error("Item missing or invalid price:", item);
            throw new Error(`قیمت محصول "${item.name || item.id}" مشخص نشده است`);
          }

          if (item.quantity === undefined || item.quantity === null || isNaN(Number(item.quantity))) {
            console.error("Item missing or invalid quantity:", item);
            throw new Error(`تعداد محصول "${item.name || item.id}" مشخص نشده است`);
          }

          // اگر image خالی بود، از product store بگیر
          let imageUrl = item.image ? String(item.image).trim() : "";
          if (!imageUrl) {
            const product = getProduct(item.id);
            if (product && product.images && product.images.length > 0) {
              imageUrl = product.images[0];
            }
          }

          const validatedItem = {
            id: String(item.id).trim(),
            name: String(item.name).trim(),
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: imageUrl || "",
          };
          console.log("Validated item:", validatedItem);
          return validatedItem;
        });
        console.log("All items validated:", validatedItems);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        toast({
          title: "خطا",
          description: validationError instanceof Error ? validationError.message : "خطا در اعتبارسنجی محصولات",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // ابتدا سفارش را ثبت می‌کنیم (بدون پرداخت)
      console.log("Sending order creation request...");
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: validatedItems,
          formData: sanitizedData,
          total: finalTotal,
          shippingCost: shipping,
          shippingMethod,
        }),
      });

      console.log("Order response status:", orderResponse.status);
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        console.error("Order creation failed:", errorData);
        throw new Error(errorData.error || `HTTP error! status: ${orderResponse.status}`);
      }

      const orderResult = await orderResponse.json();
      console.log("Order created successfully:", orderResult);

      // بررسی ساختار response: {success: true, data: {order: ...}}
      const order = orderResult.data?.order || orderResult.order;
      
      if (!orderResult.success || !order) {
        const errorMessage = orderResult.error || "خطا در ثبت سفارش";
        const isDbError = errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('دیتابیس');
        
        toast({
          title: "خطا",
          description: isDbError 
            ? "خطا در اتصال به دیتابیس. لطفاً بعداً تلاش کنید."
            : errorMessage,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // ============================================
      // پرداخت Mock برای توسعه و تست
      // در این حالت، پرداخت همیشه موفق می‌شود
      // ============================================
      console.log("[Mock Payment] Updating payment status to paid for order:", order.id);
      
      // به‌روزرسانی وضعیت پرداخت سفارش به "paid"
      const updatePaymentResponse = await fetch(`/api/orders/${order.id}/payment-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: "paid",
        }),
      });

      if (!updatePaymentResponse.ok) {
        const errorData = await updatePaymentResponse.json().catch(() => ({}));
        console.error("[Mock Payment] Failed to update payment status:", errorData);
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت پرداخت");
      }

      const paymentUpdateResult = await updatePaymentResponse.json();
      console.log("[Mock Payment] Payment status updated successfully:", paymentUpdateResult);

      // استفاده از سفارش به‌روزرسانی شده از API
      const updatedOrder = paymentUpdateResult.success && paymentUpdateResult.data 
        ? paymentUpdateResult.data 
        : { ...order, paymentStatus: "paid" as const };

      // ذخیره سفارش در store با وضعیت paid
      console.log("[Mock Payment] Adding order to store:", updatedOrder);
      addOrder(updatedOrder);

      // پاک کردن سبد خرید
      console.log("[Mock Payment] Clearing cart...");
      clearCart();

      // حذف اطلاعات checkout از localStorage
      console.log("[Mock Payment] Clearing localStorage...");
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("pendingOrder");
      // Clear dismissed order status bar so new order shows in status bar
      localStorage.removeItem("dismissedOrderStatusBar");

      // نمایش پیام موفقیت
      console.log("[Mock Payment] Showing success toast...");
      toast({
        title: "پرداخت موفق",
        description: "سفارش شما با موفقیت ثبت و پرداخت شد",
      });

      // هدایت به صفحه پیگیری سفارش
      const orderNumber = updatedOrder.orderNumber || order.orderNumber;
      console.log("[Mock Payment] Redirecting to track page with orderNumber:", orderNumber);
      
      // استفاده از router.push برای هدایت بهتر (به جای window.location.href)
      setTimeout(() => {
        router.push(`/order/track?orderNumber=${orderNumber}`);
      }, 1000); // افزایش تاخیر برای نمایش بهتر پیام موفقیت
    } catch (error) {
      console.error("[Checkout] Order creation error:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      });
      
      const errorMessage = error instanceof Error ? error.message : "خطایی در پردازش درخواست رخ داد";
      const isDbError = errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('دیتابیس');
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch');
      
      toast({
        title: "خطا",
        description: isDbError
          ? "خطا در اتصال به دیتابیس. لطفاً بعداً تلاش کنید."
          : isNetworkError
          ? "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید."
          : errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">
            سبد خرید شما خالی است
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center">
            محصولات مورد نظر خود را به سبد خرید اضافه کنید
          </p>
          <Link href="/products">
            <Button size="lg" className="h-11 sm:h-12">
              مشاهده محصولات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        تکمیل اطلاعات و پرداخت
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* فرم اطلاعات */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تحویل</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("[Form] Submit event triggered");
                  handleSubmit(
                    (data) => {
                      console.log("[Form] Validation passed, data:", data);
                      onSubmit(data);
                    },
                    (errors) => {
                      console.error("[Form] Validation errors:", errors);
                      setSubmitAttempted(true);
                      // نمایش پیام خطا برای کاربر
                      const firstError = Object.values(errors)[0];
                      if (firstError) {
                        toast({
                          title: "خطا در اعتبارسنجی",
                          description: firstError.message || "لطفاً تمام فیلدهای الزامی را پر کنید",
                          variant: "destructive",
                        });
                      }
                    }
                  )(e);
                }} 
                className="space-y-4 sm:space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      نام <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="نام"
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      نام خانوادگی <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="نام خانوادگی"
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      شماره تماس <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      type="tel"
                      onChange={handlePhoneChange}
                      placeholder="09123456789"
                      maxLength={11}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      ایمیل <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="example@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    آدرس کامل <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="آدرس کامل تحویل"
                    rows={3}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      شهر <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="شهر"
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      onChange={handlePostalCodeChange}
                      placeholder="1234567890"
                      maxLength={10}
                      className={errors.postalCode ? "border-destructive" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">استان (اختیاری)</Label>
                  <Input
                    id="province"
                    {...register("province")}
                    placeholder="استان"
                    className={errors.province ? "border-destructive" : ""}
                  />
                  {errors.province && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.province.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">یادداشت (اختیاری)</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="یادداشت یا توضیحات اضافی"
                    rows={3}
                    className={errors.notes ? "border-destructive" : ""}
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                {/* نمایش خطاهای کلی فرم */}
                {submitAttempted && Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium mb-2">
                      لطفاً خطاهای زیر را برطرف کنید:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          {error?.message || `${field} نامعتبر است`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال اتصال به درگاه...
                    </>
                  ) : (
                    <>
                      ادامه به درگاه پرداخت
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 sm:top-24">
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-border/30 last:border-0">
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && item.image.trim() !== "" ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>تعداد: {item.quantity}</span>
                        <span className="font-semibold text-foreground">
                          {(item.price * item.quantity).toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-border/30">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>جمع کل:</span>
                  <span className="font-semibold">
                    {total.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
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
                {shippingMethod && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>روش ارسال:</span>
                    <span>{shippingMethod === "air" ? "هوایی" : "دریایی"}</span>
                  </div>
                )}
                <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-border/30">
                  <span>مبلغ نهایی:</span>
                  <span className="text-primary">
                    {finalTotal.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}


