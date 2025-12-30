"use client";

import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OnlineStatusBadge } from "@/components/chat/online-status-badge";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ChatHeaderProps {
  step: "chat";
  isOnline: boolean;
  lastSeen: Date | string | null;
  customerInfo: {
    name: string;
    phone: string;
  };
  onEditInfo: () => void;
  orderInfo?: {
    orderNumber?: string;
    items?: Array<{ id: string; name: string; quantity: number; price: number }>;
    total?: number;
  };
}

export function ChatHeader({ step, isOnline, lastSeen, customerInfo, onEditInfo, orderInfo }: ChatHeaderProps) {
  return (
    <SheetHeader className="px-4 sm:px-6 py-2 border-b border-border/40">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2 flex-wrap">
            <span>خرید سریع</span>
            {step === "chat" && (
              <OnlineStatusBadge 
                isOnline={isOnline} 
                lastSeen={lastSeen instanceof Date ? lastSeen.toISOString() : (typeof lastSeen === 'string' ? lastSeen : null)} 
                showText={false} 
              />
            )}
            {orderInfo?.orderNumber && (
              <Badge variant="outline" className="text-xs font-mono flex items-center gap-1.5 bg-primary/5 border-primary/20 text-primary">
                <Package className="h-3 w-3" />
                <span className="hidden sm:inline">سفارش:</span>
                <span>{orderInfo.orderNumber}</span>
              </Badge>
            )}
          </SheetTitle>
          {orderInfo?.orderNumber && (
            <p className="text-xs text-muted-foreground mt-1">
              {orderInfo.items && orderInfo.items.length > 0 && (
                <span>{orderInfo.items.length} محصول • </span>
              )}
              {orderInfo.total && (
                <span>جمع: {orderInfo.total.toLocaleString("fa-IR")} تومان</span>
              )}
            </p>
          )}
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

