import { hashQueryKey, QueryKey } from "react-query";
import { queryCache, queryClient } from "src/lib/react-query";

export const getQueryData = async <TData>(
  key: QueryKey,
  options?: {
    /**
     * The number of milliseconds before we cancel
     * this request for data, preventing endlessly
     * waiting for data that may never arrive
     */
    timeout?: number;
  },
): Promise<TData> => {
  const { timeout = 10000 } = options || {};

  return await new Promise((resolve, reject) => {
    const data: TData | undefined = queryClient.getQueryData(key);
    if (data) resolve(data);

    const id = setTimeout(() => {
      unsubscribe();
      return reject(new Error("Request timed out"));
    }, timeout);

    const hashedKey = hashQueryKey(key);
    const unsubscribe = queryCache.subscribe(event => {
      if (event?.type === "queryUpdated") {
        if (event.query.queryHash === hashedKey) {
          unsubscribe();
          clearTimeout(id);
          return resolve(event.query.state.data);
        }
      }
    });
  });
};
