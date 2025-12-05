import * as z from "zod";

/**
 * Schema اعتبارسنجی فرم Checkout
 */
export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: z
    .string()
    .min(10, "شماره تلفن باید حداقل 10 رقم باشد")
    .regex(/^[0-9]+$/, "شماره تلفن باید فقط عدد باشد"),
  email: z
    .union([z.string().email("ایمیل نامعتبر است"), z.literal("")])
    .optional(),
  address: z.string().min(5, "آدرس باید حداقل 5 کاراکتر باشد"),
  city: z.string().min(1, "شهر الزامی است"),
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
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Sanitize و پاکسازی داده‌های فرم
 */
export function sanitizeCheckoutInput(data: CheckoutFormData): CheckoutFormData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone.replace(/\D/g, ""),
    email: data.email?.trim().toLowerCase() || "",
    address: data.address.trim(),
    city: data.city.trim(),
    postalCode: data.postalCode?.replace(/\D/g, "") || "",
    province: data.province?.trim() || "",
    notes: data.notes?.trim() || "",
  };
}
