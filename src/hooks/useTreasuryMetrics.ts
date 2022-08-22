import { getSubgraphUrl } from "src/constants";
import { useTokenSuppliesQuery } from "src/generated/graphql";
import { useCurrentIndex, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useTokenRecordsLatestDate, useTreasuryLiquidValue } from "src/hooks/useTokenRecords";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getOhmCirculatingSupply } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";
import {
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmFloating,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TreasuryQueryHelper";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

/**
 * OHM price * circulating supply
 *
 * @param subgraphUrl
 * @returns
 */
export const useMarketCap = (subgraphUrl?: string) => {
  const ohmPriceQuery = useOhmPrice(subgraphUrl);
  const latestDateQuery = useTokenRecordsLatestDate(subgraphUrl);

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { date: latestDateQuery.data },
    },
    {
      select: data => getOhmCirculatingSupply(data.tokenSupplies) * (ohmPriceQuery.data || 0),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && ohmPriceQuery.isSuccess, // Only fetch when we've been able to get the latest date and price
    },
  );
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @param subgraphUrl
 * @returns
 */
export const useLiquidBackingPerOhmFloating = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestDate(subgraphUrl);
  const liquidBackingQuery = useTreasuryLiquidValue(subgraphUrl);

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { date: latestDateQuery.data },
    },
    {
      select: data => getLiquidBackingPerOhmFloating(liquidBackingQuery.data || 0, data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && liquidBackingQuery.isSuccess, // Only fetch when we've been able to get the latest date and liquid backing
    },
  );
};

/**
 * Liquid backing value / gOHM floating supply
 *
 * @param subgraphUrl
 * @returns
 */
export const useLiquidBackingPerGOhm = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestDate(subgraphUrl);
  const liquidBackingQuery = useTreasuryLiquidValue(subgraphUrl);
  const currentIndexQuery = useCurrentIndex(subgraphUrl);

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { date: latestDateQuery.data },
    },
    {
      select: data =>
        getLiquidBackingPerGOhmSynthetic(liquidBackingQuery.data || 0, currentIndexQuery.data || 0, data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && liquidBackingQuery.isSuccess && currentIndexQuery.isSuccess, // Only fetch when we've been able to get the requirements
    },
  );
};
