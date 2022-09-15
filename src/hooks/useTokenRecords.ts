import { useEffect, useMemo, useRef, useState } from "react";
import {
  TokenRecord,
  TokenRecord_Filter,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  useInfiniteTokenRecordsQuery,
} from "src/generated/graphql";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
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
  subgraphUrl: string, // shift to type with url per blockchain
  baseFilter: TokenRecord_Filter,
  earliestDate: string | null,
): Map<string, TokenRecord[]> | null => {
  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate, -180); // TODO restore offset
  const paginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();

  // Handle date changes
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate || !baseFilter) {
      return;
    }

    console.info(`${chartName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // We need to wipe the data, otherwise it will be inconsistent
    setByDateTokenRecords(null);

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    refetch();

    // Create a new paginator with the new earliestDate
    paginator.current = getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter, subgraphUrl);
  }, [baseFilter, earliestDate]);

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

  // Handle subsequent pages
  useEffect(() => {
    if (hasNextPage) {
      console.debug(chartName + ": fetching next page");
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage]);

  const [byDateTokenRecords, setByDateTokenRecords] = useState<Map<string, TokenRecord[]> | null>(null);

  // Group by date
  useMemo(() => {
    if (hasNextPage || !data) {
      console.debug(`${chartName}: Removing cached data, as query is in progress.`);
      return;
    }

    // todo combine data once all queries have finished
    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();
    const dateTokenRecords = getTokenRecordDateMap(tokenRecords, true);
    setByDateTokenRecords(dateTokenRecords);
  }, [hasNextPage, data]);

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
 * @param earliestDate
 * @returns Records grouped by date, or null if still fetching
 */
export const useTokenRecordsQueries = (
  chartName: string,
  subgraphUrls: SUBGRAPH_URLS,
  baseFilter: TokenRecord_Filter,
  earliestDate: string | null,
): Map<string, TokenRecord[]> | null => {
  // Start queries
  const arbitrumResults = useTokenRecordsQuery(
    `${chartName}/Arbitrum`,
    subgraphUrls.Arbitrum,
    baseFilter,
    earliestDate,
  );
  const ethereumResults = useTokenRecordsQuery(
    `${chartName}/Ethereum`,
    subgraphUrls.Ethereum,
    baseFilter,
    earliestDate,
  );
  const fantomResults = useTokenRecordsQuery(`${chartName}/Fantom`, subgraphUrls.Fantom, baseFilter, earliestDate);
  const polygonResults = useTokenRecordsQuery(`${chartName}/Polygon`, subgraphUrls.Polygon, baseFilter, earliestDate);
  const [combinedResults, setCombinedResults] = useState<Map<string, TokenRecord[]> | null>(null);

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
    results: Map<string, TokenRecord[]>,
    existingResults: Map<string, TokenRecord[]>,
  ): void => {
    results.forEach((records: TokenRecord[], date: string) => {
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

  /**
   * Combines results from different blockchain queries, once they have all been completed.
   */
  const handleQueryResults = (): void => {
    // Only combine (and trigger a re-render) when all results have been received
    if (!arbitrumResults || !ethereumResults || !fantomResults || !polygonResults) {
      return;
    }

    console.debug(`${chartName}: received all results. Combining.`);
    const tempResults = new Map<string, TokenRecord[]>();
    combineQueryResults(BLOCKCHAINS.Arbitrum, arbitrumResults, tempResults);
    combineQueryResults(BLOCKCHAINS.Ethereum, ethereumResults, tempResults);
    combineQueryResults(BLOCKCHAINS.Fantom, fantomResults, tempResults);
    combineQueryResults(BLOCKCHAINS.Polygon, polygonResults, tempResults);

    // We need to sort by key (date), as the ordering of arrival of results will result in them being out of order
    const sortedResults = new Map([...tempResults].sort().reverse());

    setCombinedResults(sortedResults);
  };

  // Handle receiving the finalised data from each blockchain
  useEffect(() => {
    handleQueryResults();
  }, [arbitrumResults]);

  useEffect(() => {
    handleQueryResults();
  }, [ethereumResults]);

  useEffect(() => {
    handleQueryResults();
  }, [fantomResults]);

  useEffect(() => {
    handleQueryResults();
  }, [polygonResults]);

  return combinedResults;
};
