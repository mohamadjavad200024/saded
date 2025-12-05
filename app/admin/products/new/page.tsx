"use client";

import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryStore } from "@/store/category-store";
import { useEffect } from "react";

export default function NewProductPage() {
  const { loadCategoriesFromDB } = useCategoryStore();

  // Load categories from database on mount
  useEffect(() => {
    loadCategoriesFromDB();
  }, [loadCategoriesFromDB]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>فرم محصول</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}


