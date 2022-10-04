import { useEffect, useMemo, useRef, useState } from "react";
import {
  ProtocolMetric,
  ProtocolMetric_Filter,
  ProtocolMetricsQuery,
  ProtocolMetricsQueryVariables,
  useInfiniteProtocolMetricsQuery,
} from "src/generated/graphql";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";
import {
  getNextPageParamFactory,
  getProtocolMetricDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/ProtocolMetricsQueryHelper";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

type NextPageParamType = (lastPage: ProtocolMetricsQuery) => ProtocolMetricsQueryVariables | undefined;

type QueryOptionsType = {
  enabled: boolean;
  getNextPageParam?: NextPageParamType;
};

/**
 * Fetches ProtocolMetrics records from {subgraphUrl}, returning the records
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
export const useProtocolMetricsQuery = (
  chartName: string,
  subgraphUrl: string, // shift to type with url per blockchain
  baseFilter: ProtocolMetric_Filter,
  earliestDate: string | null,
  dateOffset?: number,
): Map<string, ProtocolMetric[]> | null => {
  // NOTE: useRef is used throughout this function, as we don't want changes to calculated variables to cause a re-render. That is instead caused by re-fetching and the updating of the byDateTokenRecords

  /**
   * Cached variables
   */
  const paginator = useRef<NextPageParamType>();
  const functionName = useMemo(() => `${chartName}/ProtocolMetric`, [chartName]);

  /**
   * Handle changes to the props
   */
  const dataSource = useRef<{ endpoint: string; fetchParams?: RequestInit }>({
    endpoint: subgraphUrl,
  });
  const queryVariables = useRef<ProtocolMetricsQueryVariables>({
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
    setByDateProtocolMetrics(null);
  }, [baseFilter, chartName, dateOffset, earliestDate, functionName, subgraphUrl]);

  /**
   * Data fetching
   */
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteProtocolMetricsQuery(
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
  const [byDateProtocolMetrics, setByDateProtocolMetrics] = useState<Map<string, ProtocolMetric[]> | null>(null);
  useMemo(() => {
    if (hasNextPage || !data) {
      return;
    }

    console.info(`${functionName}: Data loading is done. Rebuilding by date metrics`);
    const records = data.pages.map(query => query.protocolMetrics).flat();
    // Group by date
    const dateRecords = getProtocolMetricDateMap(records, true);
    setByDateProtocolMetrics(dateRecords);
  }, [hasNextPage, data, functionName]);

  return byDateProtocolMetrics;
};
