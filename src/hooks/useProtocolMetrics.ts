import { useFederatedSubgraphQuery } from "src/hooks/useFederatedSubgraphQuery";

export const useLatestProtocolMetric = () => {
  return useFederatedSubgraphQuery({
    operationName: "latest/protocolMetrics",
  });
};

export const useProtocolMetricOnDate = (date: string | undefined) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/protocolMetrics",
    input: {
      startDate: date || "",
    },
    enabled: date != null && date.length > 0,
  });
};

export const useOhmTotalSupply = (): number | undefined => {
  // TODO shift to calculating across chains
  const { data } = useLatestProtocolMetric();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].ohmTotalSupply;
};

export const useGOhmTotalSupply = (): number | undefined => {
  const { data } = useLatestProtocolMetric();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].gOhmTotalSupply;
};

export const useTotalValueDeposited = (): number | undefined => {
  const { data } = useLatestProtocolMetric();

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
  const { data } = useLatestProtocolMetric();

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
  const { data } = useLatestProtocolMetric();

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
  const { data } = useLatestProtocolMetric();

  if (!data || !data.length) {
    return undefined;
  }

  return +data[0].currentIndex;
};
