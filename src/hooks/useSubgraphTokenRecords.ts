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

type NextPageParamType = (lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined;

type QueryOptionsType = {
  enabled: boolean;
  getNextPageParam?: NextPageParamType;
};

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
 * @param dateOffset
 * @returns Records grouped by date, or null if still fetching
 */
export const useTokenRecordsQuery = (
  chartName: string,
  subgraphUrl: string | null,
  baseFilter: TokenRecord_Filter,
  earliestDate: string | null,
  dateOffset?: number,
): Map<string, TokenRecord[]> | null => {
  // NOTE: useRef is used throughout this function, as we don't want changes to calculated variables to cause a re-render. That is instead caused by re-fetching and the updating of the byDateTokenRecords

  /**
   * Cached variables
   */
  const paginator = useRef<NextPageParamType>();
  const functionName = useMemo(() => `${chartName}/TokenRecord`, [chartName]);

  // The generated react-query hook requires a non-null endpoint (but will be disabled if it is an empty string), so we cache the value here
  const endpointNotNull = useRef("");
  useEffect(() => {
    endpointNotNull.current = subgraphUrl || "";
  }, [subgraphUrl]);

  /**
   * Handle changes to the props
   */
  const dataSource = useRef<{ endpoint: string; fetchParams?: RequestInit }>({
    endpoint: endpointNotNull.current,
  });
  const queryVariables = useRef<TokenRecordsQueryVariables>({
    filter: {
      ...baseFilter,
    },
    recordCount: DEFAULT_RECORD_COUNT,
    endpoint: endpointNotNull.current,
  });
  const queryOptions = useRef<QueryOptionsType>({
    enabled: false,
    getNextPageParam: paginator.current,
  });
  // Handle changes to props and re-generate cached variables
  // These setter calls are co-located to avoid race conditions that can result in strange behaviour (OlympusDAO/olympus-frontend#2325)
  useEffect(() => {
    // We need to wipe the data, otherwise it will be inconsistent
    // This is called here so that calling components can be updated before any changes to query configuration
    setByDateTokenRecords(null);

    const _finishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
    queryVariables.current = {
      filter: {
        ...baseFilter,
        date_gte: !earliestDate ? null : getNextPageStartDate(_finishDate, earliestDate, dateOffset),
        date_lt: _finishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
      endpoint: endpointNotNull.current,
    };

    dataSource.current = {
      endpoint: endpointNotNull.current,
    };

    // Create a new paginator with the new earliestDate
    const tempPaginator =
      earliestDate !== null && subgraphUrl !== null
        ? getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter, subgraphUrl, dateOffset)
        : undefined;
    paginator.current = tempPaginator;

    queryOptions.current = {
      enabled: earliestDate !== null && endpointNotNull.current.length > 0 && paginator.current !== undefined,
      getNextPageParam: paginator.current,
    };
    console.debug(
      `${functionName}: Inputs changed. Updated query variables. Query enabled: ${queryOptions.current.enabled}`,
    );
  }, [baseFilter, earliestDate, dateOffset, endpointNotNull, functionName, subgraphUrl, chartName]);

  /**
   * Data fetching
   */
  // Fetch data (with included pagination)
  const { data, hasNextPage, fetchNextPage, refetch, isFetching } = useInfiniteTokenRecordsQuery(
    dataSource.current,
    "filter",
    queryVariables.current,
    queryOptions.current,
  );

  /**
   * If the queryOptions change (triggered by the props changing), then we will force a refetch.
   */
  useEffect(() => {
    // refetch does not respect the enabled property in react-query, so we check the enabled property
    if (!queryOptions.current.enabled) return;

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    console.info(`${functionName}: Re-fetching.`);
    refetch();
  }, [queryOptions.current, functionName, refetch]); // eslint complains about the dependency array, but it works...

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
  const [byDateTokenRecords, setByDateTokenRecords] = useState<Map<string, TokenRecord[]> | null>(null);
  useMemo(() => {
    // When there is more data (hasNextPage) or there is fetching, then the data is not ready for processing.
    // Checking for data == null here is not appropriate, since data may be null when there are no results.
    if (isFetching || hasNextPage) {
      return;
    }

    console.info(`${functionName}: Data loading is done. Rebuilding by date metrics`);
    const tokenRecords = data ? data.pages.map(query => query.tokenRecords).flat() : [];
    // Group by date
    const dateTokenRecords = getTokenRecordDateMap(tokenRecords, true);
    setByDateTokenRecords(dateTokenRecords);
  }, [data, functionName, isFetching, hasNextPage]);

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
 * @returns Records grouped by date, or null if still fetching
 */
export const useTokenRecordsQueries = (
  chartName: string,
  subgraphUrls: SUBGRAPH_URLS | null,
  _baseFilter: TokenRecord_Filter,
  _earliestDate: string | null,
  _dateOffset?: number,
): Map<string, TokenRecord[]> | null => {
  // Cache these props, as they will be passed to the query for each blockchain, and we don't want to propagate non-changes
  const baseFilter = useRef(_baseFilter);
  useEffect(() => {
    if (_baseFilter == baseFilter.current) return;

    console.debug(`${chartName}: baseFilter changed to ${JSON.stringify(_baseFilter)}`);
    baseFilter.current = _baseFilter;
  }, [_baseFilter, chartName]);
  const earliestDate = useRef(_earliestDate);
  useEffect(() => {
    if (_earliestDate == earliestDate.current) return;

    console.debug(`${chartName}: earliestDate changed to ${_earliestDate}`);
    earliestDate.current = _earliestDate;
  }, [_earliestDate, chartName]);
  const dateOffset = useRef(_dateOffset);
  useEffect(() => {
    if (_dateOffset == dateOffset.current) return;

    console.debug(`${chartName}: dateOffset changed to ${_dateOffset}`);
    dateOffset.current = _dateOffset;
  }, [_dateOffset, chartName]);

  // Cache the subgraph urls, otherwise it will re-fetch and re-render continuously
  const subgraphUrlArbitrum = useRef<string | null>(null);
  const subgraphUrlEthereum = useRef<string | null>(null);
  const subgraphUrlFantom = useRef<string | null>(null);
  const subgraphUrlPolygon = useRef<string | null>(null);
  useEffect(() => {
    if (!subgraphUrls) {
      console.debug(`${chartName}: subgraphUrls changed to null`);
      subgraphUrlArbitrum.current = null;
      subgraphUrlEthereum.current = null;
      subgraphUrlFantom.current = null;
      subgraphUrlPolygon.current = null;
      return;
    }

    // Skip if the values are the same
    if (
      subgraphUrlArbitrum.current == subgraphUrls.Arbitrum &&
      subgraphUrlEthereum.current == subgraphUrls.Ethereum &&
      subgraphUrlFantom.current == subgraphUrls.Fantom &&
      subgraphUrlPolygon.current == subgraphUrls.Polygon
    ) {
      return;
    }

    console.debug(`${chartName}: subgraphUrls changed to ${JSON.stringify(subgraphUrls)}`);
    subgraphUrlArbitrum.current = subgraphUrls.Arbitrum;
    subgraphUrlEthereum.current = subgraphUrls.Ethereum;
    subgraphUrlFantom.current = subgraphUrls.Fantom;
    subgraphUrlPolygon.current = subgraphUrls.Polygon;
  }, [chartName, subgraphUrls]);

  useEffect(() => {
    // This ensures that components relying on this data are updated
    console.info(`${chartName}: Inputs changed. Resetting combined results.`);
    setCombinedResults(null);
  }, [
    // eslint complains about the dependency array, but it works...
    baseFilter.current,
    earliestDate.current,
    dateOffset.current,
    subgraphUrlArbitrum.current,
    subgraphUrlEthereum.current,
    subgraphUrlFantom.current,
    subgraphUrlPolygon.current,
    chartName,
  ]);

  // Start queries
  const arbitrumResults = useTokenRecordsQuery(
    `${chartName}/Arbitrum`,
    subgraphUrlArbitrum.current,
    baseFilter.current,
    earliestDate.current,
    dateOffset.current,
  );
  const ethereumResults = useTokenRecordsQuery(
    `${chartName}/Ethereum`,
    subgraphUrlEthereum.current,
    baseFilter.current,
    earliestDate.current,
    dateOffset.current,
  );
  const fantomResults = useTokenRecordsQuery(
    `${chartName}/Fantom`,
    subgraphUrlFantom.current,
    baseFilter.current,
    earliestDate.current,
    dateOffset.current,
  );
  const polygonResults = useTokenRecordsQuery(
    `${chartName}/Polygon`,
    subgraphUrlPolygon.current,
    baseFilter.current,
    earliestDate.current,
    dateOffset.current,
  );
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
    // Only combine (and trigger a re-render) when all results have been received
    if (!arbitrumResults || !ethereumResults || !fantomResults || !polygonResults) {
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

    console.info(`${chartName}: Received all results. Combining.`);
    const tempResults = new Map<string, TokenRecord[]>();
    combineQueryResults(BLOCKCHAINS.Arbitrum, arbitrumResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Ethereum, ethereumResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Fantom, fantomResults, tempResults, commonLatestDate);
    combineQueryResults(BLOCKCHAINS.Polygon, polygonResults, tempResults, commonLatestDate);

    // We need to sort by key (date), as the ordering of arrival of results will result in them being out of order
    const sortedResults = new Map([...tempResults].sort().reverse());

    setCombinedResults(sortedResults);
  }, [arbitrumResults, chartName, ethereumResults, fantomResults, polygonResults]);

  return combinedResults;
};
