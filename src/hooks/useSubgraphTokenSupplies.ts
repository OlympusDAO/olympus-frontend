import { useEffect, useMemo, useRef, useState } from "react";
import {
  TokenSuppliesQuery,
  TokenSuppliesQueryVariables,
  TokenSupply,
  TokenSupply_Filter,
  useInfiniteTokenSuppliesQuery,
} from "src/generated/graphql";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  getNextPageParamFactory,
  getTokenSupplyDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

type NextPageParamType = (lastPage: TokenSuppliesQuery) => TokenSuppliesQueryVariables | undefined;

type QueryOptionsType = {
  enabled: boolean;
  getNextPageParam?: NextPageParamType;
};

/**
 * Fetches TokenSupply records from {subgraphUrl}, returning the records
 * grouped by date.
 *
 * Only the records belonging to the latest block per date are returned.
 *
 * This hook handles paging and returns the completed results up to {earliestDate}.
 *
 * @param chartName
 * @param subgraphUrl
 * @param baseFilter
 * @param earliestDate
 * @returns Records grouped by date, or null if still fetching
 */
export const useTokenSuppliesQuery = (
  chartName: string,
  subgraphUrl: string, // shift to type with url per blockchain
  baseFilter: TokenSupply_Filter,
  earliestDate: string | null,
  dateOffset?: number,
): Map<string, TokenSupply[]> | null => {
  /**
   * Cached variables
   */
  const paginator = useRef<NextPageParamType>();

  const [dataSource, setDataSource] = useState<{ endpoint: string; fetchParams?: RequestInit }>({
    endpoint: subgraphUrl,
  });
  useEffect(() => {
    setDataSource({ endpoint: subgraphUrl });
  }, [subgraphUrl]);

  const [queryVariables, setQueryVariables] = useState<TokenSuppliesQueryVariables>({
    recordCount: DEFAULT_RECORD_COUNT,
    endpoint: subgraphUrl,
  });
  useEffect(() => {
    const finishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
    setQueryVariables({
      filter: {
        ...baseFilter,
        date_gte: !earliestDate ? null : getNextPageStartDate(finishDate, earliestDate, dateOffset),
        date_lt: finishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
      endpoint: subgraphUrl,
    });
  }, [baseFilter, dateOffset, earliestDate, subgraphUrl]);

  const [queryOptions, setQueryOptions] = useState<QueryOptionsType>({
    enabled: earliestDate !== null && baseFilter != null && subgraphUrl !== null,
    getNextPageParam: paginator.current,
  });
  useEffect(() => {
    setQueryOptions({
      enabled: earliestDate !== null && baseFilter != null && subgraphUrl !== null,
      getNextPageParam: paginator.current,
    });
  }, [baseFilter, earliestDate, subgraphUrl]);

  /**
   * Data fetching
   */
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteTokenSuppliesQuery(
    dataSource,
    "filter",
    queryVariables,
    queryOptions,
  );

  // Handle date changes
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate || !baseFilter || !subgraphUrl || !queryOptions.enabled) {
      return;
    }

    console.info(`${chartName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateTokenSupplies(null);

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    // refetch does not respect the enabled property in react-query, so we check queryOptions.enabled above
    refetch();

    // Create a new paginator with the new earliestDate
    paginator.current = getNextPageParamFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
      subgraphUrl,
      dateOffset,
    );
  }, [baseFilter, chartName, dateOffset, earliestDate, queryOptions.enabled, refetch, subgraphUrl]);

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(chartName + ": fetching next page");
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage, chartName]);

  const [byDateTokenSupplies, setByDateTokenSupplies] = useState<Map<string, TokenSupply[]> | null>(null);

  /**
   * Data processing
   */
  useMemo(() => {
    if (hasNextPage || !data) {
      console.debug(`${chartName}: Removing cached data, as query is in progress.`);
      return;
    }

    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);
    const records = data.pages.map(query => query.tokenSupplies).flat();
    // Group by date
    const dateRecords = getTokenSupplyDateMap(records, true);
    setByDateTokenSupplies(dateRecords);
  }, [hasNextPage, data, chartName]);

  return byDateTokenSupplies;
};
