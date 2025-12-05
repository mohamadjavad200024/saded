"use client";

import { useState, useMemo } from "react";
import { Supplier, SupplierProduct } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplierProductsManagerProps {
  supplier: Supplier;
  onUpdate: (products: SupplierProduct[]) => void;
}

export function SupplierProductsManager({
  supplier,
  onUpdate,
}: SupplierProductsManagerProps) {
  const { products } = useProductStore();
  const { getActiveCategories } = useCategoryStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = getActiveCategories();
  const supplierProducts = supplier.products || [];

  // Filter products by supplier categories
  const availableProducts = useMemo(() => {
    let filtered = products.filter((p) =>
      p.category && supplier.categories.includes(p.category)
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Exclude already added products (unless editing)
    if (!editingProduct) {
      const addedProductIds = supplierProducts.map((p) => p.productId);
      filtered = filtered.filter((p) => !addedProductIds.includes(p.id));
    }

    return filtered;
  }, [products, supplier.categories, categoryFilter, supplierProducts, editingProduct]);

  const handleAddProduct = () => {
    if (!selectedProductId || quantity <= 0) {
      toast({
        title: "خطا",
        description: "لطفاً محصول و تعداد را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const newProduct: SupplierProduct = {
      productId: product.id,
      productName: product.name,
      category: product.category || "",
      quantity,
      unitPrice: unitPrice || undefined,
    };

    if (editingProduct) {
      // Update existing product
      const updated = supplierProducts.map((p) =>
        p.productId === editingProduct.productId ? newProduct : p
      );
      onUpdate(updated);
      toast({
        title: "موفق",
        description: "محصول به‌روزرسانی شد",
      });
    } else {
      // Add new product
      onUpdate([...supplierProducts, newProduct]);
      toast({
        title: "موفق",
        description: "محصول اضافه شد",
      });
    }

    // Reset form
    setSelectedProductId("");
    setQuantity(0);
    setUnitPrice(undefined);
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: SupplierProduct) => {
    setEditingProduct(product);
    setSelectedProductId(product.productId);
    setQuantity(product.quantity);
    setUnitPrice(product.unitPrice);
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    const updated = supplierProducts.filter((p) => p.productId !== productId);
    onUpdate(updated);
    toast({
      title: "موفق",
      description: "محصول حذف شد",
    });
  };

  const handleCancel = () => {
    setSelectedProductId("");
    setQuantity(0);
    setUnitPrice(undefined);
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, SupplierProduct[]> = {};
    supplierProducts.forEach((p) => {
      if (!grouped[p.category]) {
        grouped[p.category] = [];
      }
      grouped[p.category].push(p);
    });
    return grouped;
  }, [supplierProducts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">مدیریت محصولات</h3>
          <p className="text-sm text-muted-foreground">
            محصولات و تعداد موجودی که این تامین‌کننده می‌تواند تامین کند
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="ml-2 h-4 w-4" />
          افزودن محصول
        </Button>
      </div>

      {supplierProducts.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">هیچ محصولی اضافه نشده است</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {categoryProducts.length} محصول - مجموع:{" "}
                    {new Intl.NumberFormat("fa-IR").format(
                      categoryProducts.reduce((sum, p) => sum + p.quantity, 0)
                    )}{" "}
                    عدد
                  </span>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>محصول</TableHead>
                    <TableHead>تعداد</TableHead>
                    <TableHead>قیمت واحد</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryProducts.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("fa-IR").format(product.quantity)} عدد
                      </TableCell>
                      <TableCell>
                        {product.unitPrice
                          ? `${new Intl.NumberFormat("fa-IR").format(product.unitPrice)} تومان`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "ویرایش محصول" : "افزودن محصول"}
            </DialogTitle>
            <DialogDescription>
              محصول و تعداد موجودی را انتخاب کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>فیلتر دسته‌بندی</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="همه دسته‌بندی‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>محصول *</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب محصول" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>تعداد *</Label>
              <Input
                type="number"
                min="1"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="تعداد موجودی"
              />
            </div>

            <div className="space-y-2">
              <Label>قیمت واحد (اختیاری)</Label>
              <Input
                type="number"
                min="0"
                value={unitPrice || ""}
                onChange={(e) =>
                  setUnitPrice(e.target.value ? parseFloat(e.target.value) : undefined)
                }
                placeholder="قیمت واحد از تامین‌کننده"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              انصراف
            </Button>
            <Button onClick={handleAddProduct}>
              {editingProduct ? "ذخیره تغییرات" : "افزودن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

