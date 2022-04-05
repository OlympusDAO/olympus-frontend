import { QueryKey, useQuery } from "react-query";

import { nonNullable } from "../types/nonNullable";

/**
 * Used to build a `useQuery` function for fetching necessary data in parallel for a query,
 * using that queries `queryKey`
 *
 * Please refer to the `useStakePoolTVL` function for an example on why this function is handy.
 */
export const createDependentQuery = (baseQueryKey: QueryKey) => {
  return <TData>(key: string, fn: () => Promise<TData>, enabled?: boolean) => {
    const _key = [...baseQueryKey, key].filter(nonNullable);

    return useQuery(_key, fn, { enabled }).data;
  };
};
