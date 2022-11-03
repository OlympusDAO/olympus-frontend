import { useEffect, useState } from "react";
import { TokenRecord, TokenRecord_Filter, useTokenRecordsQuery } from "src/generated/graphql";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import { getSubgraphUrl, SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";

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
 * Fetches the value of treasury assets across all chains from the subgraph.
 *
 * @param sourceName
 * @param liquidOnly
 * @param _earliestDate
 * @param _subgraphUrls
 * @returns
 */
const useTreasuryAssets = (
  sourceName: string,
  _liquidOnly: boolean,
  _earliestDate?: string,
  _subgraphUrls?: SUBGRAPH_URLS,
): number => {
  // It's tempting to restrict by the latest block here, EXCEPT that different blockchains have different latest block values. It's easier to restrict by date.
  const createFilter = (_isLiquid: boolean): TokenRecord_Filter => {
    return {
      ...(_isLiquid
        ? {
            isLiquid: true,
          }
        : {}),
    };
  };
  const [baseFilter, setBaseFilter] = useState(createFilter(_liquidOnly));
  const [liquidOnly, setLiquidOnly] = useState(_liquidOnly);
  useEffect(() => {
    if (_liquidOnly == liquidOnly) return;

    setLiquidOnly(_liquidOnly);
    setBaseFilter(createFilter(_liquidOnly));
  }, [_liquidOnly]);

  // Fetch the TokenRecords from all blockchains defined in subgraphUrls
  const tokenRecordResults = useTokenRecordsQueries(sourceName, _subgraphUrls, baseFilter, _earliestDate, undefined);

  // Get the latest result (but be defensive in case the are no results)
  const latestResult: TokenRecord[] = !tokenRecordResults
    ? []
    : tokenRecordResults.size == 0
    ? []
    : Array.from(tokenRecordResults)[tokenRecordResults.size - 1][1];

  return getTreasuryAssetValue(latestResult, liquidOnly);
};

/**
 * Provides the market value of the treasury for the latest data available in the subgraph.
 *
 * The market value is the sum of all TokenRecord objects in the subgraph, and includes vested/illiquid tokens.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the market value of the treasury
 */
export const useTreasuryMarketValue = (_earliestDate?: string, _subgraphUrls?: SUBGRAPH_URLS): number => {
  return useTreasuryAssets("useTreasuryMarketValue", false, _earliestDate, _subgraphUrls);
};

/**
 * Provides the liquid backing of the treasury for the latest data available in the subgraph.
 *
 * Liquid backing is defined as the value of all liquid assets in the treasury.
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing of the treasury
 */
export const useTreasuryLiquidValue = (_earliestDate?: string, _subgraphUrls?: SUBGRAPH_URLS): number => {
  return useTreasuryAssets("useTreasuryLiquidValue", true, _earliestDate, _subgraphUrls);
};
