import * as z from "zod";

/**
 * Schema اعتبارسنجی محصول
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "نام محصول الزامی است")
    .max(255, "نام محصول نمی‌تواند بیشتر از 255 کاراکتر باشد"),
  description: z
    .string()
    .min(1, "توضیحات محصول الزامی است")
    .max(5000, "توضیحات محصول نمی‌تواند بیشتر از 5000 کاراکتر باشد"),
  price: z
    .number()
    .positive("قیمت محصول باید مثبت باشد")
    .max(1000000000, "قیمت محصول نمی‌تواند بیشتر از 1 میلیارد تومان باشد"),
  originalPrice: z
    .number()
    .positive()
    .max(1000000000)
    .optional()
    .nullable(),
  brand: z
    .string()
    .min(1, "برند محصول الزامی است")
    .max(100, "برند محصول نمی‌تواند بیشتر از 100 کاراکتر باشد"),
  category: z
    .string()
    .min(1, "دسته‌بندی محصول الزامی است")
    .max(100, "دسته‌بندی محصول نمی‌تواند بیشتر از 100 کاراکتر باشد"),
  vehicle: z
    .string()
    .max(255, "شناسه خودرو نمی‌تواند بیشتر از 255 کاراکتر باشد")
    .optional()
    .nullable(),
  model: z
    .string()
    .max(255, "مدل نمی‌تواند بیشتر از 255 کاراکتر باشد")
    .optional()
    .nullable(),
  vin: z
    .string()
    .max(50, "VIN نمی‌تواند بیشتر از 50 کاراکتر باشد")
    .optional()
    .nullable(),
  vinEnabled: z.boolean().default(false),
  airShippingEnabled: z.boolean().default(true),
  seaShippingEnabled: z.boolean().default(true),
  airShippingCost: z
    .number()
    .nonnegative()
    .max(10000000)
    .optional()
    .nullable(),
  seaShippingCost: z
    .number()
    .nonnegative()
    .max(10000000)
    .optional()
    .nullable(),
  stockCount: z
    .number()
    .int("تعداد موجودی باید عدد صحیح باشد")
    .nonnegative("تعداد موجودی نمی‌تواند منفی باشد")
    .default(0),
  inStock: z.boolean().default(true),
  enabled: z.boolean().default(true),
  images: z
    .array(z.string().url("آدرس تصویر نامعتبر است"))
    .min(1, "حداقل یک تصویر الزامی است")
    .max(20, "نمی‌توانید بیشتر از 20 تصویر اضافه کنید"),
  tags: z.array(z.string()).max(50).default([]),
  specifications: z.record(z.any()).default({}),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Schema برای به‌روزرسانی محصول (همه فیلدها اختیاری)
 */
export const productUpdateSchema = productSchema.partial();

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

/**
 * Schema برای فیلتر محصولات
 */
export const productFiltersSchema = z.object({
  search: z.string().max(200).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  brands: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(1000).default(50),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;


