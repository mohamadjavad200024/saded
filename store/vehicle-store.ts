"use client";

import { create } from "zustand";
import type { Vehicle, VehicleFilters } from "@/types/vehicle";
import { logger } from "@/lib/logger-client";

interface VehicleStore {
  vehicles: Vehicle[];
  filters: VehicleFilters;
  isLoading: boolean;
  
  // Actions
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicle: (id: string) => Vehicle | undefined;
  getEnabledVehicles: () => Vehicle[];
  setFilters: (filters: Partial<VehicleFilters>) => void;
  clearFilters: () => void;
  loadVehiclesFromDB: () => Promise<void>;
}

const defaultFilters: VehicleFilters = {};

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  filters: defaultFilters,
  isLoading: false,

  setVehicles: (vehicles) => set({ vehicles }),

  addVehicle: (vehicle) =>
    set((state) => {
      const existingIndex = state.vehicles.findIndex((v) => v.id === vehicle.id);
      if (existingIndex >= 0) {
        const updatedVehicles = [...state.vehicles];
        updatedVehicles[existingIndex] = vehicle;
        return { vehicles: updatedVehicles };
      }
      return { vehicles: [...state.vehicles, vehicle] };
    }),

  updateVehicle: (id, vehicleData) =>
    set((state) => {
      const existingIndex = state.vehicles.findIndex((v) => v.id === id);
      if (existingIndex >= 0) {
        const updatedVehicles = [...state.vehicles];
        updatedVehicles[existingIndex] = {
          ...updatedVehicles[existingIndex],
          ...vehicleData,
          updatedAt: new Date(),
        };
        return { vehicles: updatedVehicles };
      }
      return state;
    }),

  deleteVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })),

  getVehicle: (id) => {
    const state = get();
    return state.vehicles.find((v) => v.id === id);
  },

  getEnabledVehicles: () => {
    const state = get();
    return state.vehicles.filter((v) => v.enabled);
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  loadVehiclesFromDB: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }
      const result = await response.json();
      if (result.success && result.data) {
        const vehicles = result.data.map((v: any) => {
          const vehicle = {
            ...v,
            models: Array.isArray(v.models) ? v.models : (v.models ? JSON.parse(v.models) : []),
            createdAt: new Date(v.createdAt),
            updatedAt: new Date(v.updatedAt),
          };
          
          // Debug logging for logo
          if (process.env.NODE_ENV === 'development') {
            console.log('[VehicleStore] Loaded vehicle:', {
              id: vehicle.id,
              name: vehicle.name,
              hasLogo: !!vehicle.logo,
              logoType: vehicle.logo ? typeof vehicle.logo : 'none',
              logoLength: vehicle.logo ? vehicle.logo.length : 0,
              logoPreview: vehicle.logo ? vehicle.logo.substring(0, 50) : 'none',
            });
          }
          
          return vehicle;
        });
        set({ vehicles, isLoading: false });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[VehicleStore] Total vehicles loaded:', vehicles.length);
        }
      } else {
        throw new Error(result.error || "Failed to load vehicles");
      }
    } catch (error: any) {
      logger.error("Error loading vehicles:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

