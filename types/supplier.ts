export type PaymentMethod = "cash" | "check";

export interface CheckDetails {
  checkNumber: string;
  bankName: string;
  dueDate: string; // ISO date string
}

export interface SupplierTransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface SupplierTransaction {
  id: string;
  items: SupplierTransactionItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  checkDetails?: CheckDetails;
  orderDate: string; // ISO date string
  deliveryDate: string; // ISO date string
  paymentDate?: string; // ISO date string
  notes?: string;
}

export interface SupplierProduct {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice?: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  categories: string[];
  products?: SupplierProduct[];
  transactions?: SupplierTransaction[];
  isActive: boolean;
  lowStockThreshold?: number;
  notes?: string;
}

