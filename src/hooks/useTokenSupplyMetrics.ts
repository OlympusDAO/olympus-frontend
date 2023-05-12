import { useEffect, useState } from "react";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
  getOhmTotalSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenSuppliesQueryLatestCompleteData } from "src/hooks/useFederatedSubgraphQuery";
import { useCurrentIndex } from "src/hooks/useProtocolMetrics";

export const useOhmCirculatingSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      return;
    }

    setCirculatingSupply(getOhmCirculatingSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return circulatingSupply;
};

export const useOhmFloatingSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [floatingSupply, setFloatingSupply] = useState(0);

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      return;
    }

    setFloatingSupply(getOhmFloatingSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return floatingSupply;
};

export const useOhmBackedSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [backedSupply, setBackedSupply] = useState(0);

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      return;
    }

    setBackedSupply(getOhmBackedSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return backedSupply;
};

export const useOhmTotalSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (!latestSupplyData || !latestSupplyData.length || !latestIndexQuery) {
      return;
    }

    setTotalSupply(getOhmTotalSupply(latestSupplyData, latestIndexQuery)[0]);
  }, [latestIndexQuery, latestSupplyData]);

  return totalSupply;
};
