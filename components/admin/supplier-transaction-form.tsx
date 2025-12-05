"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SupplierTransaction, SupplierTransactionItem, PaymentMethod } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { X, Plus, Loader2, Package, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const transactionSchema = z
  .object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "محصول الزامی است"),
          productName: z.string().min(1, "نام محصول الزامی است"),
          quantity: z.number().min(1, "تعداد باید بیشتر از صفر باشد"),
          unitPrice: z.number().min(0, "قیمت واحد باید مثبت باشد"),
        })
      )
      .min(1, "حداقل یک محصول الزامی است"),
    totalAmount: z.number().min(0, "مبلغ کل باید مثبت باشد"),
    paymentMethod: z.enum(["cash", "check"]),
    checkDetails: z
      .object({
        checkNumber: z.string().min(1, "شماره چک الزامی است"),
        bankName: z.string().min(1, "نام بانک الزامی است"),
        dueDate: z.string().min(1, "تاریخ سررسید الزامی است"),
      })
      .optional(),
    orderDate: z.string().min(1, "تاریخ سفارش الزامی است"),
    deliveryDate: z.string().min(1, "تاریخ تحویل الزامی است"),
    paymentDate: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "check") {
        return (
          data.checkDetails?.checkNumber &&
          data.checkDetails?.bankName &&
          data.checkDetails?.dueDate
        );
      }
      return true;
    },
    {
      message: "در صورت انتخاب پرداخت چکی، جزئیات چک الزامی است",
      path: ["checkDetails"],
    }
  );

type TransactionFormData = z.infer<typeof transactionSchema>;

interface SupplierTransactionFormProps {
  supplierId: string;
  transaction?: SupplierTransaction;
  onSuccess: (data: any) => void;
  onCancel?: () => void;
}

export function SupplierTransactionForm({
  supplierId,
  transaction,
  onSuccess,
  onCancel,
}: SupplierTransactionFormProps) {
  const { products } = useProductStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          items: transaction.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          totalAmount: transaction.totalAmount,
          paymentMethod: transaction.paymentMethod,
          checkDetails: transaction.checkDetails
            ? {
                checkNumber: transaction.checkDetails.checkNumber,
                bankName: transaction.checkDetails.bankName,  
                dueDate: typeof transaction.checkDetails.dueDate === 'string' 
                  ? transaction.checkDetails.dueDate.split("T")[0]
                  : new Date(transaction.checkDetails.dueDate).toISOString().split("T")[0],
              }
            : undefined,
          orderDate: typeof transaction.orderDate === 'string' 
            ? transaction.orderDate.split("T")[0]
            : new Date(transaction.orderDate).toISOString().split("T")[0],
          deliveryDate: typeof transaction.deliveryDate === 'string'
            ? transaction.deliveryDate.split("T")[0]
            : new Date(transaction.deliveryDate).toISOString().split("T")[0],
          paymentDate: transaction.paymentDate
            ? (typeof transaction.paymentDate === 'string'
              ? transaction.paymentDate.split("T")[0]
              : new Date(transaction.paymentDate).toISOString().split("T")[0])
            : "",
          notes: transaction.notes || "",
        }
      : {
          items: [{ productId: "", productName: "", quantity: 1, unitPrice: 0 }],
          totalAmount: 0,
          paymentMethod: "cash" as PaymentMethod,
          orderDate: new Date().toISOString().split("T")[0],
          deliveryDate: new Date().toISOString().split("T")[0],
          notes: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const paymentMethod = watch("paymentMethod");
  const items = watch("items");

  const calculateTotal = () => {
    const total = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );
    setValue("totalAmount", total);
    return total;
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.productName`, product.name);
      setValue(`items.${index}.unitPrice`, product.price || 0);
      calculateTotal();
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      const transactionData = {
        items: data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        checkDetails:
          data.paymentMethod === "check" && data.checkDetails
            ? {
                checkNumber: data.checkDetails.checkNumber,
                bankName: data.checkDetails.bankName,
                dueDate: new Date(data.checkDetails.dueDate),
              }
            : undefined,
        orderDate: new Date(data.orderDate),
        deliveryDate: new Date(data.deliveryDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
        notes: data.notes || undefined,
      };

      onSuccess(transactionData);
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطایی در ذخیره تراکنش رخ داد",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Products */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            محصولات تحویل‌شده
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 p-4 border border-border/30 rounded-lg"
            >
              <div className="col-span-12 md:col-span-4 space-y-2">
                <Label>محصول *</Label>
                <Select
                  value={items[index]?.productId || ""}
                  onValueChange={(value) => handleProductSelect(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب محصول" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.items?.[index]?.productId && (
                  <p className="text-sm text-destructive">
                    {errors.items[index]?.productId?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-3 space-y-2">
                <Label>تعداد *</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                    onChange: () => calculateTotal(),
                  })}
                />
                {errors.items?.[index]?.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.items[index]?.quantity?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-3 space-y-2">
                <Label>قیمت واحد (تومان) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`, {
                    valueAsNumber: true,
                    onChange: () => calculateTotal(),
                  })}
                />
                {errors.items?.[index]?.unitPrice && (
                  <p className="text-sm text-destructive">
                    {errors.items[index]?.unitPrice?.message}
                  </p>
                )}
              </div>

              <div className="col-span-12 md:col-span-2 flex items-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      remove(index);
                      calculateTotal();
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ productId: "", productName: "", quantity: 1, unitPrice: 0 })
            }
            className="w-full"
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن محصول
          </Button>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>مبلغ کل</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>مبلغ کل (تومان) *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register("totalAmount", { valueAsNumber: true })}
              readOnly
              className="text-lg font-bold"
            />
            {errors.totalAmount && (
              <p className="text-sm text-destructive">
                {errors.totalAmount.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>روش پرداخت</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>نوع پرداخت *</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) =>
                setValue("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">نقدی</SelectItem>
                <SelectItem value="check">چکی</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {paymentMethod === "check" && (
            <div className="space-y-4 p-4 border border-border/30 rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label>شماره چک *</Label>
                <Input
                  {...register("checkDetails.checkNumber")}
                  placeholder="مثال: 123456"
                />
                {errors.checkDetails?.checkNumber && (
                  <p className="text-sm text-destructive">
                    {errors.checkDetails.checkNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>نام بانک *</Label>
                <Input
                  {...register("checkDetails.bankName")}
                  placeholder="مثال: بانک ملی"
                />
                {errors.checkDetails?.bankName && (
                  <p className="text-sm text-destructive">
                    {errors.checkDetails.bankName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>تاریخ سررسید چک *</Label>
                <Input
                  type="date"
                  {...register("checkDetails.dueDate")}
                />
                {errors.checkDetails?.dueDate && (
                  <p className="text-sm text-destructive">
                    {errors.checkDetails.dueDate.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dates */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>تاریخ‌ها</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>تاریخ سفارش *</Label>
              <Input type="date" {...register("orderDate")} />
              {errors.orderDate && (
                <p className="text-sm text-destructive">
                  {errors.orderDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>تاریخ تحویل *</Label>
              <Input type="date" {...register("deliveryDate")} />
              {errors.deliveryDate && (
                <p className="text-sm text-destructive">
                  {errors.deliveryDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>تاریخ پرداخت</Label>
              <Input type="date" {...register("paymentDate")} />
              {errors.paymentDate && (
                <p className="text-sm text-destructive">
                  {errors.paymentDate.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>یادداشت‌ها</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea
            {...register("notes")}
            placeholder="یادداشت‌های اضافی درباره این تراکنش..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-border/30">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            انصراف
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : transaction ? (
            "ذخیره تغییرات"
          ) : (
            "افزودن تراکنش"
          )}
        </Button>
      </div>
    </form>
  );
}

