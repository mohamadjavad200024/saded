export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface Attachment {
  id: string;
  type: "image" | "file" | "location" | "audio";
  url?: string;
  name?: string;
  size?: number;
  duration?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  attachments?: Attachment[];
  status?: MessageStatus;
}

