"use client";

import { useState } from "react";
import { Supplier, SupplierTransaction } from "@/types/supplier";
import { useSupplierStore } from "@/store/supplier-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupplierTransactionForm } from "@/components/admin/supplier-transaction-form";
import { TransactionCard } from "@/components/admin/transaction-card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Receipt } from "lucide-react";

interface SupplierTransactionsProps {
  supplier: Supplier;
  onUpdate?: () => void;
}

export function SupplierTransactions({
  supplier,
  onUpdate,
}: SupplierTransactionsProps) {
  const { addSupplierTransaction, updateSupplierTransaction, deleteSupplierTransaction } =
    useSupplierStore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<SupplierTransaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const transactions = supplier.transactions || [];

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: SupplierTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteSupplierTransaction(supplier.id, transactionToDelete);
      toast({
        title: "موفق",
        description: "تراکنش با موفقیت حذف شد",
      });
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      onUpdate?.();
    }
  };

  const handleFormSuccess = () => {
    if (editingTransaction) {
      // Update logic will be handled by the form
      toast({
        title: "موفق",
        description: "تراکنش با موفقیت به‌روزرسانی شد",
      });
    } else {
      toast({
        title: "موفق",
        description: "تراکنش با موفقیت افزوده شد",
      });
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
    onUpdate?.();
  };

  const handleFormSubmit = (formData: any) => {
    if (editingTransaction) {
      updateSupplierTransaction(supplier.id, editingTransaction.id, formData);
    } else {
      addSupplierTransaction(supplier.id, formData);
    }
    handleFormSuccess();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">تراکنش‌های تامین</h3>
            {transactions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {transactions.length}
              </Badge>
            )}
          </div>
          <Button onClick={handleAddTransaction} size="sm">
            <Plus className="ml-2 h-4 w-4" />
            افزودن تراکنش
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/30 rounded-lg">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">تراکنشی ثبت نشده است</p>
            <Button
              onClick={handleAddTransaction}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="ml-2 h-4 w-4" />
              افزودن اولین تراکنش
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {transactions
              .sort(
                (a, b) =>
                  new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
              )
              .map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "ویرایش تراکنش" : "افزودن تراکنش جدید"}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? "اطلاعات تراکنش را ویرایش کنید"
                : "اطلاعات تراکنش جدید را وارد کنید"}
            </DialogDescription>
          </DialogHeader>
          <SupplierTransactionForm
            supplierId={supplier.id}
            transaction={editingTransaction || undefined}
            onSuccess={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف تراکنش</DialogTitle>
            <DialogDescription>
              آیا از حذف این تراکنش اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

