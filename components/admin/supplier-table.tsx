"use client";

import { useState } from "react";
import { Supplier } from "@/types/supplier";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Phone, Mail, AlertTriangle, Package, Info, Calendar, DollarSign, Receipt } from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { useSupplierStore } from "@/store/supplier-store";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupplierTableProps {
  suppliers: Supplier[];
  onRefresh?: () => void;
}

export function SupplierTable({ suppliers, onRefresh }: SupplierTableProps) {
  const { deleteSupplier, toggleSupplier } = useSupplierStore();
  const { products } = useProductStore();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSupplierToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete);
      toast({
        title: "موفق",
        description: "تامین‌کننده با موفقیت حذف شد",
      });
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
      onRefresh?.();
    }
  };

  const handleToggle = (id: string) => {
    toggleSupplier(id);
    toast({
      title: "موفق",
      description: "وضعیت تامین‌کننده تغییر کرد",
    });
    onRefresh?.();
  };

  // Check low stock for supplier's categories
  const checkLowStock = (supplier: Supplier) => {
    const threshold = supplier.lowStockThreshold || 10;
    const supplierProducts = products.filter(
      (p) =>
        supplier.categories.includes(p.category) &&
        p.stockCount <= threshold
    );
    return supplierProducts.length;
  };

  return (
    <>
      <div className="rounded-lg border border-border/30 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>تماس</TableHead>
              <TableHead>دسته‌بندی‌ها</TableHead>
              <TableHead>محصولات</TableHead>
              <TableHead>هشدار موجودی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  تامین‌کننده‌ای یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => {
                const lowStockCount = checkLowStock(supplier);
                
                // Calculate category stats
                const categoryStats = supplier.categories.map((cat) => {
                  const categoryProducts = supplier.products?.filter(
                    (p) => p.category === cat
                  ) || [];
                  return {
                    category: cat,
                    productCount: categoryProducts.length,
                    totalQuantity: categoryProducts.reduce((sum, p) => sum + p.quantity, 0),
                  };
                });
                
                const totalProducts = supplier.products?.length || 0;
                const totalQuantity = supplier.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
                
                // Get transactions data
                const transactions = supplier.transactions || [];
                const lastTransaction = transactions.length > 0 ? transactions[transactions.length - 1] : null;
                const totalTransactions = transactions.length;
                const totalSuppliedAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
                const totalSuppliedItems = transactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
                
                const formatDate = (date: Date) => {
                  try {
                    return format(new Date(date), "yyyy/MM/dd", { locale: faIR });
                  } catch {
                    return "-";
                  }
                };
                
                return (
                  <TableRow key={supplier.id} className="align-top">
                    <TableCell className="font-medium py-6">
                      <div className="space-y-2">
                        <div>{supplier.name}</div>
                        {totalTransactions > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {totalTransactions} تراکنش
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={`tel:${supplier.phone}`}
                            className="hover:text-primary transition-colors"
                          >
                            {supplier.phone}
                          </a>
                        </div>
                        {supplier.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <a
                              href={`mailto:${supplier.email}`}
                              className="hover:text-primary transition-colors"
                            >
                              {supplier.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.map((cat) => {
                          const stats = categoryStats.find((s) => s.category === cat);
                          return (
                            <Badge key={cat} variant="secondary" className="text-xs gap-1">
                              {cat}
                              {stats && stats.productCount > 0 && (
                                <span className="font-bold">({stats.productCount})</span>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Package className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{totalProducts}</span>
                            <span className="text-muted-foreground">محصول</span>
                          </div>
                          {totalQuantity > 0 && (
                            <div className="text-xs text-muted-foreground">
                              مجموع: {new Intl.NumberFormat("fa-IR").format(totalQuantity)} عدد
                            </div>
                          )}
                        </div>
                        {lastTransaction && (
                          <div className="pt-2 border-t border-border/30 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">
                              آخرین تحویل:
                            </div>
                            {lastTransaction.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-xs flex items-center gap-1">
                                <Package className="h-2.5 w-2.5 text-muted-foreground" />
                                <span>{item.productName}</span>
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                                </Badge>
                              </div>
                            ))}
                            {lastTransaction.items.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{lastTransaction.items.length - 2} محصول دیگر
                              </div>
                            )}
                            {totalSuppliedItems > 0 && (
                              <div className="text-xs text-muted-foreground pt-1">
                                کل تحویل شده: {new Intl.NumberFormat("fa-IR").format(totalSuppliedItems)} عدد
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      {lowStockCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {lowStockCount} محصول
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="success">کافی</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <Badge variant={supplier.isActive ? "success" : "secondary"}>
                          {supplier.isActive ? "فعال" : "غیرفعال"}
                        </Badge>
                        {lastTransaction && (
                          <div className="pt-2 border-t border-border/30 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                              پرداخت:
                            </div>
                            <Badge
                              variant={lastTransaction.paymentMethod === "cash" ? "success" : "warning"}
                              className="text-xs"
                            >
                              {lastTransaction.paymentMethod === "cash" ? "نقدی" : "چکی"}
                            </Badge>
                            {lastTransaction.paymentMethod === "check" && lastTransaction.checkDetails && (
                              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                <div>چک: {lastTransaction.checkDetails.checkNumber}</div>
                                <div>بانک: {lastTransaction.checkDetails.bankName}</div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-2.5 w-2.5" />
                                  سررسید: {formatDate(lastTransaction.checkDetails.dueDate)}
                                </div>
                              </div>
                            )}
                            {lastTransaction.paymentDate && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5" />
                                پرداخت: {formatDate(lastTransaction.paymentDate)}
                              </div>
                            )}
                            {totalSuppliedAmount > 0 && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <DollarSign className="h-2.5 w-2.5" />
                                کل: {new Intl.NumberFormat("fa-IR").format(totalSuppliedAmount)} تومان
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-2">
                        {lastTransaction && (
                          <div className="text-xs text-muted-foreground space-y-1 pb-2 border-b border-border/30">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              سفارش: {formatDate(lastTransaction.orderDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              تحویل: {formatDate(lastTransaction.deliveryDate)}
                            </div>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                            <DropdownMenuItem onClick={() => handleToggle(supplier.id)}>
                              {supplier.isActive ? "غیرفعال کردن" : "فعال کردن"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(supplier.id)}
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف تامین‌کننده</DialogTitle>
            <DialogDescription>
              آیا از حذف این تامین‌کننده اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

