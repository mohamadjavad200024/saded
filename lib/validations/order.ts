import * as z from "zod";

/**
 * Schema برای آیتم سفارش
 */
export const orderItemSchema = z.object({
  id: z.string().min(1, "شناسه محصول الزامی است"),
  name: z.string().min(1, "نام محصول الزامی است"),
  price: z
    .number()
    .positive("قیمت محصول باید مثبت باشد")
    .max(100000000, "قیمت محصول نمی‌تواند بیشتر از 100 میلیون تومان باشد"),
  quantity: z
    .number()
    .int("تعداد باید عدد صحیح باشد")
    .positive("تعداد باید مثبت باشد")
    .max(1000, "تعداد نمی‌تواند بیشتر از 1000 باشد"),
  image: z.string().optional().nullable(),
});

/**
 * Schema برای آدرس ارسال
 */
export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: z
    .string()
    .min(10, "شماره تلفن باید حداقل 10 رقم باشد")
    .regex(/^[0-9]+$/, "شماره تلفن باید فقط عدد باشد"),
  email: z
    .string()
    .email("ایمیل نامعتبر است")
    .optional()
    .nullable(),
  address: z.string().min(5, "آدرس باید حداقل 5 کاراکتر باشد"),
  city: z.string().min(1, "شهر الزامی است"),
  postalCode: z
    .string()
    .regex(/^[0-9]{10}$/, "کد پستی باید 10 رقم باشد")
    .optional()
    .nullable(),
  province: z.string().optional().nullable(),
});

/**
 * Schema برای ایجاد سفارش
 */
export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "حداقل یک آیتم در سفارش الزامی است")
    .max(100, "نمی‌توانید بیشتر از 100 آیتم در یک سفارش داشته باشید"),
  total: z
    .number()
    .positive("مبلغ کل باید مثبت باشد")
    .max(100000000, "مبلغ سفارش نمی‌تواند بیشتر از 100 میلیون تومان باشد"),
  shippingCost: z
    .number()
    .nonnegative("هزینه ارسال نمی‌تواند منفی باشد")
    .max(10000000, "هزینه ارسال نمی‌تواند بیشتر از 10 میلیون تومان باشد"),
  shippingMethod: z.enum(["air", "sea"], {
    errorMap: () => ({ message: "روش ارسال باید air یا sea باشد" }),
  }),
  shippingAddress: shippingAddressSchema,
  notes: z
    .string()
    .max(500, "یادداشت نمی‌تواند بیشتر از 500 کاراکتر باشد")
    .optional()
    .nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Schema برای به‌روزرسانی وضعیت سفارش
 */
export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

/**
 * Schema برای به‌روزرسانی سفارش
 */
export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  notes: z.string().max(500).optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;


