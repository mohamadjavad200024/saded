import * as z from "zod";

/**
 * Schema اعتبارسنجی دسته‌بندی
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "نام دسته‌بندی الزامی است")
    .max(100, "نام دسته‌بندی نمی‌تواند بیشتر از 100 کاراکتر باشد"),
  description: z
    .string()
    .max(1000, "توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد")
    .optional()
    .nullable(),
  slug: z
    .string()
    .max(100, "slug نمی‌تواند بیشتر از 100 کاراکتر باشد")
    .regex(/^[a-z0-9-]+$/, "slug باید فقط شامل حروف کوچک، اعداد و خط تیره باشد")
    .optional()
    .nullable(),
  image: z
    .string()
    .url("آدرس تصویر نامعتبر است")
    .optional()
    .nullable(),
  icon: z
    .string()
    .max(50, "نام آیکون نمی‌تواند بیشتر از 50 کاراکتر باشد")
    .optional()
    .nullable(),
  enabled: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/**
 * Schema برای به‌روزرسانی دسته‌بندی
 */
export const categoryUpdateSchema = categorySchema.partial();

export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;


