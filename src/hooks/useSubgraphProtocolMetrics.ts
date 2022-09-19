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
  // Handle date changes
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate || !baseFilter) {
      return;
    }

    console.info(`${chartName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateProtocolMetrics(null);

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
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
  }, [baseFilter, earliestDate]);

  // Create a paginator
  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate, dateOffset);
  const paginator = useRef<(lastPage: ProtocolMetricsQuery) => ProtocolMetricsQueryVariables | undefined>();

  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteProtocolMetricsQuery(
    { endpoint: subgraphUrl },
    "filter",
    {
      filter: {
        ...baseFilter,
        date_gte: initialStartDate,
        date_lt: initialFinishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
      endpoint: subgraphUrl,
    },
    {
      enabled: earliestDate !== null && baseFilter != null,
      getNextPageParam: paginator.current,
    },
  );

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(chartName + ": fetching next page");
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage]);

  const [byDateProtocolMetrics, setByDateProtocolMetrics] = useState<Map<string, ProtocolMetric[]> | null>(null);

  // Group by date
  useMemo(() => {
    if (hasNextPage || !data) {
      console.debug(`${chartName}: Removing cached data, as query is in progress.`);
      return;
    }

    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);
    const records = data.pages.map(query => query.protocolMetrics).flat();
    const dateRecords = getProtocolMetricDateMap(records, true);
    setByDateProtocolMetrics(dateRecords);
  }, [hasNextPage, data]);

  return byDateProtocolMetrics;
};
