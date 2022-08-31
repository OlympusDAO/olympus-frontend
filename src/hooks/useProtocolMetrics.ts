import { getSubgraphUrl } from "src/constants";
import { useProtocolMetricsQuery } from "src/generated/graphql";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

export const useOhmTotalSupply = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].ohmTotalSupply, ...QUERY_OPTIONS },
  );

export const useGOhmTotalSupply = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].gOhmTotalSupply, ...QUERY_OPTIONS },
  );

export const useTotalValueDeposited = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].totalValueLocked, ...QUERY_OPTIONS },
  );

/**
 * Returns the latest OHM price (in USD).
 *
 * This data is fetched from the subgraph, and will not reflect market rates.
 * Do NOT use this if you need real-time data. Instead, use `useOhmPrice` from
 * `src/hooks/usePrices.ts`.
 *
 * @returns
 */
export const useOhmPrice = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].ohmPrice, ...QUERY_OPTIONS },
  );

/**
 * Returns the latest gOHM price (in USD).
 *
 * This data is fetched from the subgraph, and will not reflect market rates.
 * Do NOT use this if you need real-time data. Instead, use `useGohmPrice` from
 * `src/hooks/usePrices.ts`.
 *
 * @returns
 */
export const useGOhmPrice = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].gOhmPrice, ...QUERY_OPTIONS },
  );

/**
 * Determines the current index.
 *
 * @returns
 */
export const useCurrentIndex = (subgraphUrl?: string) =>
  useProtocolMetricsQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: 1,
    },
    { select: data => data.protocolMetrics[0].currentIndex, ...QUERY_OPTIONS },
  );
