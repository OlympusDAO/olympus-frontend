import { useEffect, useState } from "react";
import { useMetricsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

/**
 * OHM price * circulating supply
 *
 * @returns [marketCap, ohmPrice, circulatingSupply]
 */
export const useMarketCap = (
  earliestDate?: string | null,
): [number | undefined, number | undefined, number | undefined] => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery();

  // State variables
  const [ohmPrice, setOhmPrice] = useState<number>();
  const [circulatingSupply, setCirculatingSupply] = useState<number>();
  const [marketCap, setMarketCap] = useState<number>();

  useEffect(() => {
    if (!metricResult) {
      setOhmPrice(undefined);
      setCirculatingSupply(undefined);
      setMarketCap(undefined);
      return;
    }

    setOhmPrice(metricResult.ohmPrice);
    setCirculatingSupply(metricResult.ohmCirculatingSupply);
    setMarketCap(metricResult.marketCap);
  }, [metricResult]);

  return [marketCap, ohmPrice, circulatingSupply];
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @returns [liquidBackingPerBackedOhm, liquidBacking, backedOhm]
 */
export const useLiquidBackingPerOhmBacked = (earliestDate?: string | null): [number, number, number] => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery();

  // State variables
  const [liquidBackingPerOhmBacked, setLiquidBackingPerOhmBacked] = useState(0);
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [backedSupply, setBackedSupply] = useState(0);

  useEffect(() => {
    if (!metricResult) {
      return;
    }

    setLiquidBacking(metricResult.treasuryLiquidBacking);
    setLiquidBackingPerOhmBacked(metricResult.treasuryLiquidBackingPerOhmBacked);
    setBackedSupply(metricResult.ohmBackedSupply);
  }, [metricResult]);

  return [liquidBackingPerOhmBacked, liquidBacking, backedSupply];
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
 * @returns [liquidBackingPerGOhm, liquidBacking, latestIndex, ohmFloatingSupply]
 */
export const useLiquidBackingPerGOhm = (earliestDate?: string | null): [number, number, number, number] => {
  // Query hooks
  const { data: metricResult } = useMetricsLatestQuery();

  // State variables
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backedSupply, setBackedSupply] = useState(0);
  const [liquidBackingPerGOhm, setLiquidBackingPerGOhm] = useState(0);

  useEffect(() => {
    if (!metricResult) {
      return;
    }

    setLiquidBacking(metricResult.treasuryLiquidBacking);
    setCurrentIndex(metricResult.ohmIndex);
    setBackedSupply(metricResult.ohmBackedSupply);
    setLiquidBackingPerGOhm(metricResult.treasuryLiquidBackingPerGOhmBacked);
  }, [metricResult]);

  return [liquidBackingPerGOhm, liquidBacking, currentIndex, backedSupply];
};
