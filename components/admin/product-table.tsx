"use client";

import { useState } from "react";
import { Product } from "@/types/product";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductTableProps {
  products: Product[];
  onRefresh?: () => void;
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { deleteProduct, toggleProduct, deleteProducts, toggleProducts } =
    useProductStore();
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        toast({
          title: "موفق",
          description: "محصول با موفقیت حذف شد",
        });
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        onRefresh?.();
      } catch (error) {
        toast({
          title: "خطا",
          description: error instanceof Error ? error.message : "خطا در حذف محصول",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0) {
      try {
        await deleteProducts(selectedIds);
        toast({
          title: "موفق",
          description: `${selectedIds.length} محصول حذف شد`,
        });
        setSelectedIds([]);
        onRefresh?.();
      } catch (error) {
        toast({
          title: "خطا",
          description: error instanceof Error ? error.message : "خطا در حذف محصولات",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleProduct(id);
      toast({
        title: "موفق",
        description: "وضعیت محصول تغییر کرد",
      });
      onRefresh?.();
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در تغییر وضعیت محصول",
        variant: "destructive",
      });
    }
  };

  const handleBulkToggle = async (enabled: boolean) => {
    if (selectedIds.length > 0) {
      try {
        await toggleProducts(selectedIds, enabled);
        toast({
          title: "موفق",
          description: `${selectedIds.length} محصول ${enabled ? "فعال" : "غیرفعال"} شد`,
        });
        setSelectedIds([]);
        onRefresh?.();
      } catch (error) {
        toast({
          title: "خطا",
          description: error instanceof Error ? error.message : "خطا در تغییر وضعیت محصولات",
          variant: "destructive",
        });
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  return (
    <>
      <div className="space-y-4">
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedIds.length} محصول انتخاب شده
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkToggle(true)}
              >
                <Eye className="ml-2 h-4 w-4" />
                فعال کردن
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkToggle(false)}
              >
                <EyeOff className="ml-2 h-4 w-4" />
                غیرفعال کردن
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border/30 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      products.length > 0 &&
                      selectedIds.length === products.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>برند</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    محصولی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(product.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-border/30 shadow-sm group">
                        {(() => {
                          // Debug logging
                          if (process.env.NODE_ENV === 'development') {
                            console.log(`[ProductTable] Product ${product.id} (${product.name}):`, {
                              hasImages: !!product.images,
                              imagesType: typeof product.images,
                              isArray: Array.isArray(product.images),
                              imagesLength: Array.isArray(product.images) ? product.images.length : 0,
                              firstImage: product.images?.[0] ? {
                                type: typeof product.images[0],
                                length: product.images[0].length,
                                preview: product.images[0].substring(0, 100),
                                startsWithData: product.images[0].startsWith('data:'),
                                startsWithHttp: product.images[0].startsWith('http'),
                              } : null,
                            });
                          }
                          
                          return product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0] ? (
                            <>
                              <SafeImage
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                                productId={product.id}
                                priority
                                loading="eager"
                                onError={() => {
                                  // Log error for debugging in development
                                  if (process.env.NODE_ENV === 'development') {
                                    console.warn('Failed to load image for product:', {
                                      productId: product.id,
                                      productName: product.name,
                                      imageUrl: product.images[0]?.substring(0, 100),
                                      imageType: product.images[0]?.startsWith('data:') ? 'base64' : 'url',
                                      fullImageLength: product.images[0]?.length,
                                    });
                                  }
                                }}
                              />
                            {product.images.length > 1 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 text-center z-10">
                                +{product.images.length - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                            <span className="text-xs text-muted-foreground font-medium">
                              بدون تصویر
                            </span>
                          </div>
                        );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)} تومان</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stockCount < 10 ? "warning" : "success"
                        }
                      >
                        {product.stockCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.enabled ? "success" : "secondary"}
                      >
                        {product.enabled ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggle(product.id)}
                          >
                            {product.enabled ? (
                              <>
                                <EyeOff className="ml-2 h-4 w-4" />
                                غیرفعال کردن
                              </>
                            ) : (
                              <>
                                <Eye className="ml-2 h-4 w-4" />
                                فعال کردن
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف محصول</DialogTitle>
            <DialogDescription>
              آیا از حذف این محصول اطمینان دارید؟ این عمل قابل بازگشت نیست.
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

