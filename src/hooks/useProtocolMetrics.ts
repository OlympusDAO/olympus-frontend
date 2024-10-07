import { useMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

export const useTotalValueDeposited = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  const { data } = useMetricsLatestQuery({ ignoreCache });

  if (!data) {
    return undefined;
  }

  return data.sOhmTotalValueLocked;
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
