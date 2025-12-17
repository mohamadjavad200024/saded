"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProfileContent() {
  const { user, logout } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>پروفایل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">نام</div>
            <div className="font-medium">{user?.name || "-"}</div>
            <div className="text-sm text-muted-foreground mt-4">شماره تماس</div>
            <div className="font-medium">{(user as any)?.phone || "-"}</div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/orders">سفارش‌های من</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/chat">پشتیبانی (چت)</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
            }}
          >
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requireAuth>
      <ProfileContent />
    </ProtectedRoute>
  );
}


