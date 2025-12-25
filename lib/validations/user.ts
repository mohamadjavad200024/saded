import * as z from "zod";
import { validateIranianPhone } from "./auth";

/**
 * Schema اعتبارسنجی کاربر
 */
export const userSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام نمی‌تواند بیشتر از 100 کاراکتر باشد"),
  email: z
    .string()
    .email("ایمیل نامعتبر است")
    .max(255, "ایمیل نمی‌تواند بیشتر از 255 کاراکتر باشد"),
  phone: z
    .string()
    .refine(
      (val) => validateIranianPhone(val),
      "شماره تماس معتبر نیست. فرمت صحیح: 09123456789"
    )
    .optional()
    .nullable(),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد")
    .optional(),
  role: z.enum(["admin", "moderator", "user"]).default("user"),
  address: z.string().max(500).optional().nullable(),
  enabled: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;

/**
 * Schema برای ایجاد کاربر (ایمیل و رمز عبور الزامی)
 */
export const createUserSchema = userSchema.extend({
  email: z.string().email("ایمیل نامعتبر است"),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Schema برای به‌روزرسانی کاربر
 */
export const updateUserSchema = userSchema
  .partial()
  .extend({
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
      .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد")
      .optional(),
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;


