/**
 * Helper function برای fetch با header های احراز هویت
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // دریافت userId و role از localStorage
  let userId: string | null = null;
  let userRole: string | null = null;

  if (typeof window !== "undefined") {
    userId = localStorage.getItem("saded_user_id");
    userRole = localStorage.getItem("saded_user_role");
  }

  // اضافه کردن header ها
  const headers = new Headers(options.headers);
  
  if (userId && userId !== "guest") {
    headers.set("x-user-id", userId);
  }
  
  if (userRole) {
    headers.set("x-user-role", userRole);
  }

  // اگر Content-Type تنظیم نشده، اضافه کن
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

