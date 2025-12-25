"use client";

import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger-client";
import { useAuthStore } from "@/store/auth-store";

// Helper to generate unique IDs
function generateUniqueId(prefix: string = ''): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now()}`;
}

export interface Attachment {
  id: string;
  type: "image" | "file" | "location" | "audio";
  url: string;
  name?: string;
  size?: number;
  duration?: number;
}

export interface UseChatUtilsReturn {
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  showAttachmentOptions: boolean;
  setShowAttachmentOptions: React.Dispatch<React.SetStateAction<boolean>>;
  uploadFile: (file: File, type: "image" | "file" | "audio") => Promise<string>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => Promise<void>;
  handleRemoveAttachment: (id: string) => void;
  handleLocationShare: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  saveRecording: () => Promise<Attachment | null>;
  formatTime: (seconds: number) => string;
  formatFileSize: (bytes: number) => string;
  checkMicrophonePermission: () => Promise<boolean>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useChatUtils(): UseChatUtilsReturn {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const isSavingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File, type: "image" | "file" | "audio", retryCount = 0): Promise<string> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Add userId header if user is available (fallback for session issues)
      const headers: Record<string, string> = {};
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const response = await fetch("/api/chat/upload", {
        method: "POST",
        credentials: "include", // Include cookies for session
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "خطا در آپلود فایل" }));
        throw new Error(error.error || "خطا در آپلود فایل");
      }

      const data = await response.json();
      return data.data.url;
    } catch (error: any) {
      if (retryCount < MAX_RETRIES && (
        error.message?.includes("fetch") || 
        error.message?.includes("network") ||
        error.message?.includes("timeout") ||
        error.code === "NETWORK_ERROR" ||
        error.name === "TypeError"
      )) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        if (retryCount === 0) {
          toast({
            title: "در حال تلاش مجدد...",
            description: "خطا در آپلود فایل. در حال تلاش مجدد...",
            duration: 2000,
          });
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return uploadFile(file, type, retryCount + 1);
      }

      toast({
        title: "خطا در آپلود فایل",
        description: error.message || "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
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
  }, [uploadFile]);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleLocationShare = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const attachment: Attachment = {
            id: `location-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: "location",
            url: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            name: "موقعیت مکانی",
          };
          setAttachments((prev) => [...prev, attachment]);
          setShowAttachmentOptions(false);
        },
        (error) => {
          logger.error("Error getting location:", error);
          toast({
            title: "خطا",
            description: "خطا در دریافت موقعیت مکانی",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "خطا",
        description: "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند",
        variant: "destructive",
      });
    }
  }, [toast]);

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "مرورگر شما پشتیبانی نمی‌کند",
          description: "مرورگر شما از ضبط صدا پشتیبانی نمی‌کند. لطفاً از مرورگر جدیدتری استفاده کنید.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") 
          ? "audio/webm" 
          : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || "audio/webm" 
        });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        logger.error("MediaRecorder error:", event);
        toast({
          title: "خطا در ضبط صدا",
          description: "خطایی در هنگام ضبط صدا رخ داد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
        stopRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setShowAttachmentOptions(false);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "ضبط صدا شروع شد",
        description: "در حال ضبط پیام صوتی...",
      });
    } catch (error: any) {
      let errorMessage = "دسترسی به میکروفون مجاز نیست.";
      let errorDescription = "";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "دسترسی به میکروفون رد شد";
        errorDescription = "لطفاً در تنظیمات مرورگر خود، دسترسی میکروفون را فعال کنید.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "میکروفون یافت نشد";
        errorDescription = "لطفاً مطمئن شوید که میکروفون به دستگاه شما متصل است.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "میکروفون در حال استفاده است";
        errorDescription = "میکروفون توسط برنامه دیگری استفاده می‌شود. لطفاً آن را ببندید.";
      } else {
        errorDescription = "لطفاً دوباره تلاش کنید یا صفحه را رفرش کنید.";
      }

      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        toast({
          title: "ضبط صدا متوقف شد",
          description: "پیام صوتی شما آماده است. می‌توانید آن را ذخیره یا لغو کنید.",
        });
      } catch (error) {
        logger.error("Error stopping recording:", error);
        toast({
          title: "خطا",
          description: "خطایی در توقف ضبط رخ داد.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const cancelRecording = useCallback(() => {
    stopRecording();
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
  }, [audioUrl, stopRecording]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const saveRecording = useCallback(async (): Promise<Attachment | null> => {
    // Prevent concurrent saves
    if (isSavingRef.current) {
      logger.warn("saveRecording already in progress, skipping");
      return null;
    }
    
    if (!audioBlob || !audioUrl) {
      return null;
    }
    
    isSavingRef.current = true;
    
    try {
      let extension = "webm";
      let mimeType = audioBlob.type || "audio/webm";
      
      if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
        extension = "m4a";
      } else if (mimeType.includes("ogg")) {
        extension = "ogg";
      } else if (mimeType.includes("wav")) {
        extension = "wav";
      }

      const audioFile = new File([audioBlob], `audio-${Date.now()}.${extension}`, {
        type: mimeType,
      });

      const uploadedUrl = await uploadFile(audioFile, "audio");

      // Generate truly unique ID
      const uniqueId = generateUniqueId("audio");
      
      const attachment: Attachment = {
        id: uniqueId,
        type: "audio",
        url: uploadedUrl,
        name: `پیام صوتی ${formatTime(recordingTime)}`,
        size: audioBlob.size,
        duration: recordingTime,
      };
      
      // Clean up recording state
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setRecordingTime(0);
      
      // Return attachment - caller should add it to state
      return attachment;
    } catch (error) {
      logger.error("Error saving recording:", error);
      return null;
    } finally {
      isSavingRef.current = false;
    }
  }, [audioBlob, audioUrl, recordingTime, uploadFile, formatTime]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }, []);

  return {
    attachments,
    setAttachments,
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    showAttachmentOptions,
    setShowAttachmentOptions,
    uploadFile,
    handleFileSelect,
    handleRemoveAttachment,
    handleLocationShare,
    startRecording,
    stopRecording,
    cancelRecording,
    saveRecording,
    formatTime,
    formatFileSize,
    checkMicrophonePermission,
    imageInputRef,
    fileInputRef,
  };
}



