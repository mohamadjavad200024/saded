"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types/product";
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
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Plus, Package, Settings, Image as ImageIcon, Tag, FileText, Loader2, Plane, Ship, Gift, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";

const productSchema = z.object({
  name: z.string().min(1, "نام محصول الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  price: z.number().min(0, "قیمت باید مثبت باشد"),
  originalPrice: z.number().optional(),
  brand: z.string().min(1, "برند الزامی است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  vin: z.string().optional(),
  vinEnabled: z.boolean(),
  airShippingEnabled: z.boolean(),
  seaShippingEnabled: z.boolean(),
  airShippingCost: z.number().min(0, "هزینه ارسال باید مثبت باشد").nullable().optional(),
  seaShippingCost: z.number().min(0, "هزینه ارسال باید مثبت باشد").nullable().optional(),
  stockCount: z.number().min(0, "موجودی باید مثبت باشد"),
  inStock: z.boolean(),
  enabled: z.boolean(),
  images: z.array(z.string()).min(1, "حداقل یک تصویر الزامی است"),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
}).refine((data) => {
  if (data.vinEnabled) {
    if (!data.vin || data.vin.length === 0) {
      return false;
    }
    if (data.vin.length !== 17) {
      return false;
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(data.vin)) {
      return false;
    }
  }
  return true;
}, {
  message: "VIN باید دقیقاً 17 کاراکتر (حروف بزرگ انگلیسی و اعداد، بدون I, O, Q) باشد",
  path: ["vin"],
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct, loadProductsFromDB } = useProductStore();
  const { getActiveCategories, loadCategoriesFromDB } = useCategoryStore();
  const { toast } = useToast();
  const categories = getActiveCategories();
  const [images, setImages] = useState<string[]>(
    product?.images || []
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
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [specifications, setSpecifications] = useState<
    Record<string, string>
  >(() => {
    const specs = product?.specifications || {};
    // Convert Record<string, unknown> to Record<string, string>
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(specs)) {
      result[key] = typeof value === 'string' ? value : String(value);
    }
    return result;
  });
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [vinEnabled, setVinEnabled] = useState(product?.vinEnabled ?? false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          originalPrice: product.originalPrice ?? undefined,
          brand: product.brand ?? "",
          category: product.category ?? "",
          vin: product.vin ?? "",
          vinEnabled: product.vinEnabled ?? false,
          airShippingEnabled: product.airShippingEnabled ?? true,
          seaShippingEnabled: product.seaShippingEnabled ?? true,
          airShippingCost: product.airShippingCost ?? null,
          seaShippingCost: product.seaShippingCost ?? null,
          stockCount: product.stockCount,
          inStock: product.inStock,
          enabled: product.enabled,
          images: product.images || [],
          tags: product.tags,
          specifications: (() => {
            const specs = product.specifications || {};
            const result: Record<string, string> = {};
            for (const [key, value] of Object.entries(specs)) {
              result[key] = typeof value === 'string' ? value : String(value);
            }
            return result;
          })(),
        }
      : {
          name: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          brand: "",
          category: "",
          vin: "",
          vinEnabled: false,
          airShippingEnabled: true,
          seaShippingEnabled: true,
          airShippingCost: null,
          seaShippingCost: null,
          stockCount: 0,
          inStock: true,
          enabled: true,
          images: [],
          tags: [],
          specifications: {},
        },
  });

  const inStock = watch("inStock");
  const enabled = watch("enabled");
  const airShippingEnabled = watch("airShippingEnabled");
  const seaShippingEnabled = watch("seaShippingEnabled");
  const airShippingCost = watch("airShippingCost");
  const seaShippingCost = watch("seaShippingCost");

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setValue("images", newImages);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications({ ...specifications, [newSpecKey.trim()]: newSpecValue.trim() });
      setNewSpecKey("");
      setNewSpecValue("");
      setShowSpecForm(false);
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (images.length === 0) {
        toast({
          title: "خطا",
          description: "حداقل یک تصویر الزامی است",
          variant: "destructive",
        });
        return;
      }

      const productData = {
        ...data,
        images,
        tags,
        specifications,
        vin: vinEnabled ? data.vin : undefined,
        vinEnabled,
      };

      if (product) {
        // Update existing product via API
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "خطا در به‌روزرسانی محصول");
        }

        const updatedProduct = await response.json();
        updateProduct(updatedProduct.data);
        toast({
          title: "موفق",
          description: "محصول با موفقیت به‌روزرسانی شد",
        });
      } else {
        // Create new product via API
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || "خطا در ایجاد محصول";
          console.error("Error creating product:", errorData);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("Product created successfully:", result);
        
        // Check if result has data property
        const newProduct = result.data || result;
        if (newProduct) {
          addProduct(newProduct);
        }
        
        // Reload products from database to ensure the list is up to date (include inactive for admin)
        await loadProductsFromDB(true);
        
        toast({
          title: "موفق",
          description: "محصول با موفقیت اضافه شد",
        });
      }

      onSuccess?.();
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
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
              <Package className="h-5 w-5 text-primary" />
              اطلاعات پایه
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="نام محصول"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="توضیحات محصول"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">قیمت (تومان) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">قیمت اصلی (تومان)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  {...register("originalPrice", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Brand */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              دسته‌بندی و برند
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">دسته‌بندی *</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">برند *</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="نام برند"
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-[10px] sm:text-xs md:text-sm">فعال‌سازی VIN</Label>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground leading-tight">
                    نمایش VIN برای این محصول
                  </p>
                </div>
                <Switch
                  checked={vinEnabled}
                  onCheckedChange={(checked) => {
                    setVinEnabled(checked);
                    setValue("vinEnabled", checked);
                    if (!checked) {
                      setValue("vin", "");
                    }
                  }}
                  className="flex-shrink-0"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="vin" className="text-[10px] sm:text-xs md:text-sm">
                  VIN {vinEnabled && "*"}
                </Label>
                <Input
                  id="vin"
                  {...register("vin", {
                    onChange: (e) => {
                      // Convert to uppercase automatically
                      const upperValue = e.target.value.toUpperCase();
                      e.target.value = upperValue;
                      setValue("vin", upperValue);
                    },
                  })}
                  placeholder="17 کاراکتر (مثال: 1HGBH41JXMN109186)"
                  maxLength={17}
                  className="font-mono text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3"
                />
                {errors.vin && (
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-destructive leading-tight">{errors.vin.message}</p>
                )}
                {!vinEnabled && (
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground leading-tight">
                    برای اعتبارسنجی VIN، ابتدا "فعال‌سازی VIN" را فعال کنید
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockCount">موجودی *</Label>
              <Input
                id="stockCount"
                type="number"
                {...register("stockCount", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stockCount && (
                <p className="text-sm text-destructive">
                  {errors.stockCount.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            تصاویر محصول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onChange={handleImagesChange}
            maxImages={5}
          />
          {errors.images && (
            <p className="text-sm text-destructive mt-2">{errors.images.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            تگ‌ها
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="افزودن تگ"
            />
            <Button type="button" onClick={addTag}>
              افزودن
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              مشخصات
            </CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSpecForm(!showSpecForm)}
            >
              <Plus className="ml-2 h-4 w-4" />
              {showSpecForm ? "انصراف" : "افزودن مشخصه"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSpecForm && (
            <div className="p-4 border border-border/30 rounded-lg bg-muted/30 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="specKey">کلید مشخصه</Label>
                  <Input
                    id="specKey"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="مثال: گارانتی"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specValue">مقدار</Label>
                  <Input
                    id="specValue"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="مثال: 12 ماه"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={addSpecification} size="sm">
                  افزودن
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowSpecForm(false);
                    setNewSpecKey("");
                    setNewSpecValue("");
                  }}
                >
                  انصراف
                </Button>
              </div>
            </div>
          )}
          
          {Object.keys(specifications).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border border-border/30 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{key}:</span>
                    <span className="text-sm text-muted-foreground mr-2">{value}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeSpecification(key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            !showSpecForm && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">هیچ مشخصه‌ای اضافه نشده است</p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            وضعیت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>موجود در انبار</Label>
              <p className="text-sm text-muted-foreground">
                محصول در انبار موجود است
              </p>
            </div>
            <Switch
              checked={inStock}
              onCheckedChange={(checked) => setValue("inStock", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>فعال</Label>
              <p className="text-sm text-muted-foreground">
                محصول در سایت نمایش داده می‌شود
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            روش‌های ارسال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5">
                  <Plane className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  ارسال هوایی
                </Label>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground leading-tight">
                  امکان ارسال هوایی برای این محصول
                </p>
              </div>
              <Switch
                checked={airShippingEnabled}
                onCheckedChange={(checked) => {
                  setValue("airShippingEnabled", checked);
                  if (!checked) {
                    setValue("airShippingCost", null);
                  }
                }}
                className="flex-shrink-0"
              />
            </div>
            {airShippingEnabled && (
              <div className="space-y-3 pr-4 sm:pr-6 pt-3 border-t border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Label htmlFor="airShippingCost" className="text-[10px] sm:text-xs md:text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    هزینه ارسال هوایی
                  </Label>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={airShippingCost === null || airShippingCost === 0 ? "success" : "default"}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs font-semibold shadow-sm"
                    >
                      {airShippingCost === null || airShippingCost === 0 ? (
                        <>
                          <Gift className="h-3.5 w-3.5" />
                          <span>رایگان</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>پولی</span>
                        </>
                      )}
                    </Badge>
                    <Switch
                      checked={airShippingCost !== null && airShippingCost !== 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // If switching to paid, set a default value if current is null or 0
                          setValue("airShippingCost", airShippingCost && airShippingCost > 0 ? airShippingCost : 50000);
                        } else {
                          // If switching to free, set to null
                          setValue("airShippingCost", null);
                        }
                      }}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
                {(airShippingCost !== null && airShippingCost !== 0) && (
                  <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border/20">
                    <Input
                      id="airShippingCost"
                      type="number"
                      {...register("airShippingCost", { valueAsNumber: true })}
                      placeholder="مثال: 50000"
                      min={1}
                      className="text-[11px] sm:text-xs md:text-sm bg-background"
                    />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      هزینه ارسال به تومان
                    </p>
                  </div>
                )}
                {errors.airShippingCost && (
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-destructive flex items-center gap-1">
                    {errors.airShippingCost.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5">
                  <Ship className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  ارسال دریایی
                </Label>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground leading-tight">
                  امکان ارسال دریایی برای این محصول
                </p>
              </div>
              <Switch
                checked={seaShippingEnabled}
                onCheckedChange={(checked) => {
                  setValue("seaShippingEnabled", checked);
                  if (!checked) {
                    setValue("seaShippingCost", null);
                  }
                }}
                className="flex-shrink-0"
              />
            </div>
            {seaShippingEnabled && (
              <div className="space-y-3 pr-4 sm:pr-6 pt-3 border-t border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Label htmlFor="seaShippingCost" className="text-[10px] sm:text-xs md:text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    هزینه ارسال دریایی
                  </Label>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={seaShippingCost === null || seaShippingCost === 0 ? "success" : "default"}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs font-semibold shadow-sm"
                    >
                      {seaShippingCost === null || seaShippingCost === 0 ? (
                        <>
                          <Gift className="h-3.5 w-3.5" />
                          <span>رایگان</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>پولی</span>
                        </>
                      )}
                    </Badge>
                    <Switch
                      checked={seaShippingCost !== null && seaShippingCost !== 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // If switching to paid, set a default value if current is null or 0
                          setValue("seaShippingCost", seaShippingCost && seaShippingCost > 0 ? seaShippingCost : 50000);
                        } else {
                          // If switching to free, set to null
                          setValue("seaShippingCost", null);
                        }
                      }}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
                {(seaShippingCost !== null && seaShippingCost !== 0) && (
                  <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border/20">
                    <Input
                      id="seaShippingCost"
                      type="number"
                      {...register("seaShippingCost", { valueAsNumber: true })}
                      placeholder="مثال: 50000"
                      min={1}
                      className="text-[11px] sm:text-xs md:text-sm bg-background"
                    />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      هزینه ارسال به تومان
                    </p>
                  </div>
                )}
                {errors.seaShippingCost && (
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-destructive flex items-center gap-1">
                    {errors.seaShippingCost.message}
                  </p>
                )}
              </div>
            )}
          </div>
          {errors.airShippingEnabled && (
            <p className="text-[9px] sm:text-[10px] md:text-xs text-destructive leading-tight">
              {errors.airShippingEnabled.message}
            </p>
          )}
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
        <Button 
          type="submit" 
          disabled={isSubmitting}
          size="lg"
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : product ? (
            "ذخیره تغییرات"
          ) : (
            "افزودن محصول"
          )}
        </Button>
      </div>
    </form>
  );
}

