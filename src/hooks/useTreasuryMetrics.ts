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
import {
  useTokenRecordsQueryLatestCompleteData,
  useTokenSuppliesQueryLatestCompleteData,
} from "src/hooks/useFederatedSubgraphQuery";
import { useCurrentIndex, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useOhmCirculatingSupply } from "src/hooks/useTokenSupplyMetrics";

/**
 * OHM price * circulating supply
 *
 * @returns [marketCap, ohmPrice, circulatingSupply]
 */
export const useMarketCap = (
  earliestDate?: string | null,
): [number | undefined, number | undefined, number | undefined] => {
  // Query hooks
  const ohmPriceQuery: number | undefined = useOhmPrice();
  const circulatingSupplyQuery = useOhmCirculatingSupply(earliestDate);

  // State variables
  const [ohmPrice, setOhmPrice] = useState<number>();
  const [circulatingSupply, setCirculatingSupply] = useState<number>();
  const [marketCap, setMarketCap] = useState<number>();

  useEffect(() => {
    if (!ohmPriceQuery || !circulatingSupplyQuery) {
      setOhmPrice(undefined);
      setCirculatingSupply(undefined);
      setMarketCap(undefined);
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
  const latestRecordData = useTokenRecordsQueryLatestCompleteData(earliestDate);
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [liquidBackingPerOhmBacked, setLiquidBackingPerOhmBacked] = useState(0);
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [backedSupply, setBackedSupply] = useState(0);

  useEffect(() => {
    if (!latestRecordData || !latestIndexQuery || !latestSupplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(latestRecordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempLiquidBackingPerOhmBacked = getLiquidBackingPerOhmBacked(
      tempLiquidBacking,
      latestSupplyData,
      latestIndexQuery,
    );
    setLiquidBackingPerOhmBacked(tempLiquidBackingPerOhmBacked);

    const tempBackedSupply = getOhmBackedSupply(latestSupplyData, latestIndexQuery)[0];
    setBackedSupply(tempBackedSupply);
  }, [latestIndexQuery, latestRecordData, latestSupplyData]);

  return [liquidBackingPerOhmBacked, liquidBacking, backedSupply];
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @returns [liquidBackingPerFloatingOhm, liquidBacking, floatingOhm]
 */
export const useLiquidBackingPerOhmFloating = (earliestDate?: string | null): [number, number, number] => {
  // Query hooks
  const latestRecordData = useTokenRecordsQueryLatestCompleteData(earliestDate);
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [liquidBackingPerOhmFloating, setLiquidBackingPerOhmFloating] = useState(0);
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [floatingSupply, setFloatingSupply] = useState(0);

  useEffect(() => {
    if (!latestRecordData || !latestIndexQuery || !latestSupplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(latestRecordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempLiquidBackingPerOhmFloating = getLiquidBackingPerOhmFloating(
      tempLiquidBacking,
      latestSupplyData,
      latestIndexQuery,
    );
    setLiquidBackingPerOhmFloating(tempLiquidBackingPerOhmFloating);

    const tempFloatingSupply = getOhmFloatingSupply(latestSupplyData, latestIndexQuery)[0];
    setFloatingSupply(tempFloatingSupply);
  }, [latestIndexQuery, latestRecordData, latestSupplyData]);

  return [liquidBackingPerOhmFloating, liquidBacking, floatingSupply];
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
 * @returns [liquidBackingPerGOhm, liquidBacking, gOHMSupply, latestIndex, ohmFloatingSupply]
 */
export const useLiquidBackingPerGOhm = (earliestDate?: string | null): [number, number, number, number, number] => {
  // Query hooks
  const latestRecordData = useTokenRecordsQueryLatestCompleteData(earliestDate);
  const latestSupplyData = useTokenSuppliesQueryLatestCompleteData(earliestDate);
  const latestIndexQuery = useCurrentIndex();

  // State variables
  const [liquidBacking, setLiquidBacking] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floatingSupply, setFloatingSupply] = useState(0);
  const [liquidBackingPerGOhm, setLiquidBackingPerGOhm] = useState(0);
  const [gOhmSupply, setGOhmSupply] = useState(0);

  useEffect(() => {
    if (!latestRecordData || !latestIndexQuery || !latestSupplyData) {
      return;
    }

    const tempLiquidBacking = getTreasuryAssetValue(latestRecordData, true);
    setLiquidBacking(tempLiquidBacking);

    const tempCurrentIndex = latestIndexQuery;
    setCurrentIndex(tempCurrentIndex);

    const tempFloatingSupply = getOhmFloatingSupply(latestSupplyData, tempCurrentIndex)[0];
    setFloatingSupply(tempFloatingSupply);

    setLiquidBackingPerGOhm(getLiquidBackingPerGOhmSynthetic(tempLiquidBacking, tempCurrentIndex, latestSupplyData));

    setGOhmSupply(getGOhmSyntheticSupply(tempCurrentIndex, tempFloatingSupply));
  }, [latestIndexQuery, latestRecordData, latestSupplyData]);

  return [liquidBackingPerGOhm, liquidBacking, gOhmSupply, currentIndex, floatingSupply];
};
