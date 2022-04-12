import { hashQueryKey, QueryKey } from "react-query";
import { queryCache, queryClient } from "src/lib/react-query";

/**
 * A helper function that allows us to imperatively get the data
 * for a specific query whilst deduping requests for that data.
 */
export const getQueryData = async <TData>(queryKey: QueryKey, queryFn: () => Promise<TData>): Promise<TData> => {
  return await new Promise(async (resolve, reject) => {
    const state = queryClient.getQueryState<TData, Error>(queryKey);

    if (!state) {
      // If this query doesn't exist - i.e. they're are no instances
      // of `useQuery` mounted in our app yet with this specific
      // query key - we synchronously fire off a call to fetch the
      // query and cache its result against the provided queryKey.
      queryClient.prefetchQuery(queryKey, queryFn);
      // This is safe to do since `prefetchQuery` is idempotent and
      // can be called multiple times without firing off a new
      // request if one is already in-flight, allowing us to dedupe
      // multiple subscribers request for data
    }

    // Opinionated: returning stale data is better than erroring
    if (state?.status === "error") return state.data ? resolve(state.data) : reject(new Error(state.error?.message));

    // I.e. not in an error state, and data exists
    if (state?.data) return resolve(state.data);

    const hashedKey = hashQueryKey(queryKey);
    const unsubscribe = queryCache.subscribe(event => {
      if (event?.query.queryHash === hashedKey) {
        if (event.type === "queryUpdated") {
          unsubscribe();

          const { state } = event.query;

          return state.data ? resolve(state.data) : reject(new Error(state.error?.message));
        }
      }
    });
  });
};
