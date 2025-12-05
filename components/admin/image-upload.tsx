"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: "خطا",
        description: `حداکثر ${maxImages} تصویر می‌توانید آپلود کنید`,
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "خطا",
          description: "فقط فایل‌های تصویری مجاز هستند",
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطا",
          description: "حجم فایل باید کمتر از 5 مگابایت باشد",
          variant: "destructive",
        });
        continue;
      }

      setUploading(i);
      
      try {
        // Convert to base64 for now (in production, upload to a server)
        const base64 = await fileToBase64(file);
        const newImages = [...images, base64];
        onChange(newImages);
        
        toast({
          title: "موفق",
          description: "تصویر با موفقیت آپلود شد",
        });
      } catch (error) {
        toast({
          title: "خطا",
          description: "خطا در آپلود تصویر",
          variant: "destructive",
        });
      } finally {
        setUploading(null);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Use high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          
          // Draw image with high quality
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality setting
          const base64 = canvas.toDataURL("image/jpeg", quality);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    // For images, use compression to maintain quality while reducing size
    if (file.type.startsWith("image/")) {
      try {
        return await compressImage(file, 1920, 0.92);
      } catch (error) {
        // Fallback to original method if compression fails
        console.warn("Image compression failed, using original:", error);
      }
    }
    
    // Fallback for non-images or if compression fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Single Upload Area */}
      <div
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          uploading !== null 
            ? "border-muted-foreground/30 bg-muted/30 cursor-not-allowed" 
            : "border-border/30 bg-muted/20",
          images.length > 0 && "border-primary/30 bg-primary/5"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            {uploading !== null ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium text-foreground">در حال آپلود...</p>
              </>
            ) : (
              <>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                  <div className="relative bg-primary/10 rounded-full p-4">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  آپلود تصاویر محصول
                </p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  تصاویر را اینجا بکشید یا کلیک کنید
                </p>
                <Button type="button" variant="default" size="lg" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  انتخاب تصاویر
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg border-2 border-border/30 overflow-hidden bg-muted shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={image}
                    alt={`تصویر ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary text-primary-foreground shadow-sm">
                        اصلی
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {images.length < maxImages && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={uploading !== null}
                  className={cn(
                    "aspect-square rounded-lg border-2 border-dashed border-border/30 bg-muted/50 hover:bg-muted hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-2 group",
                    uploading !== null && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {uploading !== null ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
                        افزودن
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            {images.length < maxImages && (
              <div className="flex items-center justify-center pt-2 border-t border-border/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={uploading !== null}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  افزودن تصویر بیشتر ({images.length}/{maxImages})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium mb-1">راهنمای آپلود:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>می‌توانید تا {maxImages} تصویر آپلود کنید</li>
            <li>فرمت‌های مجاز: JPG, PNG, WebP</li>
            <li>حداکثر حجم هر فایل: 5 مگابایت</li>
            <li>اولین تصویر به عنوان تصویر اصلی نمایش داده می‌شود</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


