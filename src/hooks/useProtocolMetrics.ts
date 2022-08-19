import { useQuery } from "@tanstack/react-query";
import { getSubgraphUrl } from "src/constants";
import { useProtocolMetricsQuery } from "src/generated/graphql";
import apollo from "src/lib/apolloClient";

const query = `
  query ProtcolMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      block
      currentAPY
      currentIndex
      gOhmPrice
      marketCap
      nextDistributedOhm
      nextEpochRebase
      ohmCirculatingSupply
      ohmFloatingSupply
      ohmPrice
      runway10k
      runway20k
      runway2dot5k
      runway50k
      runway5k
      runway7dot5k
      runwayCurrent
      sOhmCirculatingSupply
      timestamp
      timestampISO8901
      totalSupply
      totalValueLocked
      treasuryDaiMarketValue
      treasuryDaiRiskFreeValue
      treasuryFraxMarketValue
      treasuryFraxRiskFreeValue
      treasuryLiquidBacking
      treasuryLiquidBackingPerOhmFloating
      treasuryLPValue
      treasuryLusdMarketValue
      treasuryLusdRiskFreeValue
      treasuryMarketValue
      treasuryOhmDaiPOL
      treasuryOhmFraxPOL
      treasuryOtherMarketValue
      treasuryRiskFreeValue
      treasuryStableValue
      treasuryTotalBacking
      treasuryUstMarketValue
      treasuryVolatileValue
      treasuryWBTCMarketValue
      treasuryWETHMarketValue
      treasuryXsushiMarketValue
    }
  }
`;

interface ProtocolMetrics {
  id: string;
  block: string;
  currentAPY: string;
  currentIndex: string;
  gOhmPrice: string;
  marketCap: string;
  nextDistributedOhm: string;
  nextEpochRebase: string;
  ohmCirculatingSupply: string;
  ohmFloatingSupply: string;
  ohmPrice: string;
  runway10k: string;
  runway20k: string;
  runway2dot5k: string;
  runway50k: string;
  runway5k: string;
  runway7dot5k: string;
  runwayCurrent: string;
  sOhmCirculatingSupply: string;
  timestamp: string;
  timestampISO8901: string;
  totalSupply: string;
  totalValueLocked: string;
  treasuryDaiMarketValue: string;
  treasuryDaiRiskFreeValue: string;
  treasuryFraxMarketValue: string;
  treasuryFraxRiskFreeValue: string;
  treasuryLiquidBacking: string;
  treasuryLiquidBackingPerOhmFloating: string;
  treasuryLPValue: string;
  treasuryLusdMarketValue: string;
  treasuryLusdRiskFreeValue: string;
  treasuryMarketValue: string;
  treasuryOhmDaiPOL: string;
  treasuryOhmFraxPOL: string;
  treasuryOtherMarketValue: string;
  treasuryRiskFreeValue: string;
  treasuryStableValue: string;
  treasuryTotalBacking: string;
  treasuryUstMarketValue: string;
  treasuryVolatileValue: string;
  treasuryWBTCMarketValue: string;
  treasuryWETHMarketValue: string;
  treasuryXsushiMarketValue: string;
}

export type ProtocolMetricsNumbers = Record<keyof ProtocolMetrics, number>;

export const protocolMetricsQueryKey = () => ["useProtocolMetrics"];
export const protocolMetricsLiquidBackingPerOhmQueryKey = () => ["useProtocolMetricsLiquidBackingPerOhm"];

/**
 *
 * @deprecated This function is being phased out. Use a more specific react-query hook instead.
 * @param select
 * @returns
 */
export const useProtocolMetrics = <TSelectData = unknown>(select?: (data: ProtocolMetricsNumbers[]) => TSelectData) => {
  return useQuery<ProtocolMetricsNumbers[], Error, TSelectData>(
    [protocolMetricsQueryKey()],
    async () => {
      const response = await apollo<{ protocolMetrics: ProtocolMetrics[] }>(query);

      if (!response) throw new Error("No response from TheGraph");

      // Convert all strings to numbers
      return response.data.protocolMetrics.map(metric =>
        Object.entries(metric).reduce(
          (obj, [key, value]) => Object.assign(obj, { [key]: parseFloat(value) }),
          {} as ProtocolMetricsNumbers,
        ),
      );
    },
    { select },
  );
};

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
