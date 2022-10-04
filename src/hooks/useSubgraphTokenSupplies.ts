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
  // NOTE: useRef is used throughout this function, as we don't want changes to calculated variables to cause a re-render. That is instead caused by re-fetching and the updating of the byDateTokenRecords

  /**
   * Cached variables
   */
  const paginator = useRef<NextPageParamType>();
  const functionName = useMemo(() => `${chartName}/TokenSupply`, [chartName]);

  /**
   * Handle changes to the props
   */
  const dataSource = useRef<{ endpoint: string; fetchParams?: RequestInit }>({
    endpoint: subgraphUrl,
  });
  const queryVariables = useRef<TokenSuppliesQueryVariables>({
    filter: {
      ...baseFilter,
    },
    recordCount: DEFAULT_RECORD_COUNT,
    endpoint: subgraphUrl,
  });
  const queryOptions = useRef<QueryOptionsType>({
    enabled: false,
    getNextPageParam: paginator.current,
  });
  // Handle changes to query options, endpoint and variables
  // These setter calls are co-located to avoid race conditions that can result in strange behaviour (OlympusDAO/olympus-frontend#2325)
  useEffect(() => {
    console.info(`${functionName}: Inputs changed. Updating calculated values`);

    const finishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
    queryVariables.current = {
      filter: {
        ...baseFilter,
        date_gte: !earliestDate ? null : getNextPageStartDate(finishDate, earliestDate, dateOffset),
        date_lt: finishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
      endpoint: subgraphUrl,
    };

    dataSource.current = {
      endpoint: subgraphUrl,
    };

    // Create a new paginator with the new earliestDate
    const tempPaginator =
      earliestDate !== null && subgraphUrl !== null
        ? getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter, subgraphUrl, dateOffset)
        : undefined;
    paginator.current = tempPaginator;

    queryOptions.current = {
      enabled: earliestDate !== null && subgraphUrl.length > 0 && paginator.current !== undefined,
      getNextPageParam: paginator.current,
    };

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateTokenSupplies(null);
  }, [baseFilter, chartName, dateOffset, earliestDate, functionName, subgraphUrl]);

  /**
   * Data fetching
   */
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteTokenSuppliesQuery(
    dataSource.current,
    "filter",
    queryVariables.current,
    queryOptions.current,
  );

  /**
   * If the queryOptions change (triggered by the props changing), then we will force a refetch.
   */
  useEffect(() => {
    if (!queryOptions.current.enabled) return;

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
    if (hasNextPage || !data) {
      return;
    }

    console.info(`${functionName}: Data loading is done. Rebuilding by date metrics`);
    const records = data.pages.map(query => query.tokenSupplies).flat();
    // Group by date
    const dateRecords = getTokenSupplyDateMap(records, true);
    setByDateTokenSupplies(dateRecords);
  }, [hasNextPage, data, functionName]);

  return byDateTokenSupplies;
};
