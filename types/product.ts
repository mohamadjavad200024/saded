export interface Product {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  vehicle?: string | null; // Vehicle ID
  model?: string | null; // Model name
  price: number;
  originalPrice?: number | null;
  images: string[];
  tags: string[];
  specifications: Record<string, unknown>;
  stockCount: number;
  inStock: boolean;
  enabled: boolean;
  vin?: string | null;
  vinEnabled: boolean;
  airShippingEnabled: boolean;
  seaShippingEnabled: boolean;
  airShippingCost?: number | null;
  seaShippingCost?: number | null;
  rating?: number | null;
  reviews?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search?: string;
  vin?: string;
  vehicle?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  categories?: string[];
  inStock?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


