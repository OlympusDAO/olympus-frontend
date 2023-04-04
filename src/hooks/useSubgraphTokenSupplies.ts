import { useEffect, useMemo, useState } from "react";
import {
  TokenSuppliesQuery,
  TokenSuppliesQueryVariables,
  TokenSupply,
  TokenSupply_Filter,
  useInfiniteTokenSuppliesQuery,
} from "src/generated/graphql";
import { getDataSource } from "src/graphql/query";
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
  const [paginator, setPaginator] = useState<NextPageParamType | undefined>();
  const functionName = useMemo(() => `${chartName}/TokenSupply`, [chartName]);

  /**
   * Handle changes to the props
   */
  const [dataSource, setDataSource] = useState<{ endpoint: string; fetchParams?: RequestInit }>(
    getDataSource(subgraphUrl),
  );
  const [queryVariables, setQueryVariables] = useState<TokenSuppliesQueryVariables>({
    filter: {
      ...baseFilter,
    },
    recordCount: DEFAULT_RECORD_COUNT,
    endpoint: subgraphUrl,
  });
  const [queryOptions, setQueryOptions] = useState<QueryOptionsType>({
    enabled: false,
    getNextPageParam: paginator,
  });
  // Handle changes to query options, endpoint and variables
  // These setter calls are co-located to avoid race conditions that can result in strange behaviour (OlympusDAO/olympus-frontend#2325)
  useEffect(() => {
    console.info(`${functionName}: Inputs changed. Updating calculated values`);

    // We need to wipe the data, otherwise it will be inconsistent
    // This is called here so that calling components can be updated before any changes to query configuration
    setByDateTokenSupplies(null);

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

    setDataSource(getDataSource(subgraphUrl));

    // Create a new paginator with the new earliestDate
    const tempPaginator =
      earliestDate !== null && subgraphUrl !== null
        ? getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter, subgraphUrl, dateOffset)
        : undefined;
    setPaginator(tempPaginator);

    const tempQueryOptions = {
      enabled: earliestDate !== null && subgraphUrl.length > 0 && tempPaginator !== undefined,
      getNextPageParam: tempPaginator,
    };
    setQueryOptions(tempQueryOptions);
    console.debug(
      `${functionName}: Inputs changed. Updated query variables. Query enabled: ${tempQueryOptions.enabled}
      earliestDate: ${earliestDate}
      endpoint: ${subgraphUrl}
      paginator set: ${tempPaginator !== undefined}`,
    );
  }, [baseFilter, chartName, dateOffset, earliestDate, functionName, subgraphUrl]);

  /**
   * Data fetching
   */
  const { data, hasNextPage, fetchNextPage, refetch, isFetching } = useInfiniteTokenSuppliesQuery(
    dataSource,
    "filter",
    queryVariables,
    queryOptions,
  );

  /**
   * If the queryOptions change (triggered by the props changing), then we will force a refetch.
   */
  useEffect(() => {
    if (!queryOptions.enabled) return;

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    console.info(`${functionName}: Re-fetching.`);
    refetch();
  }, [queryOptions, functionName, refetch]);

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(`${functionName}: fetching next page`);
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage, functionName]);

  /**
   * Data processing
   */
  const [byDateTokenSupplies, setByDateTokenSupplies] = useState<Map<string, TokenSupply[]> | null>(null);
  useMemo(() => {
    // When there is more data (hasNextPage) or there is fetching, then the data is not ready for processing.
    // Checking for data == null here is not appropriate, since data may be null when there are no results.
    if (isFetching || hasNextPage) {
      return;
    }

    console.info(`${functionName}: Data loading is done. Rebuilding by date metrics`);
    const records = data ? data.pages.map(query => query.tokenSupplies).flat() : [];
    // Group by date
    const dateRecords = getTokenSupplyDateMap(records, true);
    setByDateTokenSupplies(dateRecords);
  }, [data, functionName, isFetching, hasNextPage]);

  return byDateTokenSupplies;
};
