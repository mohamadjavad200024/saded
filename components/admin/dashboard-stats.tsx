"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Box, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAdminStore } from "@/store/admin-store";
import { useProductStore } from "@/store/product-store";
import { useOrderStore } from "@/store/order-store";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function DashboardStats() {
  const { stats, refreshStats, isLoading } = useAdminStore();
  const products = useProductStore((state) => state.products);
  const orders = useOrderStore((state) => state.orders);
  const users = useUserStore((state) => state.users);

  useEffect(() => {
    refreshStats();
  }, [products, refreshStats]);

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate additional stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.paymentStatus === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.total + o.shippingCost), 0);
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  // Ensure all stats values are defined
  const safeStats = {
    totalProducts: stats.totalProducts ?? 0,
    activeProducts: stats.activeProducts ?? 0,
    totalStock: stats.totalStock ?? 0,
    lowStockProducts: stats.lowStockProducts ?? 0,
    averagePrice: stats.averagePrice ?? 0,
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalUsers,
    activeUsers,
  };

  const statCards = [
    {
      title: "کل محصولات",
      value: safeStats.totalProducts,
      icon: Package,
      description: `${safeStats.activeProducts} فعال`,
      trend: null,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "کل سفارشات",
      value: safeStats.totalOrders,
      icon: ShoppingCart,
      description: `${safeStats.pendingOrders} در انتظار`,
      trend: safeStats.pendingOrders > 0 ? "warning" : null,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "درآمد کل",
      value: new Intl.NumberFormat("fa-IR").format(safeStats.totalRevenue / 1000) + "K",
      icon: DollarSign,
      description: "تومان",
      trend: null,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "کل کاربران",
      value: safeStats.totalUsers,
      icon: Users,
      description: `${safeStats.activeUsers} فعال`,
      trend: null,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "موجودی کل",
      value: safeStats.totalStock.toLocaleString("fa-IR"),
      icon: Box,
      description: "عدد",
      trend: null,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "محصولات کم‌موجود",
      value: safeStats.lowStockProducts,
      icon: AlertTriangle,
      description: "نیاز به بررسی",
      trend: safeStats.lowStockProducts > 0 ? "warning" : "success",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.trend && (
                  <Badge
                    variant={stat.trend === "warning" ? "warning" : "success"}
                    className="text-xs"
                  >
                    {stat.trend === "warning" ? (
                      <>
                        <Clock className="h-3 w-3 ml-1" />
                        نیاز به اقدام
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 ml-1" />
                        خوب
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


