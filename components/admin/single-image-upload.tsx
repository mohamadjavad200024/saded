"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SingleImageUploadProps {
  image: string | null;
  onChange: (image: string | null) => void;
  className?: string;
  label?: string;
}

export function SingleImageUpload({
  image,
  onChange,
  className,
  label = "لوگو",
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:27',message:'File selected',data:{fileName:file.name,fileSize:file.size,fileType:file.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
    // #endregion

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطا",
        description: "فقط فایل‌های تصویری مجاز هستند",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از 5 مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Compress and resize image before converting to base64
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:60',message:'Image loaded for compression',data:{originalWidth:img.width,originalHeight:img.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
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

              // Draw and compress
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to base64 with compression (quality: 0.85 = 85%)
              const base64String = canvas.toDataURL('image/jpeg', 0.85);
              
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:90',message:'First compression done',data:{compressedWidth:width,compressedHeight:height,base64Length:base64String.length,isTooLarge:base64String.length>1024*1024},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
              
              // If compressed image is still too large (>1MB), reduce quality further
              if (base64String.length > 1024 * 1024) {
                const compressedString = canvas.toDataURL('image/jpeg', 0.7);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:94',message:'Second compression done',data:{finalBase64Length:compressedString.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
                // #endregion
                resolve(compressedString);
              } else {
                resolve(base64String);
              }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      };

      const compressedBase64 = await compressImage(file);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:108',message:'Compression complete, calling onChange',data:{finalLength:compressedBase64.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      onChange(compressedBase64);
      setUploading(false);
      toast({
        title: "موفق",
        description: "تصویر با موفقیت آپلود شد",
      });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/admin/single-image-upload.tsx:115',message:'Compression error',data:{error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      setUploading(false);
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در آپلود تصویر",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-start gap-4">
        {image ? (
          <div className="relative group">
            <div className="w-24 h-24 rounded-lg border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
              <SafeImage
                src={image}
                alt={label}
                className="w-full h-full object-contain"
                fallback={
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                }
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                {image ? "تغییر لوگو" : "آپلود لوگو"}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 5MB)
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

