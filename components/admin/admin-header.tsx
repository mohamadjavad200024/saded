"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AdminChat } from "@/components/admin/admin-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Bell, Search, Settings, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
}

export function AdminHeader({ onSearch }: AdminHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch total unread messages count
  const fetchTotalUnreadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/unread-count?all=true");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.chats) {
          // Sum up all unread counts from all chats
          const total = data.data.chats.reduce(
            (sum: number, chat: { unreadCount: number }) => sum + (chat.unreadCount || 0),
            0
          );
          setTotalUnreadCount(total);
        }
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  // Poll for unread count updates
  useEffect(() => {
    // Initial fetch
    fetchTotalUnreadCount();

    // Poll every 5 seconds when chat is closed, every 10 seconds when open
    const pollInterval = chatOpen ? 10000 : 5000;
    const interval = setInterval(() => {
      fetchTotalUnreadCount();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchTotalUnreadCount, chatOpen]);

  // Update unread count when chat state changes
  useEffect(() => {
    // Refresh count when chat opens or closes
    fetchTotalUnreadCount();
  }, [chatOpen, fetchTotalUnreadCount]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Search */}
        {onSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جستجو..."
                className="pr-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mr-auto">
          {/* Chat */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChatOpen(true)}
            className="relative"
            title="چت با کاربران"
          >
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center border-2 border-background shadow-sm">
                !
              </span>
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* User Menu - Only render after mount to avoid hydration mismatch */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="ml-2 h-4 w-4" />
                  تنظیمات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" disabled>
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <AdminChat isOpen={chatOpen} onOpenChange={setChatOpen} />
    </header>
  );
}

