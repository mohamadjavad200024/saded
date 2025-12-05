export interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug?: string | null;
  image?: string | null;
  icon?: string | null;
  enabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


