import { QueryKey, useQuery } from "react-query";

/**
 * Used to build a `useQuery` function for fetching necessary data in parallel for a query,
 * using that queries `queryKey`
 *
 * Please refer to the `useStakePoolTVL` function for an example on why this function is handy.
 */
export const createDependentQuery = (baseQueryKey: QueryKey) => {
  return <TData>(key: string, fn: () => Promise<TData>, enabled?: boolean) => {
    return useQuery([baseQueryKey, key].filter(Boolean), fn, { enabled }).data;
  };
};
