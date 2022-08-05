import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";

export const queryCache = new QueryCache({
  onError: (error, query) => {
    if (error instanceof Error) console.error({ key: query.queryKey, error: error.message });
  },
});

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: Environment.env.NODE_ENV === "development" ? false : 3,
    },
  },
});

export const ReactQueryProvider: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {Environment.env.NODE_ENV === "development" && <ReactQueryDevtools />}

    {children}
  </QueryClientProvider>
);
