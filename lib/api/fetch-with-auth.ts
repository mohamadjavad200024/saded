/**
 * Helper function برای fetch با header های احراز هویت
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // New auth system uses HttpOnly cookie sessions.
  // For browser fetch, cookies are included automatically for same-origin.
  // We still set credentials: 'include' for safety.
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
}

