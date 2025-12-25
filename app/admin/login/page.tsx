"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated, hasCheckedAuth } = useAuthStore();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (hasCheckedAuth && isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    }
  }, [hasCheckedAuth, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً رمز عبور را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "موفق",
          description: "ورود با موفقیت انجام شد",
        });
        
        // Update store immediately from response
        const { useAuthStore } = await import("@/store/auth-store");
        if (result.data?.user) {
          useAuthStore.setState({
            user: {
              id: result.data.user.id,
              name: result.data.user.name,
              phone: result.data.user.phone || "",
              role: result.data.user.role || "admin",
              createdAt: result.data.user.createdAt || new Date().toISOString(),
            },
            isAuthenticated: true,
            hasCheckedAuth: true, // Mark as checked since we got user from server
          });
        }
        
        // Redirect immediately - cookie is set by server
        router.push("/admin");
      } else {
        toast({
          title: "خطا",
          description: result.error || "رمز عبور اشتباه است",
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ورود ادمین</CardTitle>
          <CardDescription>
            برای دسترسی به پنل مدیریت، رمز عبور ادمین را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور ادمین</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="text-center"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                "ورود"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

