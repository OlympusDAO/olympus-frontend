const baseURL = "%{OLYMPUS_UNITS_API_ENDPOINT}%";

const AUTH_TOKEN_KEY = "olympus_auth_token";

/**
 * Get JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Store JWT token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Remove JWT token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * We define a custom HTTP client for react-query to use. This is configured
 * through the orval tool. See orval.config.ts for more details.
 *
 * The reason this is used is to add a base URL to the requests, which orval
 * and react-query will not do.
 */
export const customHttpClient = async <T>({
  url,
  method,
  params,
  data,
  signal,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: any;
  data?: Record<string, unknown>;
  signal?: AbortSignal;
}): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${url}?` + new URLSearchParams(params), {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export default customHttpClient;
