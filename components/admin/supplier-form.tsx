"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Supplier } from "@/types/supplier";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupplierStore } from "@/store/supplier-store";
import { useCategoryStore } from "@/store/category-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Plus, Loader2, Phone, Mail, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SupplierProductsManager } from "@/components/admin/supplier-products-manager";

const supplierSchema = z.object({
  name: z.string().min(1, "نام تامین‌کننده الزامی است"),
  phone: z.string().min(1, "شماره تماس الزامی است"),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  categories: z.array(z.string()).min(1, "حداقل یک دسته‌بندی الزامی است"),
  notes: z.string().optional(),
  isActive: z.boolean(),
  lowStockThreshold: z.number().min(0).optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  supplier?: Supplier;
  onSuccess?: () => void;
}

export function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const router = useRouter();
  const { addSupplier, updateSupplier } = useSupplierStore();
  const { getActiveCategories, loadCategoriesFromDB } = useCategoryStore();
  const { toast } = useToast();
  const categories = getActiveCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    supplier?.categories || []
  );

  // Load categories from database when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await loadCategoriesFromDB();
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, [loadCategoriesFromDB]);
  const [supplierProducts, setSupplierProducts] = useState(
    supplier?.products || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier
      ? {
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email || "",
          categories: supplier.categories,
          notes: supplier.notes || "",
          isActive: supplier.isActive,
          lowStockThreshold: supplier.lowStockThreshold || 10,
        }
      : {
          name: "",
          phone: "",
          email: "",
          categories: [],
          notes: "",
          isActive: true,
          lowStockThreshold: 10,
        },
  });

  const isActive = watch("isActive");

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    setValue("categories", newCategories);
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      if (selectedCategories.length === 0) {
        toast({
          title: "خطا",
          description: "حداقل یک دسته‌بندی باید انتخاب شود",
          variant: "destructive",
        });
        return;
      }

      const supplierData = {
        ...data,
        categories: selectedCategories,
        products: supplierProducts,
        email: data.email || undefined,
        notes: data.notes || undefined,
      };

      if (supplier) {
        updateSupplier(supplier.id, supplierData);
        toast({
          title: "موفق",
          description: "تامین‌کننده با موفقیت به‌روزرسانی شد",
        });
      } else {
        addSupplier(supplierData);
        toast({
          title: "موفق",
          description: "تامین‌کننده با موفقیت اضافه شد",
        });
      }

      onSuccess?.();
      router.push("/admin/suppliers");
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              اطلاعات تماس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام تامین‌کننده *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="نام تامین‌کننده"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">شماره تماس *</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="09123456789"
                type="tel"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="example@email.com"
                type="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories & Settings */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              دسته‌بندی‌ها و تنظیمات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>دسته‌بندی محصولات *</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border border-border/30 rounded-lg min-h-[120px]">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`
                      p-2 rounded text-sm text-right transition-colors
                      ${
                        selectedCategories.includes(cat.name)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="default" className="gap-1">
                      {cat}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {errors.categories && (
                <p className="text-sm text-destructive">
                  {errors.categories.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">
                حد آستانه موجودی کم (عدد)
              </Label>
              <Input
                id="lowStockThreshold"
                type="number"
                {...register("lowStockThreshold", { valueAsNumber: true })}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                وقتی موجودی محصولات به این عدد یا کمتر برسد، هشدار نمایش داده می‌شود
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>یادداشت‌ها</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea
            {...register("notes")}
            placeholder="یادداشت‌های اضافی درباره این تامین‌کننده..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            مدیریت محصولات
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <SupplierProductsManager
            supplier={{
              ...supplier,
              categories: selectedCategories,
              products: supplierProducts,
            } as any}
            onUpdate={setSupplierProducts}
          />
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle>وضعیت</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>فعال</Label>
              <p className="text-sm text-muted-foreground">
                تامین‌کننده فعال است و می‌تواند محصولات را تامین کند
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-border/30">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          size="lg"
        >
          انصراف
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : supplier ? (
            "ذخیره تغییرات"
          ) : (
            "افزودن تامین‌کننده"
          )}
        </Button>
      </div>
    </form>
  );
}

