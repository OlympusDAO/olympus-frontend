const baseURL = "https://olympus-cooler-loans-api-prod.web.app";

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
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: any;
  data?: Record<string, unknown>;
}): Promise<T> => {
  const response = await fetch(`${baseURL}${url}?` + new URLSearchParams(params), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export default customHttpClient;
