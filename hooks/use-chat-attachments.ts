import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger-client";
import type { Attachment } from "@/components/chat/chat-types";

export function useChatAttachments(
  uploadFile: (file: File, type: "image" | "file" | "audio", retryCount?: number) => Promise<string>,
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>,
  setShowAttachmentOptions: React.Dispatch<React.SetStateAction<boolean>>,
  handleSendMessage: () => void
) {
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const fileUrl = await uploadFile(file, type);

        const attachment: Attachment = {
          id: Date.now().toString() + Math.random(),
          type,
          name: file.name,
          size: file.size,
          url: fileUrl,
        };
        setAttachments((prev) => [...prev, attachment]);
      } catch (error) {
        // Error already handled in uploadFile
      }
    }

    e.target.value = "";
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleLocationShare = () => {
    logger.info("handleLocationShare called");
    console.log("[Location Widget] handleLocationShare called");

    if (!navigator.geolocation) {
      logger.warn("Geolocation not supported");
      console.log("[Location Widget] Geolocation not supported");
      toast({
        title: "خطا",
        description: "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند",
        variant: "destructive",
      });
      return;
    }

    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    console.log("[Location Widget] Protocol:", window.location.protocol, "Hostname:", window.location.hostname, "IsSecure:", isSecure);
    if (!isSecure) {
      logger.warn("Not on secure origin");
      console.log("[Location Widget] Not on secure origin");
      toast({
        title: "خطا",
        description: "برای استفاده از موقعیت‌یابی باید از HTTPS استفاده کنید. لطفاً از آدرس امن سایت استفاده کنید.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "در حال دریافت موقعیت...",
      description: "لطفاً اجازه دسترسی به موقعیت را در مرورگر بدهید",
      duration: 3000,
    });

    logger.info("Requesting geolocation permission...");
    console.log("[Location Widget] Requesting geolocation permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        logger.info("Location received:", position.coords);
        console.log("[Location Widget] Position received:", position.coords);
        const attachment: Attachment = {
          id: Date.now().toString(),
          type: "location",
          url: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
          name: "موقعیت مکانی",
        };
        console.log("[Location Widget] Adding attachment:", attachment);
        setAttachments((prev) => {
          const newAttachments = [...prev, attachment];
          console.log("[Location Widget] New attachments:", newAttachments);
          return newAttachments;
        });
        setShowAttachmentOptions(false);

        console.log("[Location Widget] Auto-sending message...");
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      },
      (error) => {
        logger.error("Error getting location:", error);
        let errorMessage = "خطا در دریافت موقعیت مکانی";
        if (error.code === 1) {
          errorMessage = "دسترسی به موقعیت رد شد. لطفاً در تنظیمات مرورگر اجازه دسترسی به موقعیت را فعال کنید.";
        } else if (error.code === 2) {
          errorMessage = "موقعیت در دسترس نیست. لطفاً مطمئن شوید که GPS فعال است.";
        } else if (error.code === 3) {
          errorMessage = "دریافت موقعیت زمان‌بر شد. لطفاً دوباره تلاش کنید.";
        }
        toast({
          title: "خطا",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return {
    imageInputRef,
    fileInputRef,
    handleFileSelect,
    handleRemoveAttachment,
    handleLocationShare,
  };
}

