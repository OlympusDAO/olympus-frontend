import { useEffect, useState } from "react";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
  getOhmTotalSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenSuppliesQueryLatestData } from "src/hooks/useFederatedSubgraphQuery";
import { useCurrentIndex } from "src/hooks/useProtocolMetrics";

export const useOhmCirculatingSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    if (!supplyData.length || !latestIndexQuery) {
      return;
    }

    setCirculatingSupply(getOhmCirculatingSupply(supplyData, latestIndexQuery));
  }, [latestIndexQuery, supplyData]);

  return circulatingSupply;
};

export const useOhmFloatingSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [floatingSupply, setFloatingSupply] = useState(0);

  useEffect(() => {
    if (!supplyData.length || !latestIndexQuery) {
      return;
    }

    setFloatingSupply(getOhmFloatingSupply(supplyData, latestIndexQuery));
  }, [latestIndexQuery, supplyData]);

  return floatingSupply;
};

export const useOhmBackedSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [backedSupply, setBackedSupply] = useState(0);

  useEffect(() => {
    if (!supplyData.length || !latestIndexQuery) {
      return;
    }

    setBackedSupply(getOhmBackedSupply(supplyData, latestIndexQuery));
  }, [latestIndexQuery, supplyData]);

  return backedSupply;
};

export const useOhmTotalSupply = (earliestDate?: string | null): number => {
  // Query hooks
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (!supplyData.length || !latestIndexQuery) {
      return;
    }

    setTotalSupply(getOhmTotalSupply(supplyData, latestIndexQuery));
  }, [latestIndexQuery, supplyData]);

  return totalSupply;
};
