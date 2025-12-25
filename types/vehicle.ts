export interface Vehicle {
  id: string;
  name: string;
  logo?: string | null;
  models?: string[]; // Array of model names
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleFilters {
  search?: string;
  enabled?: boolean;
}

