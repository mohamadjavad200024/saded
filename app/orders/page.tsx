"use client";

import { useMemo, useEffect } from "react";
import { useOrderStore } from "@/store/order-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthStore } from "@/store/auth-store";

function MyOrdersPageContent() {
  const { orders } = useOrderStore();
  const router = useRouter();
  const { toast } = useToast();

  // دسته‌بندی سفارش‌ها
  const ordersByStatus = useMemo(() => {
    const pending = orders.filter((o) => o.paymentStatus === "pending");
    const paid = orders.filter((o) => o.paymentStatus === "paid");
    const failed = orders.filter((o) => o.paymentStatus === "failed");
    
    return { pending, paid, failed };
  }, [orders]);

  const handleContinuePayment = async (order: any) => {
    try {
      // دریافت اطلاعات سفارش از localStorage یا ساخت مجدد
      const checkoutData = localStorage.getItem("checkoutData");
      const pendingOrder = localStorage.getItem("pendingOrder");

      if (!checkoutData && !pendingOrder) {
        toast({
          title: "خطا",
          description: "اطلاعات سفارش یافت نشد. لطفاً سفارش جدیدی ثبت کنید.",
          variant: "destructive",
        });
        return;
      }

      // اگر pendingOrder وجود دارد، از آن استفاده کن
      if (pendingOrder) {
        const orderData = JSON.parse(pendingOrder);
        const amount = orderData.total;

        // ایجاد درخواست پرداخت جدید
        const response = await fetch("/api/payment/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            description: `سفارش ${order.items.length} محصول - ${order.orderNumber}`,
            callbackUrl: `${window.location.origin}/payment/verify`,
            mobile: order.customerPhone,
            email: order.customerEmail,
          }),
        });

        const result = await response.json();

        if (result.success && result.paymentUrl) {
          // به‌روزرسانی pendingOrder با authority جدید
          const updatedPendingOrder = {
            ...orderData,
            authority: result.authority,
          };
          localStorage.setItem("pendingOrder", JSON.stringify(updatedPendingOrder));

          // هدایت به درگاه پرداخت
          window.location.href = result.paymentUrl;
        } else {
          toast({
            title: "خطا",
            description: result.error || "خطا در اتصال به درگاه پرداخت",
            variant: "destructive",
          });
        }
      } else {
        // اگر pendingOrder وجود ندارد، به checkout برگرد
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Continue payment error:", error);
      toast({
        title: "خطا",
        description: "خطایی در پردازش درخواست رخ داد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">سفارش‌های من</h1>
            <p className="text-muted-foreground mt-1">
              مدیریت و پیگیری سفارش‌های خود
            </p>
          </div>
        </div>

        {/* سفارش‌های در انتظار پرداخت */}
        {ordersByStatus.pending.length > 0 && (
          <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-950/20">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                سفارش‌های در انتظار پرداخت ({ordersByStatus.pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {ordersByStatus.pending.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">شماره سفارش: {order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div>
                              <span className="text-sm text-muted-foreground">مبلغ کل:</span>
                              <span className="font-bold mr-2">
                                {(order.total + order.shippingCost).toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              در انتظار پرداخت
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleContinuePayment(order)}
                            className="flex-1 sm:flex-none"
                          >
                            <CreditCard className="ml-2 h-4 w-4" />
                            ادامه پرداخت
                          </Button>
                          <Link href={`/order/track?orderNumber=${order.orderNumber}`}>
                            <Button variant="outline">
                              <Package className="ml-2 h-4 w-4" />
                              جزئیات
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* سفارش‌های پرداخت شده */}
        {ordersByStatus.paid.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                سفارش‌های پرداخت شده ({ordersByStatus.paid.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {ordersByStatus.paid.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">شماره سفارش: {order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div>
                              <span className="text-sm text-muted-foreground">مبلغ کل:</span>
                              <span className="font-bold mr-2">
                                {(order.total + order.shippingCost).toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              پرداخت شده
                            </Badge>
                            <Badge variant="outline">
                              {order.status === "pending" && "در انتظار پردازش"}
                              {order.status === "processing" && "در حال پردازش"}
                              {order.status === "shipped" && "ارسال شده"}
                              {order.status === "delivered" && "تحویل داده شده"}
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/order/track?orderNumber=${order.orderNumber}`}>
                          <Button variant="outline">
                            <Package className="ml-2 h-4 w-4" />
                            پیگیری سفارش
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* سفارش‌های ناموفق */}
        {ordersByStatus.failed.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                سفارش‌های ناموفق ({ordersByStatus.failed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {ordersByStatus.failed.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">شماره سفارش: {order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                              </p>
                            </div>
                          </div>
                          <Badge variant="destructive" className="mt-2">
                            پرداخت ناموفق
                          </Badge>
                        </div>
                        <Button
                          onClick={() => handleContinuePayment(order)}
                          variant="outline"
                        >
                          <CreditCard className="ml-2 h-4 w-4" />
                          تلاش مجدد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* پیام خالی */}
        {orders.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">شما هنوز سفارشی ثبت نکرده‌اید</h2>
                <p className="text-muted-foreground text-center mb-6">
                  برای ثبت سفارش جدید، به صفحه محصولات بروید
                </p>
                <Link href="/products">
                  <Button size="lg">مشاهده محصولات</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <MyOrdersPageContent />
    </ProtectedRoute>
  );
}





