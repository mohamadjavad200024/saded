import * as z from "zod";

/**
 * Schema اعتبارسنجی فرم Checkout
 */
export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().optional(), // نام خانوادگی اختیاری اما پیشنهادی
  phone: z
    .string()
    .min(10, "شماره تلفن باید حداقل 10 رقم باشد")
    .regex(/^[0-9]+$/, "شماره تلفن باید فقط عدد باشد"),
  email: z
    .union([z.string().email("ایمیل نامعتبر است"), z.literal("")])
    .optional(), // ایمیل اختیاری
  addressType: z.enum(["location", "postalCode", "address"], {
    required_error: "نوع آدرس را انتخاب کنید",
  }),
  location: z.string().optional(), // لوکیشن (اختیاری)
  address: z.string().optional(), // آدرس کامل (اختیاری)
  city: z.string().optional(), // شهر (اختیاری)
  postalCode: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^[0-9]{10}$/.test(val), {
      message: "کد پستی باید 10 رقم باشد",
    }),
  province: z.string().optional(),
  notes: z
    .string()
    .max(500, "یادداشت نمی‌تواند بیشتر از 500 کاراکتر باشد")
    .optional(),
}).superRefine((data, ctx) => {
  // اگر نوع آدرس location است، location باید پر باشد
  if (data.addressType === "location") {
    if (!data.location || data.location.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "لطفاً لوکیشن را وارد کنید",
        path: ["location"],
      });
    }
  }
  // اگر نوع آدرس postalCode است، postalCode باید پر باشد
  if (data.addressType === "postalCode") {
    if (!data.postalCode || data.postalCode.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "لطفاً کد پستی را وارد کنید",
        path: ["postalCode"],
      });
    } else if (!/^[0-9]{10}$/.test(data.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "کد پستی باید 10 رقم باشد",
        path: ["postalCode"],
      });
    }
  }
  // اگر نوع آدرس address است، address باید پر باشد
  if (data.addressType === "address") {
    if (!data.address || data.address.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "آدرس باید حداقل 5 کاراکتر باشد",
        path: ["address"],
      });
    }
  }
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Sanitize و پاکسازی داده‌های فرم
 */
export function sanitizeCheckoutInput(data: CheckoutFormData): CheckoutFormData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName?.trim() || "",
    phone: data.phone.replace(/\D/g, ""),
    email: data.email?.trim().toLowerCase() || "",
    addressType: data.addressType,
    location: data.location?.trim() || "",
    address: data.address?.trim() || "",
    city: data.city?.trim() || "",
    postalCode: data.postalCode?.replace(/\D/g, "") || "",
    province: data.province?.trim() || "",
    notes: data.notes?.trim() || "",
  };
}
