"use client";

import { useState } from "react";
import { Order, ShippingMethod } from "@/types/order";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Package, Truck, User, Phone, Mail, MapPin, Calendar, FileText, CreditCard, MessageCircle } from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { AdminChat } from "@/components/admin/admin-chat";

interface OrderTableProps {
  orders: Order[];
  onRefresh?: () => void;
}

const statusColors: Record<Order["status"], string> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

const statusLabels: Record<Order["status"], string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const paymentStatusColors: Record<Order["paymentStatus"], string> = {
  pending: "warning",
  paid: "success",
  failed: "destructive",
  refunded: "secondary",
};

const paymentStatusLabels: Record<Order["paymentStatus"], string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "پرداخت ناموفق",
  refunded: "بازگشت وجه",
};

export function OrderTable({ orders, onRefresh }: OrderTableProps) {
  const { updateOrderStatus, updatePaymentStatus, updateOrder } = useOrderStore();
  const { getProduct } = useProductStore();
  const { toast } = useToast();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminChatOpen, setAdminChatOpen] = useState(false);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت");
      }

      const result = await response.json();
      if (result.success && result.data) {
        updateOrderStatus(id, status);
        // Update selectedOrder if it's the same order
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        toast({
          title: "موفق",
          description: "وضعیت سفارش به‌روزرسانی شد",
        });
        onRefresh?.();
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در به‌روزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const handlePaymentStatusChange = async (id: string, status: Order["paymentStatus"]) => {
    try {
      const response = await fetch(`/api/orders/${id}/payment-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت پرداخت");
      }

      const result = await response.json();
      if (result.success && result.data) {
        updatePaymentStatus(id, status);
        // Update selectedOrder if it's the same order
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: status });
        }
        toast({
          title: "موفق",
          description: "وضعیت پرداخت به‌روزرسانی شد",
        });
        onRefresh?.();
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در به‌روزرسانی وضعیت پرداخت",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  return (
    <>
      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">شماره سفارش</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">مشتری</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">مبلغ</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">وضعیت</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">پرداخت</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">تاریخ</TableHead>
              <TableHead className="h-10 w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                  سفارشی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-b hover:bg-muted/30">
                  <TableCell className="py-3">
                    <span className="text-xs font-mono text-muted-foreground">{order.orderNumber}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-sm">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell className="py-3 text-sm">
                    {formatPrice(order.total + order.shippingCost)} <span className="text-muted-foreground">تومان</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                      order.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                      order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-50 text-purple-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {statusLabels[order.status]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), "yyyy/MM/dd", { locale: faIR })}
                  </TableCell>
                  <TableCell className="py-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleViewOrder(order)}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">جزئیات سفارش {selectedOrder?.orderNumber}</DialogTitle>
              {selectedOrder && (
                <Button
                  onClick={() => setAdminChatOpen(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">چت با مشتری</span>
                  <span className="sm:hidden">چت</span>
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* تغییر وضعیت سفارش و پرداخت */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">وضعیت سفارش</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order["status"])}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([status, label]) => (
                        <SelectItem key={status} value={status}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">وضعیت پرداخت</label>
                  <Select
                    value={selectedOrder.paymentStatus}
                    onValueChange={(value) => handlePaymentStatusChange(selectedOrder.id, value as Order["paymentStatus"])}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paymentStatusLabels).map(([status, label]) => (
                        <SelectItem key={status} value={status}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* اطلاعات سفارش */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">تاریخ ثبت</p>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedOrder.createdAt), "yyyy/MM/dd - HH:mm", { locale: faIR })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">روش ارسال</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.shippingMethod === "air" ? "هوایی" : "دریایی"}
                    </p>
                  </div>
                </div>
              </div>

              {/* اطلاعات مشتری */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اطلاعات مشتری
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">نام و نام خانوادگی</p>
                        <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">شماره تماس</p>
                        <p className="text-sm font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                    </div>
                    {selectedOrder.customerEmail && (
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">ایمیل</p>
                          <p className="text-sm font-medium">{selectedOrder.customerEmail}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">آدرس ارسال</p>
                        <p className="text-sm font-medium">
                          {selectedOrder.shippingAddress.province && `${selectedOrder.shippingAddress.province}، `}
                          {selectedOrder.shippingAddress.city}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedOrder.shippingAddress.address}</p>
                        {selectedOrder.shippingAddress.postalCode && (
                          <p className="text-xs text-muted-foreground mt-1">
                            کد پستی: {selectedOrder.shippingAddress.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* محصولات سفارش */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  محصولات سفارش ({selectedOrder.items.length} آیتم)
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => {
                    const product = getProduct(item.productId || item.id);
                    
                    // Get image from item first, then from product store
                    let imageUrl = item.image && item.image.trim() !== "" ? item.image : "";
                    if (!imageUrl && product && product.images && product.images.length > 0) {
                      imageUrl = product.images[0];
                    }
                    const hasImage = imageUrl && imageUrl.trim() !== "";
                    
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="text-xs text-muted-foreground w-6">{index + 1}</div>
                        {hasImage ? (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0 border shadow-sm">
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized={imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')}
                              priority={index < 3} // Prioritize first 3 images
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">
                              تعداد: <span className="font-medium text-foreground">{item.quantity}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              قیمت واحد: <span className="font-medium text-foreground">{formatPrice(item.price)} تومان</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity)} تومان
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* یادداشت */}
              {selectedOrder.notes && (
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    یادداشت سفارش
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* خلاصه مالی */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">خلاصه مالی</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">جمع کل محصولات</span>
                    <span className="font-medium">{formatPrice(selectedOrder.total)} تومان</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">هزینه ارسال</span>
                    <span className="font-medium">
                      {selectedOrder.shippingCost === 0 ? (
                        <span className="text-green-600">رایگان</span>
                      ) : (
                        `${formatPrice(selectedOrder.shippingCost)} تومان`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold">مبلغ نهایی</span>
                      <span className="text-base font-bold text-primary">
                        {formatPrice(selectedOrder.total + selectedOrder.shippingCost)} تومان
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* چت ادمین */}
      <AdminChat 
        isOpen={adminChatOpen} 
        onOpenChange={setAdminChatOpen}
      />
    </>
  );
}


