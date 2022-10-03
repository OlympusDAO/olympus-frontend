import { useEffect, useState } from "react";
import { TokenRecord, TokenRecord_Filter, useTokenRecordsQuery } from "src/generated/graphql";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import { getSubgraphUrl, SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

/**
 * Returns the latest block of the latest day in the TokenRecord query.
 *
 * This relies on the query being sorted by date AND block in descending order.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the latest block
 */
export const useTokenRecordsLatestBlock = (subgraphUrl?: string) => {
  const finalSubgraphUrl = subgraphUrl || getSubgraphUrl();

  return useTokenRecordsQuery(
    { endpoint: finalSubgraphUrl },
    {
      recordCount: 1,
      endpoint: finalSubgraphUrl,
    },
    { select: data => data.tokenRecords[0].block, ...QUERY_OPTIONS },
  );
};

/**
 * Returns the latest record of the latest day in the TokenRecord query.
 *
 * This relies on the query being sorted by date AND block in descending order.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping the latest TokenRecord
 */
export const useTokenRecordsLatestRecord = (subgraphUrl?: string) => {
  const finalSubgraphUrl = subgraphUrl || getSubgraphUrl();

  return useTokenRecordsQuery(
    { endpoint: finalSubgraphUrl },
    {
      recordCount: 1,
      endpoint: finalSubgraphUrl,
    },
    { select: data => data.tokenRecords[0], ...QUERY_OPTIONS },
  );
};

/**
 * Provides the market value of the treasury for the latest data available in the subgraph.
 *
 * The market value is the sum of all TokenRecord objects in the subgraph, and includes vested/illiquid tokens.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the market value of the treasury
 */
export const useTreasuryMarketValue = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const finalSubgraphUrl = subgraphUrl || getSubgraphUrl();

  return useTokenRecordsQuery(
    { endpoint: finalSubgraphUrl },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: finalSubgraphUrl,
    },
    {
      // We just need the total of the tokenRecord value
      select: data => data.tokenRecords.reduce((previousValue, tokenRecord) => previousValue + +tokenRecord.value, 0),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

/**
 * Provides the liquid backing of the treasury for the latest data available in the subgraph.
 *
 * Liquid backing is defined as the value of all liquid assets in the treasury.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing of the treasury
 */
export const useTreasuryLiquidValue = (iEarliestDate?: string, iSubgraphUrls?: SUBGRAPH_URLS): number => {
  // We use a mutable reference for each of the values, otherwise it will cause re-fetching of data endlessly
  const [earliestDate, setEarliestDate] = useState<string | null>(null);
  useEffect(() => {
    setEarliestDate(iEarliestDate || null);
  }, [iEarliestDate]);

  const [subgraphUrls, setSubgraphUrls] = useState<SUBGRAPH_URLS | null>(null);
  useEffect(() => {
    setSubgraphUrls(iSubgraphUrls || null);
  }, [iSubgraphUrls]);

  // It's tempting to restrict by the latest block here, EXCEPT that different blockchains have different latest block values. It's easier to restrict by date.
  const [baseFilter] = useState<TokenRecord_Filter>({
    isLiquid: true,
  });

  // Fetch the TokenRecords from all blockchains defined in subgraphUrls
  const tokenRecordResults = useTokenRecordsQueries(
    "useTreasuryLiquidValue",
    subgraphUrls,
    baseFilter,
    earliestDate,
    undefined,
    false, // Ensure the query does not hang, particularly when switching the active token
  );

  // Get the latest result (but be defensive in case the are no results)
  const latestResult: TokenRecord[] = !tokenRecordResults
    ? []
    : tokenRecordResults.size == 0
    ? []
    : Array.from(tokenRecordResults)[tokenRecordResults.size - 1][1];

  return getTreasuryAssetValue(latestResult, true);
};