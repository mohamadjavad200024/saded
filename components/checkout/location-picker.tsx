"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Check, Navigation, X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import برای Leaflet (فقط در client-side)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

// کامپوننت برای مدیریت رویدادهای نقشه
function MapClickHandler({ 
  onLocationSelect,
  setMapInstance
}: { 
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  setMapInstance: (map: any) => void;
}) {
  if (typeof window === "undefined") return null;
  
  const { useMapEvents, useMap } = require("react-leaflet");
  const map = useMap();
  const setMapInstanceRef = useRef(setMapInstance);
  setMapInstanceRef.current = setMapInstance;
  
  useEffect(() => {
    if (map) {
      setMapInstanceRef.current(map);
    }
  }, [map]);
  
  useMapEvents({
    click: (e: any) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  
  return null;
}

export function LocationPicker({ open, onOpenChange, onLocationSelect, initialLocation }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.6892, 51.3890]); // تهران به عنوان پیش‌فرض
  const [isMapReady, setIsMapReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);

  // دریافت موقعیت فعلی کاربر هنگام باز شدن مودال
  useEffect(() => {
    if (open && navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setSelectedLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [open]);

  // تنظیم موقعیت اولیه
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
  };

  const setMapInstance = (map: any) => {
    mapInstanceRef.current = map;
  };

  const handleGoToCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        // حرکت نقشه به موقعیت فعلی
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15, {
            animate: true,
            duration: 0.5,
          });
        }
        
        setMapCenter([latitude, longitude]);
        setSelectedLocation(newLocation);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = async () => {
    if (selectedLocation) {
      setIsLoading(true);
      
      try {
        // استفاده از API route داخلی برای reverse geocoding
        // این کار مشکل CORS را حل می‌کند
        const response = await fetch(
          `/api/geocoding/reverse?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const address = result.address || `${selectedLocation.lat}, ${selectedLocation.lng}`;
        
        onLocationSelect({
          ...selectedLocation,
          address,
        });
        onOpenChange(false);
      } catch (error: any) {
        console.error("Error getting address:", error);
        
        // در صورت خطا، فقط مختصات را ارسال می‌کنیم
        onLocationSelect({
          ...selectedLocation,
          address: `${selectedLocation.lat}, ${selectedLocation.lng}`,
        });
        onOpenChange(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex flex-col p-0 gap-0 max-w-[95vw] sm:max-w-3xl lg:max-w-4xl w-full h-[90vh] sm:h-[85vh] max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
        }}
      >
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 flex-shrink-0 relative border-b border-border/30">
          <DialogTitle className="text-right text-base sm:text-lg pr-8">
            انتخاب موقعیت روی نقشه
          </DialogTitle>
          <DialogClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-50 h-8 w-8 flex items-center justify-center">
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </DialogClose>
        </DialogHeader>
        
        {/* Map Container */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {typeof window !== "undefined" && (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              className="rounded-none"
              whenReady={() => setIsMapReady(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {selectedLocation && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={
                    typeof window !== "undefined" &&
                    (() => {
                      const L = require("leaflet");
                      const svgIcon = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
                          <path fill="#3388ff" stroke="#fff" stroke-width="1.5" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.5 12.5 28.5 12.5 28.5S25 21 25 12.5C25 5.596 19.404 0 12.5 0z"/>
                          <circle fill="#fff" cx="12.5" cy="12.5" r="5"/>
                        </svg>
                      `;
                      return L.icon({
                        iconUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      });
                    })()
                  }
                />
              )}
              
              <MapClickHandler onLocationSelect={handleMapClick} setMapInstance={setMapInstance} />
            </MapContainer>
          )}
          
          {/* دکمه رفتن به موقعیت فعلی */}
          {isMapReady && navigator.geolocation && (
            <Button
              type="button"
              onClick={handleGoToCurrentLocation}
              disabled={isGettingLocation}
              className="absolute bottom-24 sm:bottom-20 left-4 z-[1000] h-12 w-12 sm:h-10 sm:w-10 rounded-full shadow-lg bg-background hover:bg-muted border border-border"
              title="رفتن به موقعیت فعلی"
            >
              {isGettingLocation ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Navigation className="h-5 w-5 text-primary" />
              )}
            </Button>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-4 pb-4 pt-3 flex-col sm:flex-row gap-3 bg-background border-t border-border/30 flex-shrink-0">
          <div className="flex gap-2 w-full sm:w-auto order-1">
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedLocation || isLoading}
              className="flex-1 sm:flex-initial text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">در حال پردازش...</span>
                  <span className="sm:hidden">در حال...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">تایید موقعیت</span>
                  <span className="sm:hidden">تایید</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-initial text-sm"
            >
              انصراف
            </Button>
          </div>
          <div className="flex-1 text-sm text-muted-foreground text-right w-full sm:w-auto order-2">
            {selectedLocation ? (
              <div className="flex items-center gap-2 justify-end">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-sm">روی نقشه کلیک کنید تا موقعیت را انتخاب کنید</span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
