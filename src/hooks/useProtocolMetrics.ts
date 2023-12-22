import { useMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

export const useTotalValueDeposited = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  const { data } = useMetricsLatestQuery({ ignoreCache });

  if (!data) {
    return undefined;
  }

  return data.sOhmTotalValueLocked;
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
export const useOhmPrice = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  const { data } = useMetricsLatestQuery({ ignoreCache });

  if (!data) {
    return undefined;
  }

  return data.ohmPrice;
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
export const useGOhmPrice = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  const { data } = useMetricsLatestQuery({ ignoreCache });

  if (!data) {
    return undefined;
  }

  return data.gOhmPrice;
};

/**
 * Determines the current index.
 *
 * @returns
 */
export const useCurrentIndex = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  const { data } = useMetricsLatestQuery({ ignoreCache });

  if (!data) {
    return undefined;
  }

  return data.ohmIndex;
};
