"use client";

import { useState } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/store/admin-store";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Trash2, Database, Bell, Palette, Download, Upload, Info, Settings, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FooterContentEditor } from "@/components/admin/footer-content-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const { toast } = useToast();
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [aboutContent, setAboutContent] = useState("");
  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutSaving, setAboutSaving] = useState(false);

  // Ensure settings has default values
  const safeSettings = {
    itemsPerPage: settings?.itemsPerPage ?? 10,
    showNotifications: settings?.showNotifications ?? true,
    theme: settings?.theme ?? "system",
    lastUpdated: settings?.lastUpdated,
  };

  const handleSave = () => {
    toast({
      title: "موفق",
      description: "تنظیمات با موفقیت ذخیره شد",
    });
  };

  const handleClearData = () => {
    localStorage.clear();
    toast({
      title: "موفق",
      description: "همه داده‌ها پاک شدند",
    });
    setClearDataDialogOpen(false);
    window.location.reload();
  };

  // Load about content
  React.useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const response = await fetch("/api/settings/about");
        if (response.ok) {
          const data = await response.json();
          setAboutContent(data.data?.content || "");
        }
      } catch (error) {
        console.error("Error loading about content:", error);
      } finally {
        setAboutLoading(false);
      }
    };
    loadAboutContent();
  }, []);

  const handleSaveAbout = async () => {
    setAboutSaving(true);
    try {
      const response = await fetch("/api/settings/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: aboutContent }),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "محتوای درباره ما با موفقیت ذخیره شد",
        });
      } else {
        const error = await response.json();
        toast({
          title: "خطا",
          description: error.error || "خطا در ذخیره محتوا",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره محتوا",
        variant: "destructive",
      });
    } finally {
      setAboutSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          تنظیمات
        </h1>
        <p className="text-muted-foreground mt-1">
          مدیریت تنظیمات پنل ادمین
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              تنظیمات عمومی
            </CardTitle>
            <CardDescription>
              تنظیمات کلی پنل مدیریت
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="itemsPerPage">تعداد آیتم در هر صفحه</Label>
              <Select
                value={safeSettings.itemsPerPage.toString()}
                onValueChange={(value) =>
                  updateSettings({ itemsPerPage: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>اعلان‌ها</Label>
                <p className="text-sm text-muted-foreground">
                  نمایش اعلان‌ها برای رویدادهای مهم
                </p>
              </div>
              <Switch
                checked={safeSettings.showNotifications}
                onCheckedChange={(checked) =>
                  updateSettings({ showNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              ظاهر
            </CardTitle>
            <CardDescription>
              تنظیمات تم و ظاهر پنل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="theme">تم</Label>
              <Select
                value={safeSettings.theme}
                onValueChange={(value: "light" | "dark" | "system") =>
                  updateSettings({ theme: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">روشن</SelectItem>
                  <SelectItem value="dark">تاریک</SelectItem>
                  <SelectItem value="system">سیستمی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              مدیریت داده‌ها
            </CardTitle>
            <CardDescription>
              پشتیبان‌گیری و مدیریت داده‌ها
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button variant="outline" className="w-full justify-start">
              <Download className="ml-2 h-4 w-4" />
              دانلود پشتیبان
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="ml-2 h-4 w-4" />
              بازگردانی پشتیبان
            </Button>
            <Separator />
            <Dialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="ml-2 h-4 w-4" />
                  پاک کردن همه داده‌ها
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>پاک کردن همه داده‌ها</DialogTitle>
                  <DialogDescription>
                    آیا از پاک کردن همه داده‌ها اطمینان دارید؟ این عمل قابل بازگشت نیست و همه
                    اطلاعات شامل محصولات، سفارشات و کاربران حذف خواهند شد.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setClearDataDialogOpen(false)}
                  >
                    انصراف
                  </Button>
                  <Button variant="destructive" onClick={handleClearData}>
                    پاک کردن
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Footer Content Editor */}
        <div className="md:col-span-2">
          <FooterContentEditor />
        </div>

        {/* About Us Content */}
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              محتوای درباره ما
            </CardTitle>
            <CardDescription>
              ویرایش محتوای صفحه "درباره ما"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {aboutLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="aboutContent">محتوا</Label>
                  <Textarea
                    id="aboutContent"
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    placeholder="محتوای صفحه درباره ما را اینجا وارد کنید..."
                    className="min-h-[200px] font-sans"
                    rows={10}
                  />
                  <p className="text-sm text-muted-foreground">
                    می‌توانید از چند خط استفاده کنید. محتوا به صورت خودکار در صفحه "درباره ما" نمایش داده می‌شود.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveAbout} 
                    disabled={aboutSaving}
                  >
                    {aboutSaving ? (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        ذخیره محتوا
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              اطلاعات سیستم
            </CardTitle>
            <CardDescription>
              اطلاعات و آمار سیستم
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">نسخه:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">آخرین بروزرسانی:</span>
                <span className="font-medium">
                  {safeSettings.lastUpdated
                    ? new Date(safeSettings.lastUpdated).toLocaleDateString("fa-IR")
                    : "-"}
                </span>
              </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleSave}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بررسی بروزرسانی
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="ml-2 h-4 w-4" />
          ذخیره تنظیمات
        </Button>
      </div>
    </div>
  );
}

