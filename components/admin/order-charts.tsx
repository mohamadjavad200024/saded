"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { TrendingUp, DollarSign, Package, Clock } from "lucide-react";

interface OrderChartsProps {
  orders: Order[];
}

export function OrderCharts({ orders }: OrderChartsProps) {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        statusCounts: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
        total: 0,
        totalRevenue: 0,
        last7Days: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
          const day = date.getDate();
          const month = monthNames[date.getMonth()] || "";
          return {
            date: `${day} ${month}`,
            revenue: 0,
          };
        }),
        maxRevenue: 1,
      };
    }

    const statusCounts = {
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    const total = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + (o.total || 0) + (o.shippingCost || 0), 0);

    // Last 7 days revenue
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      const dayOrders = orders.filter((o) => {
        if (o.paymentStatus !== "paid") return false;
        try {
          const orderDate = new Date(o.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        } catch {
          return false;
        }
      });
      const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
      const day = date.getDate();
      const month = monthNames[date.getMonth()] || "";
      return {
        date: `${day} ${month}`,
        revenue: dayOrders.reduce((sum, o) => sum + o.total + o.shippingCost, 0),
      };
    });

    const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

    return {
      statusCounts,
      total,
      totalRevenue,
      last7Days,
      maxRevenue,
    };
  }, [orders]);

  const statusColors = {
    pending: "#f59e0b",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const statusLabels = {
    pending: "در انتظار",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Status Distribution Chart */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            توزیع وضعیت سفارشات
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Object.entries(chartData.statusCounts).map(([status, count]) => {
              const percentage =
                chartData.total > 0 ? (count / chartData.total) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                      />
                      <span className="font-medium">
                        {statusLabels[status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{count}</span>
                      <span className="text-muted-foreground">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: statusColors[status as keyof typeof statusColors],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            درآمد 7 روز اخیر
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-48">
              {chartData.last7Days.map((day, index) => {
                const height = chartData.maxRevenue > 0 
                  ? (day.revenue / chartData.maxRevenue) * 100 
                  : 0;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full flex items-end justify-center h-full">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-300 hover:from-primary/90 hover:to-primary/70 group-hover:opacity-80"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border/30 rounded px-2 py-1 text-xs font-medium whitespace-nowrap shadow-sm">
                          {new Intl.NumberFormat("fa-IR").format(day.revenue)} تومان
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">میانگین روزانه:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat("fa-IR").format(
                    Math.round(chartData.last7Days.reduce((sum, d) => sum + d.revenue, 0) / 7)
                  )}{" "}
                  تومان
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Stats */}
      <Card className="shadow-sm md:col-span-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            آمار درآمد
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="text-2xl font-bold mb-1">
                {new Intl.NumberFormat("fa-IR").format(chartData.totalRevenue)} تومان
              </div>
              <div className="text-sm text-muted-foreground">درآمد کل</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <div className="text-2xl font-bold mb-1">
                {new Intl.NumberFormat("fa-IR").format(
                  orders.filter((o) => o.paymentStatus === "paid").length
                )}
              </div>
              <div className="text-sm text-muted-foreground">سفارشات پرداخت شده</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="text-2xl font-bold mb-1">
                {(() => {
                  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
                  if (paidOrders.length === 0) return "0";
                  return new Intl.NumberFormat("fa-IR").format(
                    Math.round(chartData.totalRevenue / paidOrders.length)
                  );
                })()}{" "}
                تومان
              </div>
              <div className="text-sm text-muted-foreground">میانگین هر سفارش</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

