import { hashQueryKey, QueryKey } from "react-query";
import { queryCache, queryClient } from "src/lib/react-query";

export const getQueryData = async <TData>(key: QueryKey): Promise<TData> => {
  return new Promise(resolve => {
    const data: TData | undefined = queryClient.getQueryData(key);

    if (data) resolve(data);

    const _key = hashQueryKey(key);

    const unsubscribe = queryCache.subscribe(event => {
      if (event?.type === "queryUpdated") {
        if (event.query.queryHash === _key) {
          unsubscribe();
          resolve(event.query.state.data);
        }
      }
    });
  });
};
