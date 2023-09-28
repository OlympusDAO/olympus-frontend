import { useEffect, useState } from "react";
import { useMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

export const useOhmCirculatingSupply = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery({ ignoreCache });

  // State variables
  const [circulatingSupply, setCirculatingSupply] = useState<number>();

  useEffect(() => {
    if (!metricResult) {
      setCirculatingSupply(undefined);
      return;
    }

    setCirculatingSupply(metricResult.ohmCirculatingSupply);
  }, [metricResult]);

  return circulatingSupply;
};

export const useOhmFloatingSupply = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery({ ignoreCache });

  // State variables
  const [floatingSupply, setFloatingSupply] = useState<number>();

  useEffect(() => {
    if (!metricResult) {
      setFloatingSupply(undefined);
      return;
    }

    setFloatingSupply(metricResult.ohmFloatingSupply);
  }, [metricResult]);

  return floatingSupply;
};

export const useOhmBackedSupply = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery({ ignoreCache });

  // State variables
  const [backedSupply, setBackedSupply] = useState<number>();

  useEffect(() => {
    if (!metricResult) {
      setBackedSupply(undefined);
      return;
    }

    setBackedSupply(metricResult.ohmBackedSupply);
  }, [metricResult]);

  return backedSupply;
};

export const useOhmTotalSupply = ({ ignoreCache }: { ignoreCache?: boolean }): number | undefined => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery({ ignoreCache });

  // State variables
  const [totalSupply, setTotalSupply] = useState<number>();

  useEffect(() => {
    if (!metricResult) {
      setTotalSupply(undefined);
      return;
    }

    setTotalSupply(metricResult.ohmTotalSupply);
  }, [metricResult]);

  return totalSupply;
};
