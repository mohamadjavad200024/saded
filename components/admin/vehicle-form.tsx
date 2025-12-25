"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicleStore } from "@/store/vehicle-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Car, Plus, X, Image as ImageIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { SingleImageUpload } from "@/components/admin/single-image-upload";

const vehicleSchema = z.object({
  name: z.string().min(1, "نام خودرو الزامی است"),
  logo: z.string().optional().nullable(),
  models: z.array(z.string()).default([]),
  enabled: z.boolean(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess?: () => void;
}

export function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const router = useRouter();
  const { addVehicle, updateVehicle, loadVehiclesFromDB } = useVehicleStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [modelInput, setModelInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          name: vehicle.name,
          logo: vehicle.logo || "",
          models: vehicle.models || [],
          enabled: vehicle.enabled,
        }
      : {
          name: "",
          logo: "",
          models: [],
          enabled: true,
        },
  });

  const models = watch("models") || [];
  const enabled = watch("enabled");
  const logo = watch("logo");

  const addModel = () => {
    if (modelInput.trim()) {
      const currentModels = watch("models") || [];
      if (!currentModels.includes(modelInput.trim())) {
        setValue("models", [...currentModels, modelInput.trim()]);
        setModelInput("");
      }
    }
  };

  const removeModel = (index: number) => {
    const currentModels = watch("models") || [];
    setValue("models", currentModels.filter((_, i) => i !== index));
  };

  const compressBase64Image = (base64: string, maxSize: number = 1024 * 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
      // If image is already small enough, return as-is
      if (base64.length <= maxSize) {
        resolve(base64);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions (max 800x800, maintain aspect ratio)
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels until we get under maxSize
        const qualities = [0.85, 0.7, 0.6, 0.5];
        for (const quality of qualities) {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          if (compressed.length <= maxSize) {
            resolve(compressed);
            return;
          }
        }
        
        // If still too large, use lowest quality
        resolve(canvas.toDataURL('image/jpeg', 0.4));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    });
  };

  const onSubmit = async (data: VehicleFormData) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:83',message:'onSubmit entry',data:{hasVehicle:!!vehicle,vehicleId:vehicle?.id,logoType:typeof data.logo,logoLength:data.logo?data.logo.length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    try {
      // Compress logo if it's too large (>1MB)
      let logo = data.logo && data.logo.trim() !== '' ? data.logo : null;
      if (logo && logo.length > 1024 * 1024) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:120',message:'Logo too large, compressing',data:{originalLength:logo.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        try {
          logo = await compressBase64Image(logo, 1024 * 1024);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:125',message:'Logo compressed',data:{compressedLength:logo.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
        } catch (compressError) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:128',message:'Compression failed',data:{error:compressError instanceof Error?compressError.message:String(compressError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          // If compression fails, set logo to null to avoid database error
          logo = null;
        }
      }
      
      // Ensure logo is properly formatted (null instead of empty string)
      const payload = {
        ...data,
        logo: logo,
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:140',message:'Payload prepared',data:{payloadLogoType:typeof payload.logo,payloadLogoLength:payload.logo?payload.logo.length:0,payloadLogoIsNull:payload.logo===null},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[VehicleForm] Submitting vehicle:', {
          name: payload.name,
          hasLogo: !!payload.logo,
          logoType: payload.logo ? typeof payload.logo : 'none',
          logoLength: payload.logo ? payload.logo.length : 0,
          logoPreview: payload.logo ? payload.logo.substring(0, 50) : 'none',
        });
      }
      
      if (vehicle) {
        // #region agent log
        let jsonStringified;
        try {
          jsonStringified = JSON.stringify(payload);
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:102',message:'Before fetch PUT',data:{jsonLength:jsonStringified.length,vehicleId:vehicle.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        } catch (stringifyError) {
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:102',message:'JSON.stringify error',data:{error:stringifyError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          throw stringifyError;
        }
        // #endregion
        const response = await fetch(`/api/vehicles/${vehicle.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonStringified,
        });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:110',message:'After fetch PUT',data:{responseOk:response.ok,responseStatus:response.status,responseStatusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        if (!response.ok) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:110',message:'Response not OK',data:{status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          const errorData = await response.json().catch((jsonError) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:111',message:'Error response JSON parse failed',data:{error:jsonError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return {};
          });
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/vehicle-form.tsx:112',message:'Error data parsed',data:{errorMessage:errorData.error||errorData.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          throw new Error(errorData.error || errorData.message || "خطا در به‌روزرسانی خودرو");
        }

        const updatedVehicle = await response.json();
        updateVehicle(vehicle.id, updatedVehicle.data);
        await loadVehiclesFromDB();
        
        toast({
          title: "موفق",
          description: "خودرو با موفقیت به‌روزرسانی شد",
        });
      } else {
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || "خطا در ایجاد خودرو");
        }

        const newVehicle = await response.json();
        addVehicle(newVehicle.data);
        await loadVehiclesFromDB();
        
        toast({
          title: "موفق",
          description: "خودرو با موفقیت اضافه شد",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onSuccess?.();
      router.push("/admin/vehicles");
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            اطلاعات خودرو
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام خودرو *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="مثال: BMW"
                className="h-11"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <SingleImageUpload
                image={logo || null}
                onChange={(newLogo) => setValue("logo", newLogo || null)}
                label="لوگو خودرو"
              />
              {errors.logo && (
                <p className="text-sm text-destructive">{errors.logo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">مدل‌های خودرو</Label>
              <span className="text-sm text-muted-foreground">
                {models.length} مدل
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addModel();
                  }
                }}
                placeholder="نام مدل (مثال: X5)"
                className="h-11"
              />
              <Button 
                type="button" 
                onClick={addModel} 
                variant="outline"
                className="h-11 px-4"
                disabled={!modelInput.trim()}
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن
              </Button>
            </div>
            {models.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-4 bg-muted/30 rounded-lg border border-border/30">
                {models.map((model, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium">{model}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeModel(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {models.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border/30 rounded-lg bg-muted/20">
                <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">هنوز مدلی اضافه نشده است</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="space-y-0.5">
              <Label>فعال</Label>
              <p className="text-sm text-muted-foreground">
                خودرو فعال است و در لیست‌ها نمایش داده می‌شود
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pt-4 border-t border-border/30">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          size="lg"
        >
          انصراف
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : vehicle ? (
            "ذخیره تغییرات"
          ) : (
            "افزودن خودرو"
          )}
        </Button>
      </div>
    </form>
  );
}

