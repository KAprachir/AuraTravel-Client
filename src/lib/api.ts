const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  const mergedOptions: RequestInit = {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  const res = await fetch(`${API_URL}${endpoint}`, mergedOptions);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "An error occurred on the server.");
  }
  return res.json();
}
