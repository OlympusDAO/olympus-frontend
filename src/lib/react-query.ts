import { QueryClient, QueryKey } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      notifyOnChangeProps: "tracked",
    },
  },
});

export const reactQueryErrorHandler = (key: QueryKey) => {
  return (error: any) => {
    console.log({ key, error: error.message });
  };
};
