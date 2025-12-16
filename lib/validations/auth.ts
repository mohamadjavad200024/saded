import * as z from "zod";

/**
 * اعتبارسنجی شماره تماس ایرانی
 * فرمت‌های معتبر: 09123456789, 9123456789, +989123456789
 */
export function validateIranianPhone(phone: string): boolean {
  // حذف فاصله‌ها و کاراکترهای غیر عددی
  const cleaned = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  
  // حذف +98 و 0098 از ابتدا
  let normalized = cleaned.replace(/^(\+98|0098)/, "");
  
  // اگر با 0 شروع می‌شود، 0 را حذف کن
  if (normalized.startsWith("0")) {
    normalized = normalized.substring(1);
  }
  
  // باید 10 رقم باشد و با 9 شروع شود
  return /^9\d{9}$/.test(normalized);
}

/**
 * اعتبارسنجی رمز عبور
 * فقط طول را بررسی می‌کند - حداقل 6 کاراکتر
 */
export function validateStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("رمز عبور باید حداقل 6 کاراکتر باشد");
    return { valid: false, errors };
  }
  
  if (password.length > 128) {
    errors.push("رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد");
    return { valid: false, errors };
  }
  
  // هیچ محدودیتی روی نوع کاراکترها نیست - فقط طول مهم است
  
  return {
    valid: true,
    errors: [],
  };
}

/**
 * Schema اعتبارسنجی ثبت‌نام
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام نمی‌تواند بیشتر از 100 کاراکتر باشد")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "نام باید فقط شامل حروف فارسی یا انگلیسی باشد"),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((val) => {
      try {
        return validateIranianPhone(val);
      } catch {
        return false;
      }
    }, {
      message: "شماره تماس معتبر نیست. فرمت صحیح: 09123456789",
    }),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد"),
});

/**
 * Schema اعتبارسنجی ورود
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((val) => {
      try {
        return validateIranianPhone(val);
      } catch {
        return false;
      }
    }, {
      message: "شماره تماس معتبر نیست. فرمت صحیح: 09123456789",
    }),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد"),
});

/**
 * نرمال‌سازی شماره تماس به فرمت استاندارد (09123456789)
 */
export function normalizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") {
    throw new Error("شماره تماس معتبر نیست");
  }

  // حذف فاصله‌ها و کاراکترهای غیر عددی (به جز +)
  let cleaned = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  
  if (!cleaned || cleaned.length === 0) {
    throw new Error("شماره تماس معتبر نیست");
  }
  
  // حذف +98 و 0098 از ابتدا
  cleaned = cleaned.replace(/^(\+98|0098)/, "");
  
  // اگر با 0 شروع نمی‌شود، 0 اضافه کن
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }
  
  // بررسی نهایی
  if (cleaned.length < 11 || cleaned.length > 11) {
    throw new Error("شماره تماس باید 11 رقم باشد");
  }
  
  return cleaned;
}

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;

