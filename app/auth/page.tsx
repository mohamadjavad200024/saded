"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, login, isAuthenticated } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "register") {
        // Validation
        if (!formData.name.trim()) {
          toast({
            title: "خطا",
            description: "لطفاً نام خود را وارد کنید",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!formData.phone.trim() || formData.phone.length < 10) {
          toast({
            title: "خطا",
            description: "لطفاً شماره تماس معتبر وارد کنید",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "خطا",
            description: "رمز عبور باید حداقل 6 کاراکتر باشد",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "خطا",
            description: "رمز عبور و تکرار آن یکسان نیستند",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        await register(formData.name, formData.phone, formData.password);
        
        toast({
          title: "ثبت‌نام موفق",
          description: "حساب کاربری شما با موفقیت ایجاد شد",
        });

        router.push("/");
      } else {
        // Login
        if (!formData.phone.trim() || !formData.password.trim()) {
          toast({
            title: "خطا",
            description: "لطفاً شماره تماس و رمز عبور را وارد کنید",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const success = await login(formData.phone, formData.password);
        
        if (success) {
          toast({
            title: "ورود موفق",
            description: "به ساد خوش آمدید",
          });
          router.push("/");
        } else {
          toast({
            title: "خطا",
            description: "شماره تماس یا رمز عبور اشتباه است",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/30 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === "login" ? "ورود به حساب کاربری" : "ثبت‌نام"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "برای ادامه وارد حساب کاربری خود شوید"
                : "حساب کاربری جدید ایجاد کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    نام و نام خانوادگی
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="مثال: علی احمدی"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required={mode === "register"}
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  شماره تماس
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09123456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  رمز عبور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="حداقل 6 کاراکتر"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={mode === "register" ? 6 : undefined}
                  className="h-11"
                />
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    تکرار رمز عبور
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="رمز عبور را دوباره وارد کنید"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    className="h-11"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  "در حال پردازش..."
                ) : mode === "login" ? (
                  <>
                    ورود
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </>
                ) : (
                  <>
                    ثبت‌نام
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setFormData({
                    name: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === "login" ? (
                  <>
                    حساب کاربری ندارید؟{" "}
                    <span className="text-primary font-semibold">ثبت‌نام کنید</span>
                  </>
                ) : (
                  <>
                    قبلاً ثبت‌نام کرده‌اید؟{" "}
                    <span className="text-primary font-semibold">وارد شوید</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


