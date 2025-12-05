"use client";

import { use } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryStore } from "@/store/category-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const category = useCategoryStore((state) => state.getCategory(id));

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ویرایش دسته‌بندی
          </h1>
          <p className="text-muted-foreground mt-1">
            ویرایش اطلاعات: {category.name}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/categories">
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فرم ویرایش دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  );
}

