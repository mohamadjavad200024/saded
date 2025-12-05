"use client";

import { useState } from "react";
import { SupplierTransaction } from "@/types/supplier";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Calendar,
  DollarSign,
  Package,
  Receipt,
  CreditCard,
  Banknote,
} from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

interface TransactionCardProps {
  transaction: SupplierTransaction;
  onEdit: (transaction: SupplierTransaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "yyyy/MM/dd", { locale: faIR });
    } catch {
      return "-";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const totalItems = transaction.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="hover:shadow-md transition-shadow border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">تراکنش #{transaction.id.slice(-8)}</h3>
                  <Badge
                    variant={transaction.paymentMethod === "cash" ? "success" : "warning"}
                    className="text-xs"
                  >
                    {transaction.paymentMethod === "cash" ? (
                      <>
                        <Banknote className="h-3 w-3 ml-1" />
                        نقدی
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3 w-3 ml-1" />
                        چکی
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    تحویل: {formatDate(transaction.deliveryDate)}
                  </div>
                  {transaction.paymentDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      پرداخت: {formatDate(transaction.paymentDate)}
                    </div>
                  )}
                </div>
              </div>
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
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <Edit className="ml-2 h-4 w-4" />
                ویرایش
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">مبلغ کل</span>
          </div>
          <span className="text-xl font-bold">
            {formatCurrency(transaction.totalAmount)} تومان
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>تعداد محصولات</span>
            </div>
            <div className="text-lg font-semibold">{transaction.items.length}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>تعداد کل</span>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(totalItems)} عدد</div>
          </div>
        </div>

        {/* Products Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">محصولات</span>
            {transaction.items.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "بستن" : "مشاهده همه"}
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {transaction.items
              .slice(0, isExpanded ? transaction.items.length : 3)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.productName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formatCurrency(item.quantity)} عدد
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(item.unitPrice)} تومان
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Check Details */}
        {transaction.paymentMethod === "check" && transaction.checkDetails && (
          <div className="pt-3 border-t border-border/30 space-y-2">
            <span className="text-sm font-medium text-muted-foreground block">
              جزئیات چک:
            </span>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">شماره چک:</span>
                <div className="font-medium">{transaction.checkDetails.checkNumber}</div>
              </div>
              <div>
                <span className="text-muted-foreground">بانک:</span>
                <div className="font-medium">{transaction.checkDetails.bankName}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">تاریخ سررسید:</span>
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  {formatDate(transaction.checkDetails.dueDate)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="pt-3 border-t border-border/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">تاریخ سفارش</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.orderDate)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">تاریخ تحویل</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.deliveryDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <div className="pt-3 border-t border-border/30">
            <span className="text-sm font-medium text-muted-foreground block mb-1">
              یادداشت:
            </span>
            <p className="text-sm">{transaction.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

