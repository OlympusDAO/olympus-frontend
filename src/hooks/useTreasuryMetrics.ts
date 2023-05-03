import { useEffect, useState } from "react";
import {
  getGOhmSyntheticSupply,
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmBacked,
  getLiquidBackingPerOhmFloating,
  getOhmBackedSupply,
  getOhmFloatingSupply,
  getTreasuryAssetValue,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenRecordsQueryLatestData, useTokenSuppliesQueryLatestData } from "src/hooks/useFederatedSubgraphQuery";
import { useCurrentIndex, useIndexOnDate, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useOhmCirculatingSupply } from "src/hooks/useTokenSupplyMetrics";

/**
 * OHM price * circulating supply
 *
 * @param subgraphUrl
 * @returns [marketCap, ohmPrice, circulatingSupply]
 */
export const useMarketCap = (earliestDate?: string | null): [number, number, number] => {
  const ohmPrice = useOhmPrice() || 0;
  const circulatingSupply = useOhmCirculatingSupply(earliestDate);
  return [circulatingSupply * ohmPrice, ohmPrice, circulatingSupply];
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @param subgraphUrl
 * @returns [liquidBackingPerBackedOhm, liquidBacking, backedOhm]
 */
export const useLiquidBackingPerOhmBacked = (earliestDate?: string | null): [number, number, number] => {
  const [recordData] = useTokenRecordsQueryLatestData(earliestDate);
  const liquidBacking: number = getTreasuryAssetValue(recordData, true);

  const [supplyData, latestDate] = useTokenSuppliesQueryLatestData(earliestDate);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const latestIndex: number = useIndexOnDate(latestDate) || 0;

  return [
    getLiquidBackingPerOhmBacked(liquidBacking, supplyData, latestIndex),
    liquidBacking,
    getOhmBackedSupply(supplyData, latestIndex),
  ];
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @param subgraphUrl
 * @returns [liquidBackingPerFloatingOhm, liquidBacking, floatingOhm]
 */
export const useLiquidBackingPerOhmFloating = (earliestDate?: string | null): [number, number, number] => {
  const [supplyData, latestDate] = useTokenSuppliesQueryLatestData(earliestDate);

  const [recordData] = useTokenRecordsQueryLatestData(earliestDate);
  const liquidBackingQuery: number = getTreasuryAssetValue(recordData, true);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const latestIndex: number = useIndexOnDate(latestDate) || 0;

  return [
    getLiquidBackingPerOhmFloating(liquidBackingQuery, supplyData, latestIndex),
    liquidBackingQuery,
    getOhmFloatingSupply(supplyData, latestIndex),
  ];
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
 * @param subgraphUrl
 * @returns [liquidBackingPerGOhm, liquidBacking, gOHMSupply, latestIndex, ohmFloatingSupply]
 */
export const useLiquidBackingPerGOhm = (earliestDate?: string | null): [number, number, number, number, number] => {
  // Query hooks
  const [recordData] = useTokenRecordsQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);

  // State variables
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floatingSupply, setFloatingSupply] = useState(0);
  const [liquidBackingPerGOhm, setLiquidBackingPerGOhm] = useState(0);
  const [gOhmSupply, setGOhmSupply] = useState(0);

  useEffect(() => {
    if (!recordData || !latestIndexQuery || !supplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(recordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempCurrentIndex = latestIndexQuery;
    setCurrentIndex(tempCurrentIndex);

    const tempFloatingSupply = getOhmFloatingSupply(supplyData, tempCurrentIndex);
    setFloatingSupply(tempFloatingSupply);

    setLiquidBackingPerGOhm(getLiquidBackingPerGOhmSynthetic(tempLiquidBacking, tempCurrentIndex, supplyData));

    setGOhmSupply(getGOhmSyntheticSupply(tempCurrentIndex, tempFloatingSupply));
  }, [latestIndexQuery, recordData, supplyData]);

  return [liquidBackingPerGOhm, liquidBacking, gOhmSupply, currentIndex, floatingSupply];
};
