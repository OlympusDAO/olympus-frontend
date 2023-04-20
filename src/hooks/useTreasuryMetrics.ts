import { UseQueryResult } from "@tanstack/react-query";
import { useTokenSuppliesQuery } from "src/generated/graphql";
import { getDataSource } from "src/graphql/query";
import {
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmBacked,
  getLiquidBackingPerOhmFloating,
  getOhmCirculatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { getSubgraphUrl, SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useCurrentIndex, useOhmPrice } from "src/hooks/useProtocolMetrics";
import {
  useTokenRecordsLatestBlock,
  useTokenRecordsLatestRecord,
  useTreasuryLiquidValue,
} from "src/hooks/useTokenRecordsMetrics";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

/**
 * OHM price * circulating supply
 *
 * @param subgraphUrl
 * @returns
 */
export const useMarketCap = (subgraphUrl?: string) => {
  const ohmPriceQuery = useOhmPrice(subgraphUrl);
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    getDataSource(endpoint),
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmCirculatingSupply(data.tokenSupplies) * (ohmPriceQuery.data || 0),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && ohmPriceQuery.isSuccess, // Only fetch when we've been able to get the latest date and price
    },
  );
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per OHM
 */
export const useLiquidBackingPerOhmBacked = (subgraphUrls?: SUBGRAPH_URLS): UseQueryResult<number, unknown> => {
  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );
  const endpoint = subgraphUrls?.Ethereum || getSubgraphUrl();

  return useTokenSuppliesQuery(
    getDataSource(endpoint),
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data?.block },
      endpoint: endpoint,
    },
    {
      select: data => getLiquidBackingPerOhmBacked(liquidBackingQuery, data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per OHM
 */
export const useLiquidBackingPerOhmFloating = (subgraphUrls?: SUBGRAPH_URLS): UseQueryResult<number, unknown> => {
  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );
  const endpoint = subgraphUrls?.Ethereum || getSubgraphUrl();

  return useTokenSuppliesQuery(
    getDataSource(endpoint),
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data?.block },
      endpoint: endpoint,
    },
    {
      select: data => getLiquidBackingPerOhmFloating(liquidBackingQuery, data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per gOHM
 */
export const useLiquidBackingPerGOhm = (subgraphUrls?: SUBGRAPH_URLS): UseQueryResult<number, unknown> => {
  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const endpoint = subgraphUrls?.Ethereum || getSubgraphUrl();

  return useTokenSuppliesQuery(
    getDataSource(endpoint),
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data?.block },
      endpoint: endpoint,
    },
    {
      select: data =>
        getLiquidBackingPerGOhmSynthetic(liquidBackingQuery, currentIndexQuery.data || 0, data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && currentIndexQuery.isSuccess, // Only fetch when we've been able to get the requirements
    },
  );
};
