"use client";

import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierCard } from "@/components/admin/supplier-card";
import { Button } from "@/components/ui/button";
import { useSupplierStore } from "@/store/supplier-store";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuppliersGridProps {
  suppliers: Supplier[];
  onRefresh?: () => void;
}

export function SuppliersGrid({ suppliers, onRefresh }: SuppliersGridProps) {
  const { deleteSupplier, toggleSupplier } = useSupplierStore();
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

  return (
    <>
      {/* Suppliers Grid */}
      {suppliers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border/30 rounded-lg">
          <p className="text-muted-foreground">تامین‌کننده‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Delete Dialog */}
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

