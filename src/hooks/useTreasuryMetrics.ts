import { useState } from "react";
import { TokenRecord_Filter, TokenSupply_Filter } from "src/generated/graphql";
import {
  getGOhmSyntheticSupply,
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmBacked,
  getLiquidBackingPerOhmFloating,
  getOhmBackedSupply,
  getOhmFloatingSupply,
  getTreasuryAssetValue,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useIndexOnDate, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";
import { useOhmCirculatingSupply } from "src/hooks/useTokenSupplyMetrics";

/**
 * OHM price * circulating supply
 *
 * @param subgraphUrl
 * @returns [marketCap, ohmPrice, circulatingSupply]
 */
export const useMarketCap = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): [number, number, number] => {
  const ohmPriceQuery = useOhmPrice(subgraphUrls?.Ethereum);
  const ohmPrice = ohmPriceQuery.data || 0;
  const circulatingSupply = useOhmCirculatingSupply(subgraphUrls, earliestDate);
  return [circulatingSupply * ohmPrice, ohmPrice, circulatingSupply];
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @param subgraphUrl
 * @returns [liquidBackingPerBackedOhm, liquidBacking, backedOhm]
 */
export const useLiquidBackingPerOhmBacked = (
  subgraphUrls?: SUBGRAPH_URLS,
  earliestDate?: string | null,
): [number, number, number] => {
  const chartName = "LiquidBackingPerOhmBacked";
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});
  const [tokenRecordBaseFilter] = useState<TokenRecord_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(chartName, subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  const recordQuery = useTokenRecordsQueries(chartName, subgraphUrls, tokenRecordBaseFilter, earliestDate);
  const recordData = recordQuery && Array.from(recordQuery).length > 0 ? Array.from(recordQuery)[0][1] : [];
  const liquidBackingQuery: number = getTreasuryAssetValue(recordData, true);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const latestIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);
  const latestIndex = latestIndexQuery.data || 0;

  return [
    getLiquidBackingPerOhmBacked(liquidBackingQuery, supplyData, latestIndex),
    liquidBackingQuery,
    getOhmBackedSupply(supplyData, latestIndex),
  ];
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @param subgraphUrl
 * @returns [liquidBackingPerFloatingOhm, liquidBacking, floatingOhm]
 */
export const useLiquidBackingPerOhmFloating = (
  subgraphUrls?: SUBGRAPH_URLS,
  earliestDate?: string | null,
): [number, number, number] => {
  const chartName = "LiquidBackingPerOhmFloating";
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});
  const [tokenRecordBaseFilter] = useState<TokenRecord_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(chartName, subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  const recordQuery = useTokenRecordsQueries(chartName, subgraphUrls, tokenRecordBaseFilter, earliestDate);
  const recordData = recordQuery && Array.from(recordQuery).length > 0 ? Array.from(recordQuery)[0][1] : [];
  const liquidBackingQuery: number = getTreasuryAssetValue(recordData, true);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const latestIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);
  const latestIndex = latestIndexQuery.data || 0;

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
export const useLiquidBackingPerGOhm = (
  subgraphUrls?: SUBGRAPH_URLS,
  earliestDate?: string | null,
): [number, number, number, number, number] => {
  const chartName = "LiquidBackingPerGOhm";
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});
  const [tokenRecordBaseFilter] = useState<TokenRecord_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(chartName, subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  const recordQuery = useTokenRecordsQueries(chartName, subgraphUrls, tokenRecordBaseFilter, earliestDate);
  const recordData = recordQuery && Array.from(recordQuery).length > 0 ? Array.from(recordQuery)[0][1] : [];
  const liquidBackingQuery: number = getTreasuryAssetValue(recordData, true);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const latestIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);
  const latestIndex = latestIndexQuery.data || 0;

  const ohmFloatingSupply = getOhmFloatingSupply(supplyData, latestIndex);

  return [
    getLiquidBackingPerGOhmSynthetic(liquidBackingQuery, latestIndex, supplyData),
    liquidBackingQuery,
    getGOhmSyntheticSupply(latestIndex, ohmFloatingSupply),
    latestIndex,
    ohmFloatingSupply,
  ];
};
