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
import { useCurrentIndex, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useOhmCirculatingSupply } from "src/hooks/useTokenSupplyMetrics";

/**
 * OHM price * circulating supply
 *
 * @returns [marketCap, ohmPrice, circulatingSupply]
 */
export const useMarketCap = (earliestDate?: string | null): [number, number, number] => {
  // Query hooks
  const ohmPriceQuery: number | undefined = useOhmPrice();
  const circulatingSupplyQuery = useOhmCirculatingSupply(earliestDate);

  // State variables
  const [ohmPrice, setOhmPrice] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);
  const [marketCap, setMarketCap] = useState(0);

  useEffect(() => {
    if (!ohmPriceQuery || !circulatingSupplyQuery) {
      return;
    }

    setOhmPrice(ohmPriceQuery);
    setCirculatingSupply(circulatingSupplyQuery);
    setMarketCap(ohmPriceQuery * circulatingSupplyQuery);
  }, [circulatingSupplyQuery, ohmPriceQuery]);

  return [marketCap, ohmPrice, circulatingSupply];
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @returns [liquidBackingPerBackedOhm, liquidBacking, backedOhm]
 */
export const useLiquidBackingPerOhmBacked = (earliestDate?: string | null): [number, number, number] => {
  // Query hooks
  const [recordData] = useTokenRecordsQueryLatestData(earliestDate);
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [liquidBackingPerOhmBacked, setLiquidBackingPerOhmBacked] = useState(0);
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [backedSupply, setBackedSupply] = useState(0);

  useEffect(() => {
    if (!recordData || !latestIndexQuery || !supplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(recordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempLiquidBackingPerOhmBacked = getLiquidBackingPerOhmBacked(tempLiquidBacking, supplyData, latestIndexQuery);
    setLiquidBackingPerOhmBacked(tempLiquidBackingPerOhmBacked);

    const tempBackedSupply = getOhmBackedSupply(supplyData, latestIndexQuery);
    setBackedSupply(tempBackedSupply);
  }, [latestIndexQuery, recordData, supplyData]);

  return [liquidBackingPerOhmBacked, liquidBacking, backedSupply];
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @returns [liquidBackingPerFloatingOhm, liquidBacking, floatingOhm]
 */
export const useLiquidBackingPerOhmFloating = (earliestDate?: string | null): [number, number, number] => {
  // Query hooks
  const [recordData] = useTokenRecordsQueryLatestData(earliestDate);
  const [supplyData] = useTokenSuppliesQueryLatestData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [liquidBackingPerOhmFloating, setLiquidBackingPerOhmFloating] = useState(0);
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [floatingSupply, setFloatingSupply] = useState(0);

  useEffect(() => {
    if (!recordData || !latestIndexQuery || !supplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(recordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempLiquidBackingPerOhmFloating = getLiquidBackingPerOhmFloating(
      tempLiquidBacking,
      supplyData,
      latestIndexQuery,
    );
    setLiquidBackingPerOhmFloating(tempLiquidBackingPerOhmFloating);

    const tempFloatingSupply = getOhmFloatingSupply(supplyData, latestIndexQuery);
    setFloatingSupply(tempFloatingSupply);
  }, [latestIndexQuery, recordData, supplyData]);

  return [liquidBackingPerOhmFloating, liquidBacking, floatingSupply];
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
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
