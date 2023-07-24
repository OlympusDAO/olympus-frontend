import { useEffect, useState } from "react";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
  getOhmTotalSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenSuppliesQueryLatestCompleteData } from "src/hooks/useFederatedSubgraphQuery";
import { useCurrentIndex } from "src/hooks/useProtocolMetrics";

export const useOhmCirculatingSupply = (earliestDate?: string | null): number | undefined => {
  // Query hooks
  // TODO replace with calculated metric
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [circulatingSupply, setCirculatingSupply] = useState<number>();

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      setCirculatingSupply(undefined);
      return;
    }

    setCirculatingSupply(getOhmCirculatingSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return circulatingSupply;
};

export const useOhmFloatingSupply = (earliestDate?: string | null): number | undefined => {
  // Query hooks
  // TODO replace with calculated metric
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [floatingSupply, setFloatingSupply] = useState<number>();

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      setFloatingSupply(undefined);
      return;
    }

    setFloatingSupply(getOhmFloatingSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return floatingSupply;
};

export const useOhmBackedSupply = (earliestDate?: string | null): number | undefined => {
  // Query hooks
  // TODO replace with calculated metric
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [backedSupply, setBackedSupply] = useState<number>();

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      setBackedSupply(undefined);
      return;
    }

    setBackedSupply(getOhmBackedSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return backedSupply;
};

export const useOhmTotalSupply = (earliestDate?: string | null): number | undefined => {
  // Query hooks
  // TODO replace with calculated metric
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [totalSupply, setTotalSupply] = useState<number>();

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      setTotalSupply(undefined);
      return;
    }

    setTotalSupply(getOhmTotalSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return totalSupply;
};
