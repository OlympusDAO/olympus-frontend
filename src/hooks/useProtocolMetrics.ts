import { useProtocolMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

export const useTotalValueDeposited = (): number | undefined => {
  const { data } = useProtocolMetricsLatestQuery();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].totalValueLocked;
};

/**
 * Returns the latest OHM price (in USD).
 *
 * This data is fetched from the subgraph, and will not reflect market rates.
 * Do NOT use this if you need real-time data. Instead, use `useOhmPrice` from
 * `src/hooks/usePrices.ts`.
 *
 * @returns
 */
export const useOhmPrice = (): number | undefined => {
  const { data } = useProtocolMetricsLatestQuery();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].ohmPrice;
};

/**
 * Returns the latest gOHM price (in USD).
 *
 * This data is fetched from the subgraph, and will not reflect market rates.
 * Do NOT use this if you need real-time data. Instead, use `useGohmPrice` from
 * `src/hooks/usePrices.ts`.
 *
 * @returns
 */
export const useGOhmPrice = (): number | undefined => {
  const { data } = useProtocolMetricsLatestQuery();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].gOhmPrice;
};

/**
 * Determines the current index.
 *
 * @returns
 */
export const useCurrentIndex = (): number | undefined => {
  const { data } = useProtocolMetricsLatestQuery();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].currentIndex;
};
