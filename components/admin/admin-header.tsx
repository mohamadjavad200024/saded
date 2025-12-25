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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, LogOut, Bell, Search, Lock, MessageCircle, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
}

export function AdminHeader({ onSearch }: AdminHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const { toast } = useToast();

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً رمز عبور جدید را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "خطا",
        description: "رمز عبور باید حداقل 6 کاراکتر باشد",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور جدید و تأیید آن مطابقت ندارند",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingPassword(true);

    try {
      const response = await fetch("/api/admin/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: newPassword,
          currentPassword: currentPassword || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "موفق",
          description: "رمز عبور با موفقیت تغییر کرد",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordDialogOpen(false);
      } else {
        toast({
          title: "خطا",
          description: result.error || "خطا در تغییر رمز عبور",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطا در اتصال به سرور",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/admin/login";
    }
  };

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
                <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)}>
                  <Lock className="ml-2 h-4 w-4" />
                  تغییر رمز عبور
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
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
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              تغییر رمز عبور ادمین
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                رمز عبور فعلی (اختیاری برای اولین بار)
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="رمز عبور فعلی را وارد کنید"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoadingPassword}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoadingPassword}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                رمز عبور جدید <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="رمز عبور جدید را وارد کنید (حداقل 6 کاراکتر)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoadingPassword}
                  className="pr-10"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoadingPassword}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                تأیید رمز عبور جدید <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="رمز عبور جدید را دوباره وارد کنید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoadingPassword}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoadingPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">
                  رمز عبور جدید و تأیید آن مطابقت ندارند
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  رمز عبور جدید معتبر است
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isLoadingPassword}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoadingPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
              >
                {isLoadingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال تغییر...
                  </>
                ) : (
                  "تغییر رمز عبور"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}

