"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { Search, Package, MapPin, Phone, Mail, Calendar, Truck, CheckCircle2, Clock, XCircle, ShoppingCart, Box, CheckCircle, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuickBuyChat } from "@/components/chat/quick-buy-chat";

const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  processing: {
    label: "در حال پردازش",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
  },
  shipped: {
    label: "ارسال شده",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const paymentStatusConfig = {
  pending: {
    label: "در انتظار پرداخت",
    color: "bg-yellow-100 text-yellow-800",
  },
  paid: {
    label: "پرداخت شده",
    color: "bg-green-100 text-green-800",
  },
  failed: {
    label: "پرداخت ناموفق",
    color: "bg-red-100 text-red-800",
  },
  refunded: {
    label: "بازگشت وجه",
    color: "bg-gray-100 text-gray-800",
  },
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // برای تشخیص اینکه آیا جستجویی انجام شده یا نه
  const [chatOpen, setChatOpen] = useState(false);
  const { orders, updateOrder } = useOrderStore();
  const { getProduct, loadProductsFromDB } = useProductStore();

  const handleSearch = () => {
    setNotFound(false);
    setOrder(null);
    setHasSearched(true); // نشان می‌دهد که جستجو انجام شده

    if (!orderNumber.trim()) {
      setHasSearched(false); // اگر شماره سفارش خالی باشد، جستجو محسوب نمی‌شود
      return;
    }

    fetchOrder(orderNumber);
  };

  // دریافت سفارش از API
  const fetchOrder = async (orderNum: string) => {
    try {
      // ابتدا از store جستجو کن
      const foundOrder = orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === orderNum.toLowerCase().trim() ||
          o.id === orderNum.trim()
      );
      
      if (foundOrder) {
        setOrder(foundOrder);
        setNotFound(false);
        return;
      }

      // اگر در store پیدا نشد، از API جستجو کن
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNum)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const apiOrder = result.data[0];
          setOrder(apiOrder);
          setNotFound(false);
          updateOrder(apiOrder.id, apiOrder);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setNotFound(true);
    }
  };

  // بارگذاری محصولات برای نمایش تصاویر
  useEffect(() => {
    loadProductsFromDB(true).catch((error) => {
      console.error("Error loading products for order tracking:", error);
    });
  }, [loadProductsFromDB]);

  // اگر orderNumber در URL وجود داشت، جستجو را انجام بده
  useEffect(() => {
    if (initialOrderNumber && initialOrderNumber.trim()) {
      setHasSearched(true);
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  // Polling برای به‌روزرسانی وضعیت سفارش (هر 10 ثانیه)
  useEffect(() => {
    if (!order?.id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setOrder(result.data);
            updateOrder(result.data.id, result.data);
          }
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 10000); // هر 10 ثانیه

    return () => clearInterval(interval);
  }, [order?.id, updateOrder]);

  const StatusIcon = order ? statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock : Clock;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            پیگیری سفارش
          </h1>
          <Button
            onClick={() => setChatOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">چت با ادمین</span>
            <span className="sm:hidden">چت</span>
          </Button>
        </div>

        {/* جستجوی سفارش */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>جستجوی سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="orderNumber">شماره سفارش</Label>
                <Input
                  id="orderNumber"
                  placeholder="مثال: ORD-1234567890-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} size="lg">
                  <Search className="ml-2 h-4 w-4" />
                  جستجو
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* پیام سفارش پیدا نشد - فقط زمانی که جستجو انجام شده باشد */}
        {notFound && hasSearched && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">سفارش یافت نشد</h2>
                <p className="text-muted-foreground text-center mb-6">
                  شماره سفارش وارد شده معتبر نیست. لطفاً شماره سفارش را بررسی کنید.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* نمایش اطلاعات سفارش */}
        {order && (
          <div className="space-y-6">
            {/* نوار پیشرفت سفارش */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  پیگیری سفارش
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* مراحل سفارش */}
                <div className="relative">
                  {/* خط پیشرفت */}
                  <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-border">
                    <div
                      className="absolute top-0 right-0 w-full bg-primary transition-all duration-500 ease-in-out"
                      style={{
                        height: `${(() => {
                          const statusOrder = ["pending", "processing", "shipped", "delivered"];
                          const currentIndex = statusOrder.indexOf(order.status);
                          if (currentIndex === -1) return 0;
                          return ((currentIndex + 1) / statusOrder.length) * 100;
                        })()}%`,
                      }}
                    />
                  </div>

                  {/* مراحل */}
                  <div className="space-y-8 relative z-10">
                    {[
                      { status: "pending", label: "در انتظار", icon: ShoppingCart, description: "سفارش شما ثبت شد" },
                      { status: "processing", label: "در حال پردازش", icon: Box, description: "در حال آماده‌سازی" },
                      { status: "shipped", label: "ارسال شده", icon: Truck, description: "در مسیر تحویل" },
                      { status: "delivered", label: "تحویل شده", icon: CheckCircle2, description: "تحویل با موفقیت انجام شد" },
                    ].map((stage, index) => {
                      const statusOrder = ["pending", "processing", "shipped", "delivered"];
                      const currentIndex = statusOrder.indexOf(order.status);
                      const stageIndex = statusOrder.indexOf(stage.status);
                      const isCompleted = currentIndex >= stageIndex && order.status !== "cancelled";
                      const isCurrent = currentIndex === stageIndex && order.status !== "cancelled";
                      const Icon = stage.icon;

                      return (
                        <div key={stage.status} className="flex items-start gap-4">
                          <div className="relative z-10">
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCompleted
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                                  : isCurrent
                                  ? "bg-primary/20 text-primary border-2 border-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-8 w-8" />
                              ) : (
                                <Icon className="h-8 w-8" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={`font-semibold text-lg ${
                                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {stage.label}
                              </h3>
                              {isCurrent && (
                                <Badge variant="default" className="animate-pulse">
                                  در حال انجام
                                </Badge>
                              )}
                              {isCompleted && !isCurrent && (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  تکمیل شد
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                            {isCurrent && order.updatedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                آخرین به‌روزرسانی:{" "}
                                {new Date(order.updatedAt).toLocaleDateString("fa-IR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* نوار پیشرفت */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">پیشرفت کلی</span>
                    <span className="text-sm text-muted-foreground">
                      {(() => {
                        const statusOrder = ["pending", "processing", "shipped", "delivered"];
                        const currentIndex = statusOrder.indexOf(order.status);
                        if (currentIndex === -1) return "0%";
                        return `${Math.round(((currentIndex + 1) / statusOrder.length) * 100)}%`;
                      })()}
                    </span>
                  </div>
                  <Progress
                    value={(() => {
                      const statusOrder = ["pending", "processing", "shipped", "delivered"];
                      const currentIndex = statusOrder.indexOf(order.status);
                      if (currentIndex === -1) return 0;
                      return ((currentIndex + 1) / statusOrder.length) * 100;
                    })()}
                    className="h-3"
                  />
                </div>

                {/* اطلاعات اضافی */}
                <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">شماره سفارش</p>
                      <p className="font-semibold font-mono">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تاریخ ثبت</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* محصولات سفارش */}
            <Card>
              <CardHeader>
                <CardTitle>محصولات سفارش</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(order.items) ? order.items.map((item: any) => {
                    // Get image from item first, then from product store
                    const product = getProduct(item.productId || item.id);
                    let imageUrl = item.image && item.image.trim() !== "" ? item.image : "";
                    if (!imageUrl && product && product.images && product.images.length > 0) {
                      imageUrl = product.images[0];
                    }
                    const hasImage = imageUrl && imageUrl.trim() !== "";
                    
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-4 border-b last:border-0"
                      >
                        {hasImage ? (
                          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 border">
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized={imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')}
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 border">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.name}</h3>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>تعداد: {item.quantity}</span>
                            <span className="font-semibold text-foreground">
                              {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>محصولات سفارش در دسترس نیست</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* اطلاعات مشتری و ارسال */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات مشتری</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نام</p>
                      <p className="font-semibold">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">شماره تماس</p>
                      <p className="font-semibold">{order.customerPhone}</p>
                    </div>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ایمیل</p>
                        <p className="font-semibold">{order.customerEmail}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>آدرس ارسال</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">آدرس</p>
                      <p className="font-semibold">
                        {order.shippingAddress.city}، {order.shippingAddress.address}
                      </p>
                      {order.shippingAddress.postalCode && (
                        <p className="text-sm text-muted-foreground mt-1">
                          کد پستی: {order.shippingAddress.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">روش ارسال</p>
                      <p className="font-semibold">
                        {order.shippingMethod === "air" ? "هوایی" : "دریایی"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* خلاصه سفارش */}
            <Card>
              <CardHeader>
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>جمع کل:</span>
                    <span className="font-semibold">
                      {order.total.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <span className="font-semibold">
                      {order.shippingCost === 0 ? (
                        <span className="text-green-600">رایگان</span>
                      ) : (
                        `${order.shippingCost.toLocaleString("fa-IR")} تومان`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-bold">مبلغ نهایی:</span>
                    <span className="font-bold text-lg text-primary">
                      {(order.total + order.shippingCost).toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span>وضعیت پرداخت:</span>
                    <Badge className={paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.color}>
                      {paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* چت با ادمین */}
      <QuickBuyChat 
        isOpen={chatOpen} 
        onOpenChange={setChatOpen}
      />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">در حال بارگذاری...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

