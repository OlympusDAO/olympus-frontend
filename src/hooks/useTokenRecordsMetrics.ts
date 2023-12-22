import { useEffect, useState } from "react";
import { useMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

/**
 * Fetches the market value of treasury assets across all chains from the subgraph.
 *
 * @returns
 */
export const useTreasuryMarketValueLatest = (ignoreCache?: boolean): number | undefined => {
  // State variables
  const [assetValue, setAssetValue] = useState<number>();

  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery({ ignoreCache });

  useEffect(() => {
    if (!metricResult) {
      setAssetValue(undefined);
      return;
    }

    setAssetValue(metricResult.treasuryMarketValue);
  }, [metricResult]);

  return assetValue;
};
