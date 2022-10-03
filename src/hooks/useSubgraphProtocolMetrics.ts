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
  /**
   * Cached variables
   */
  const paginator = useRef<NextPageParamType>();
  const functionName = useMemo(() => `${chartName}/ProtocolMetric`, [chartName]);

  const [dataSource, setDataSource] = useState<{ endpoint: string; fetchParams?: RequestInit }>({
    endpoint: subgraphUrl,
  });
  useEffect(() => {
    setDataSource({ endpoint: subgraphUrl });
  }, [subgraphUrl]);

  const [queryVariables, setQueryVariables] = useState<ProtocolMetricsQueryVariables>({
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
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteProtocolMetricsQuery(
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

    console.info(`${functionName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateProtocolMetrics(null);

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
  }, [baseFilter, chartName, dateOffset, earliestDate, functionName, queryOptions.enabled, refetch, subgraphUrl]);

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(`${functionName}: fetching next page`);
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage, chartName, functionName]);

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
