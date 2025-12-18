"use client";

import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OnlineStatusBadge } from "@/components/chat/online-status-badge";

interface ChatHeaderProps {
  step: "chat";
  isOnline: boolean;
  lastSeen: Date | string | null;
  customerInfo: {
    name: string;
    phone: string;
  };
  onEditInfo: () => void;
}

export function ChatHeader({ step, isOnline, lastSeen, customerInfo, onEditInfo }: ChatHeaderProps) {
  return (
    <SheetHeader className="px-4 sm:px-6 py-2 border-b border-border/40">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            خرید سریع
            {step === "chat" && (
              <OnlineStatusBadge 
                isOnline={isOnline} 
                lastSeen={lastSeen instanceof Date ? lastSeen.toISOString() : (typeof lastSeen === 'string' ? lastSeen : null)} 
                showText={false} 
              />
            )}
          </SheetTitle>
        </div>
        {step === "chat" && customerInfo.name && customerInfo.phone && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditInfo}
            className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
            title="تغییر اطلاعات"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        )}
      </div>
    </SheetHeader>
  );
}

