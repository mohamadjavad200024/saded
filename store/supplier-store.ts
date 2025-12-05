"use client";

import { create } from "zustand";
import type { Supplier, SupplierTransaction } from "@/types/supplier";

interface SupplierStore {
  suppliers: Supplier[];
  
  // Actions
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplierData: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, supplierData: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  toggleSupplier: (id: string) => void;
  getSupplier: (id: string) => Supplier | undefined;
  
  // Transaction actions
  addSupplierTransaction: (supplierId: string, transactionData: Omit<SupplierTransaction, "id">) => void;
  updateSupplierTransaction: (supplierId: string, transactionId: string, transactionData: Partial<SupplierTransaction>) => void;
  deleteSupplierTransaction: (supplierId: string, transactionId: string) => void;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],

  setSuppliers: (suppliers) => set({ suppliers }),

  addSupplier: (supplierData) => {
    const id = `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSupplier: Supplier = {
      id,
      ...supplierData,
      products: supplierData.products || [],
      transactions: supplierData.transactions || [],
    };
    set((state) => ({
      suppliers: [...state.suppliers, newSupplier],
    }));
  },

  updateSupplier: (id, supplierData) =>
    set((state) => {
      const existingIndex = state.suppliers.findIndex((s) => s.id === id);
      if (existingIndex >= 0) {
        const updatedSuppliers = [...state.suppliers];
        updatedSuppliers[existingIndex] = {
          ...updatedSuppliers[existingIndex],
          ...supplierData,
        };
        return { suppliers: updatedSuppliers };
      }
      return state;
    }),

  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),

  toggleSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      ),
    })),

  getSupplier: (id) => {
    const state = get();
    return state.suppliers.find((s) => s.id === id);
  },

  addSupplierTransaction: (supplierId, transactionData) => {
    const transactionId = `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: SupplierTransaction = {
      id: transactionId,
      ...transactionData,
    };
    
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              transactions: [...(s.transactions || []), newTransaction],
            }
          : s
      ),
    }));
  },

  updateSupplierTransaction: (supplierId, transactionId, transactionData) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              transactions: (s.transactions || []).map((t) =>
                t.id === transactionId ? { ...t, ...transactionData } : t
              ),
            }
          : s
      ),
    })),

  deleteSupplierTransaction: (supplierId, transactionId) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              transactions: (s.transactions || []).filter(
                (t) => t.id !== transactionId
              ),
            }
          : s
      ),
    })),
}));

