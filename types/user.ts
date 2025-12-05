export type UserRole = "admin" | "moderator" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  ordersCount?: number;
  totalSpent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

