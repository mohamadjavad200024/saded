import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger-client";
import { formatTime } from "@/lib/chat/chat-helpers";
import type { Attachment } from "@/components/chat/chat-types";

export function useChatRecording(
  uploadFile: (file: File, type: "image" | "file" | "audio", retryCount?: number) => Promise<string>,
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>,
  handleSendMessage: () => void
) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "خطا",
          description: "مرورگر شما از ضبط صدا پشتیبانی نمی‌کند",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordingPermission(true);
      setShowPermissionGuide(false);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
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

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "ضبط صدا شروع شد",
        description: "در حال ضبط پیام صوتی...",
      });
    } catch (error: any) {
      logger.error("Error starting recording:", error);
      setRecordingPermission(false);

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
      } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
        errorMessage = "تنظیمات میکروفون پشتیبانی نمی‌شود";
        errorDescription = "لطفاً از میکروفون دیگری استفاده کنید.";
      } else {
        errorDescription = "لطفاً دوباره تلاش کنید یا صفحه را رفرش کنید.";
      }

      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive",
        duration: 5000,
      });

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setShowPermissionGuide(true);
      }
    }
  };

  const stopRecording = () => {
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
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
  };

  const saveRecording = async () => {
    logger.info("saveRecording called", { hasAudioBlob: !!audioBlob, hasAudioUrl: !!audioUrl });
    console.log("[Voice Widget] saveRecording called", { hasAudioBlob: !!audioBlob, hasAudioUrl: !!audioUrl, audioBlobSize: audioBlob?.size, audioUrl });

    if (!audioBlob || !audioUrl) {
      logger.warn("No audio blob or URL available");
      console.log("[Voice Widget] No audio blob or URL available, returning");
      alert("هیچ ضبط صوتی موجود نیست");
      return;
    }

    try {
      console.log("[Voice Widget] Starting upload...");
      let extension = "webm";
      let mimeType = audioBlob.type || "audio/webm";

      if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
        extension = "m4a";
      } else if (mimeType.includes("ogg")) {
        extension = "ogg";
      } else if (mimeType.includes("wav")) {
        extension = "wav";
      } else if (mimeType.includes("webm")) {
        extension = "webm";
      }

      const audioFile = new File([audioBlob], `audio-${Date.now()}.${extension}`, {
        type: mimeType,
      });

      console.log("[Voice Widget] Uploading audio file...");
      const uploadedUrl = await uploadFile(audioFile, "audio");
      console.log("[Voice Widget] Upload successful, URL:", uploadedUrl);

      const attachment: Attachment = {
        id: Date.now().toString(),
        type: "audio",
        url: uploadedUrl,
        name: `پیام صوتی ${formatTime(recordingTime)}`,
        size: audioBlob.size,
        duration: recordingTime,
      };
      console.log("[Voice Widget] Adding attachment:", attachment);
      setAttachments((prev) => {
        const newAttachments = [...prev, attachment];
        console.log("[Voice Widget] New attachments:", newAttachments);
        return newAttachments;
      });
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setRecordingTime(0);

      console.log("[Voice Widget] Auto-sending message...");
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    } catch (error) {
      // Error already handled in uploadFile
    }
  };

  return {
    isRecording,
    recordingTime,
    audioUrl,
    showPermissionGuide,
    setShowPermissionGuide,
    checkMicrophonePermission,
    startRecording,
    stopRecording,
    cancelRecording,
    saveRecording,
  };
}

