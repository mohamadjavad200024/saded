"use client";

import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { useProductStore } from "@/store/product-store";
import Link from "next/link";

interface SupplierCardProps {
  supplier: Supplier;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function SupplierCard({ supplier, onDelete, onToggle }: SupplierCardProps) {
  const { products } = useProductStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Check low stock
  const checkLowStock = (supplier: Supplier) => {
    const threshold = supplier.lowStockThreshold || 10;
    const supplierProducts = products.filter(
      (p) =>
        p.category && supplier.categories.includes(p.category) &&
        p.stockCount <= threshold
    );
    return supplierProducts.length;
  };

  const lowStockCount = checkLowStock(supplier);
  const transactions = supplier.transactions || [];
  const lastTransaction = transactions.length > 0 ? transactions[transactions.length - 1] : null;
  const totalTransactions = transactions.length;
  const totalSuppliedAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalSuppliedItems = transactions.reduce(
    (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const totalProducts = supplier.products?.length || 0;

  const formatDate = (date: Date | string) => {
    try {
      return format(new Date(date), "yyyy/MM/dd", { locale: faIR });
    } catch {
      return "-";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{supplier.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={supplier.isActive ? "success" : "secondary"} className="text-xs">
                    {supplier.isActive ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 ml-1" />
                        فعال
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 ml-1" />
                        غیرفعال
                      </>
                    )}
                  </Badge>
                  {lowStockCount > 0 && (
                    <Badge variant="warning" className="text-xs gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {lowStockCount} هشدار
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <a
                href={`tel:${supplier.phone}`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {supplier.phone}
              </a>
              {supplier.email && (
                <a
                  href={`mailto:${supplier.email}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {supplier.email}
                </a>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>عملیات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/suppliers/${supplier.id}`}>
                  <Edit className="ml-2 h-4 w-4" />
                  ویرایش
                </Link>
              </DropdownMenuItem>
              {lowStockCount > 0 && (
                <DropdownMenuItem asChild>
                  <a href={`tel:${supplier.phone}`}>
                    <Phone className="ml-2 h-4 w-4" />
                    تماس برای شارژ موجودی
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onToggle(supplier.id)}>
                {supplier.isActive ? "غیرفعال کردن" : "فعال کردن"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(supplier.id)}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">دسته‌بندی‌ها</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {supplier.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>محصولات</span>
            </div>
            <div className="text-lg font-semibold">{totalProducts}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>تراکنش‌ها</span>
            </div>
            <div className="text-lg font-semibold">{totalTransactions}</div>
          </div>
        </div>

        {/* Last Transaction Summary */}
        {lastTransaction && (
          <div className="pt-3 border-t border-border/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">آخرین تراکنش</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "بستن" : "جزئیات"}
              </Button>
            </div>

            <div className="space-y-2">
              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">روش پرداخت</span>
                <Badge
                  variant={lastTransaction.paymentMethod === "cash" ? "success" : "warning"}
                  className="text-xs"
                >
                  {lastTransaction.paymentMethod === "cash" ? "نقدی" : "چکی"}
                </Badge>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">مبلغ</span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("fa-IR").format(lastTransaction.totalAmount)} تومان
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">تاریخ تحویل</span>
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {formatDate(lastTransaction.deliveryDate)}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="pt-2 space-y-2 border-t border-border/30 mt-2">
                  {/* Products */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-1.5">
                      محصولات تحویل‌شده:
                    </span>
                    <div className="space-y-1">
                      {lastTransaction.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <Package className="h-3 w-3 text-muted-foreground" />
                            {item.productName}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد
                          </Badge>
                        </div>
                      ))}
                      {lastTransaction.items.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{lastTransaction.items.length - 3} محصول دیگر
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Check Details */}
                  {lastTransaction.paymentMethod === "check" && lastTransaction.checkDetails && (
                    <div className="pt-2 border-t border-border/30">
                      <span className="text-xs font-medium text-muted-foreground block mb-1.5">
                        جزئیات چک:
                      </span>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">شماره چک:</span>
                          <span>{lastTransaction.checkDetails.checkNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">بانک:</span>
                          <span>{lastTransaction.checkDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">تاریخ سررسید:</span>
                          <span>{formatDate(lastTransaction.checkDetails.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Date */}
                  {lastTransaction.paymentDate && (
                    <div className="pt-2 border-t border-border/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">تاریخ پرداخت:</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lastTransaction.paymentDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Stats */}
                  {(totalSuppliedAmount > 0 || totalSuppliedItems > 0) && (
                    <div className="pt-2 border-t border-border/30">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">کل تحویل شده:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("fa-IR").format(totalSuppliedItems)} عدد
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">کل مبلغ:</span>
                        <span className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {new Intl.NumberFormat("fa-IR").format(totalSuppliedAmount)} تومان
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Link */}
        <div className="pt-2 border-t border-border/30">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/admin/suppliers/${supplier.id}`}>
              مشاهده جزئیات کامل
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

