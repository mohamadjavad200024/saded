/**
 * زرین‌پال Payment Gateway Integration
 * 
 * این فایل شامل توابع برای اتصال به درگاه پرداخت زرین‌پال است
 */

// برای development، اگر Merchant ID تنظیم نشده باشد، از یک مقدار تست استفاده می‌کنیم
// در production، حتماً باید ZARINPAL_MERCHANT_ID در .env.local تنظیم شود
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || 
  (process.env.NODE_ENV !== "production" ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "");
const ZARINPAL_SANDBOX = process.env.NODE_ENV !== "production";
const ZARINPAL_API_URL = ZARINPAL_SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://api.zarinpal.com/pg/v4/payment";

export interface PaymentRequest {
  amount: number; // مبلغ به تومان
  description: string; // توضیحات سفارش
  callbackUrl: string; // آدرس بازگشت
  mobile?: string; // شماره موبایل (اختیاری)
  email?: string; // ایمیل (اختیاری)
}

export interface PaymentResponse {
  status: number;
  authority?: string;
  errors?: {
    code: number;
    message: string;
    validations?: Record<string, string[]>;
  };
}

export interface PaymentVerification {
  status: number;
  refId?: number;
  errors?: {
    code: number;
    message: string;
  };
}

/**
 * ایجاد درخواست پرداخت
 */
export async function createPaymentRequest(
  data: PaymentRequest
): Promise<PaymentResponse> {
  // بررسی وجود Merchant ID
  // در development mode، اگر Merchant ID تنظیم نشده باشد، از یک مقدار تست استفاده می‌کنیم
  const merchantId = ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim() !== "" 
    ? ZARINPAL_MERCHANT_ID 
    : (ZARINPAL_SANDBOX ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "");

  if (!merchantId || merchantId.trim() === "" || merchantId === "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
    return {
      status: -11,
      errors: {
        code: -11,
        message: "Merchant ID تنظیم نشده است. لطفاً ZARINPAL_MERCHANT_ID را در فایل .env.local تنظیم کنید.",
        validations: {
          merchant_id: ["The merchant id field is required."]
        }
      },
    };
  }

  try {
    const response = await fetch(`${ZARINPAL_API_URL}/request.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: data.amount,
        description: data.description,
        callback_url: data.callbackUrl,
        mobile: data.mobile,
        email: data.email,
      }),
    });

    const result = await response.json();

    if (result.data && result.data.code === 100) {
      return {
        status: 100,
        authority: result.data.authority,
      };
    }

    return {
      status: result.data?.code || result.errors?.code || -1,
      errors: result.errors,
    };
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === "development") {
    console.error("Error creating payment request:", error);
    }
    return {
      status: -1,
      errors: {
        code: -1,
        message: "خطا در اتصال به درگاه پرداخت",
      },
    };
  }
}

/**
 * تایید پرداخت
 */
export async function verifyPayment(
  authority: string,
  amount: number
): Promise<PaymentVerification> {
  // بررسی وجود Merchant ID
  // در development mode، اگر Merchant ID تنظیم نشده باشد، از یک مقدار تست استفاده می‌کنیم
  const merchantId = ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim() !== "" 
    ? ZARINPAL_MERCHANT_ID 
    : (ZARINPAL_SANDBOX ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "");

  if (!merchantId || merchantId.trim() === "" || merchantId === "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
    return {
      status: -11,
      errors: {
        code: -11,
        message: "Merchant ID تنظیم نشده است. لطفاً ZARINPAL_MERCHANT_ID را در فایل .env.local تنظیم کنید.",
      },
    };
  }

  try {
    const response = await fetch(`${ZARINPAL_API_URL}/verify.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: merchantId,
        authority: authority,
        amount: amount,
      }),
    });

    const result = await response.json();

    if (result.data && result.data.code === 100) {
      return {
        status: 100,
        refId: result.data.ref_id,
      };
    }

    return {
      status: result.data?.code || result.errors?.code || -1,
      errors: result.errors,
    };
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === "development") {
    console.error("Error verifying payment:", error);
    }
    return {
      status: -1,
      errors: {
        code: -1,
        message: "خطا در تایید پرداخت",
      },
    };
  }
}

/**
 * دریافت لینک پرداخت
 */
export function getPaymentUrl(authority: string): string {
  const baseUrl = ZARINPAL_SANDBOX
    ? "https://sandbox.zarinpal.com/pg/StartPay"
    : "https://www.zarinpal.com/pg/StartPay";
  return `${baseUrl}/${authority}`;
}


