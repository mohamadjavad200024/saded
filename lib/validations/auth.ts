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
 * اعتبارسنجی رمز عبور قوی
 * حداقل 8 کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص
 */
export function validateStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("رمز عبور باید حداقل 8 کاراکتر باشد");
  }
  
  if (password.length > 128) {
    errors.push("رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("رمز عبور باید شامل حداقل یک حرف کوچک انگلیسی باشد");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("رمز عبور باید شامل حداقل یک حرف بزرگ انگلیسی باشد");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("رمز عبور باید شامل حداقل یک عدد باشد");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("رمز عبور باید شامل حداقل یک کاراکتر خاص باشد");
  }
  
  // بررسی رمزهای رایج و ضعیف
  const commonPasswords = [
    "password", "12345678", "qwerty", "abc123", "password123",
    "123456789", "1234567890", "password1", "admin123"
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common.toLowerCase()))) {
    errors.push("رمز عبور انتخاب شده بسیار رایج و ناامن است");
  }
  
  return {
    valid: errors.length === 0,
    errors,
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
    .refine((val) => validateIranianPhone(val), {
      message: "شماره تماس معتبر نیست. فرمت صحیح: 09123456789",
    }),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .max(128, "رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد")
    .refine(
      (val) => {
        const validation = validateStrongPassword(val);
        return validation.valid;
      },
      {
        message: "رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد",
      }
    ),
});

/**
 * Schema اعتبارسنجی ورود
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((val) => validateIranianPhone(val), {
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
  // حذف فاصله‌ها و کاراکترهای غیر عددی
  let cleaned = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  
  // حذف +98 و 0098 از ابتدا
  cleaned = cleaned.replace(/^(\+98|0098)/, "");
  
  // اگر با 0 شروع نمی‌شود، 0 اضافه کن
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }
  
  return cleaned;
}

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;

