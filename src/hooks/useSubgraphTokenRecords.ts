import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TokenRecord,
  TokenRecord_Filter,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  useInfiniteTokenRecordsQuery,
} from "src/generated/graphql";
import { adjustDateByDays, dateGreaterThan, getISO8601String } from "src/helpers/DateHelper";
import { BLOCKCHAINS, SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  getNextPageParamFactory,
  getTokenRecordDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

/**
 * Fetches TokenRecords from {subgraphUrl}, returning the records
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
export const useTokenRecordsQuery = (
  chartName: string,
  subgraphUrl: string,
  baseFilter: TokenRecord_Filter,
  earliestDate: string | null,
  dateOffset?: number,
): Map<string, TokenRecord[]> | null => {
  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate, dateOffset);
  const paginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  const functionName = `${chartName}/TokenRecord`;

  // Create a paginator
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteTokenRecordsQuery(
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

  // Handle date changes
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate || !baseFilter) {
      return;
    }

    console.info(`${functionName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateTokenRecords(null);

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
  }, [baseFilter, earliestDate, chartName, refetch, subgraphUrl, dateOffset, functionName]);

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(`${functionName}: fetching next page`);
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage, chartName, functionName]);

  const [byDateTokenRecords, setByDateTokenRecords] = useState<Map<string, TokenRecord[]> | null>(null);

  // Group by date
  useMemo(() => {
    if (hasNextPage || !data) {
      return;
    }

    console.info(`${functionName}: Data loading is done. Rebuilding by date metrics`);
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();
    const dateTokenRecords = getTokenRecordDateMap(tokenRecords, true);
    setByDateTokenRecords(dateTokenRecords);
  }, [hasNextPage, data, functionName]);

  return byDateTokenRecords;
};

/**
 * Fetches TokenRecords from each of the given subgraph URLs,
 * returning the combined records grouped by date.
 *
 * Only the records belonging to the latest block per date are returned.
 *
 * This hook handles paging and returns the completed results up to {earliestDate}.
 *
 * @param chartName
 * @param subgraphUrls
 * @param baseFilter
 * @param earliestDate the earliest date to fetch, in YYYY-MM-DD format
 * @param dateOffset the number of days to fetch in each page/request
 * @param shouldHandleHangingQuery if true, will return results even when there is a hanging query
 * @returns Records grouped by date, or null if still fetching
 */
export const useTokenRecordsQueries = (
  chartName: string,
  subgraphUrls: SUBGRAPH_URLS,
  baseFilter: TokenRecord_Filter,
  earliestDate: string | null,
  dateOffset?: number,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  shouldHandleHangingQuery: boolean = false,
): Map<string, TokenRecord[]> | null => {
  // Start queries
  const arbitrumResults = useTokenRecordsQuery(
    `${chartName}/Arbitrum`,
    subgraphUrls.Arbitrum,
    baseFilter,
    earliestDate,
    dateOffset,
  );
  const ethereumResults = useTokenRecordsQuery(
    `${chartName}/Ethereum`,
    subgraphUrls.Ethereum,
    baseFilter,
    earliestDate,
    dateOffset,
  );
  const fantomResults = useTokenRecordsQuery(
    `${chartName}/Fantom`,
    subgraphUrls.Fantom,
    baseFilter,
    earliestDate,
    dateOffset,
  );
  const polygonResults = useTokenRecordsQuery(
    `${chartName}/Polygon`,
    subgraphUrls.Polygon,
    baseFilter,
    earliestDate,
    dateOffset,
  );
  const [combinedResults, setCombinedResults] = useState<Map<string, TokenRecord[]> | null>(null);
  const isFetchingCount = useIsFetching(["TokenRecords.infinite"]);

  /**
   * Combines the contents of {results} with the existing map of {currentResults}.
   *
   * If {currentResults} contains values for a key, the values are merged.
   *
   * @param results
   * @param existingResults
   */
  const combineQueryResults = (
    blockchain: BLOCKCHAINS,
    results: Map<string, TokenRecord[]> | null,
    existingResults: Map<string, TokenRecord[]>,
    latestDate: string | null,
  ): void => {
    if (!results) return;

    results.forEach((records: TokenRecord[], date: string) => {
      // Skip if greater than latestDate
      if (latestDate && dateGreaterThan(date, latestDate)) return;

      // Get the existing value
      const existingRecords = existingResults.get(date);

      // Combine, if needed
      const combinedRecords: TokenRecord[] = records.slice();
      if (existingRecords) {
        combinedRecords.push(...existingRecords);
      }

      // Set in the resulting map
      existingResults.set(date, combinedRecords);
    });
  };

  // Handle receiving the finalised data from each blockchain
  useEffect(() => {
    // During a re-fetch (due to prop changes), some subgraphs without query results never return, so we work around that
    const hasHangingQuery = isFetchingCount === 0;

    // Only combine (and trigger a re-render) when all results have been received
    if (
      (!shouldHandleHangingQuery || !hasHangingQuery) &&
      (!arbitrumResults || !ethereumResults || !fantomResults || !polygonResults)
    ) {
      return;
    }

    /**
     * Returns the date representing the latest date in the given results.
     *
     * If the results are empty, null is returned.
     *
     * @param results
     * @returns
     */
    const getLatestDate = (results: Map<string, TokenRecord[]>): string | null => {
      const sortedKeys = Array.from(results.keys()).sort();

      if (sortedKeys.length == 0) return null;

      return sortedKeys[sortedKeys.length - 1];
    };

    /**
     * Iterate over all of the query results and returns the
     * latest date that is common across all of the results.
     */
    const getCommonLatestDate = (): string | null => {
      if (!arbitrumResults || !ethereumResults || !fantomResults || !polygonResults) {
        return null;
      }

      const latestDates = [
        getLatestDate(arbitrumResults),
        getLatestDate(ethereumResults),
        getLatestDate(fantomResults),
        getLatestDate(polygonResults),
      ];

      // Return the smallest, latest date
      return latestDates.reduce((previousValue: string | null, currentValue: string | null) => {
        if (!currentValue || currentValue.length == 0) return previousValue;

        if (!previousValue || previousValue.length == 0) return currentValue;

        if (new Date(previousValue).getTime() < new Date(currentValue).getTime()) return previousValue;

        return currentValue;
      }, "");
    };

    const commonLatestDate = getCommonLatestDate();

    console.debug(`${chartName}: received all results. Combining.`);
    const tempResults = new Map<string, TokenRecord[]>();
    combineQueryResults(BLOCKCHAINS.Arbitrum, arbitrumResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Ethereum, ethereumResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Fantom, fantomResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Polygon, polygonResults, tempResults, commonLatestDate);

    // We need to sort by key (date), as the ordering of arrival of results will result in them being out of order
    const sortedResults = new Map([...tempResults].sort().reverse());

    setCombinedResults(sortedResults);
  }, [
    arbitrumResults,
    chartName,
    ethereumResults,
    fantomResults,
    isFetchingCount,
    polygonResults,
    shouldHandleHangingQuery,
  ]);

  return combinedResults;
};
