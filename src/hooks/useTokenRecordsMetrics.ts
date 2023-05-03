import { useEffect, useState } from "react";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenRecordsLatestQuery, useTokenRecordsQueryLatestData } from "src/hooks/useFederatedSubgraphQuery";

export const useTokenRecordsLatestDate = (): string | undefined => {
  const { data } = useTokenRecordsLatestQuery();

  if (!data) {
    return undefined;
  }

  // Get the earliest date across all results
  return data
    .map(result => result.date)
    .reduce((minDate: string, currentDate: string) => {
      if (minDate == "") {
        return currentDate;
      }

      return new Date(currentDate).getTime() < new Date(minDate).getTime() ? currentDate : minDate;
    }, "");
};

/**
 * Fetches the value of treasury assets across all chains from the subgraph.
 *
 * @param liquidOnly
 * @param _earliestDate
 * @returns
 */
const useTreasuryAssets = (_liquidOnly: boolean, _earliestDate?: string): number => {
  const [liquidOnly, setLiquidOnly] = useState(_liquidOnly);
  const [latestDayResult] = useTokenRecordsQueryLatestData(_earliestDate);

  useEffect(() => {
    setLiquidOnly(_liquidOnly);
  }, [_liquidOnly]);

  return getTreasuryAssetValue(latestDayResult, liquidOnly);
};

/**
 * Provides the market value of the treasury for the latest data available in the subgraph.
 *
 * The market value is the sum of all TokenRecord objects in the subgraph, and includes vested/illiquid tokens.
 *
 * @returns react-query result wrapping a number representing the market value of the treasury
 */
export const useTreasuryMarketValue = (_earliestDate?: string): number => {
  return useTreasuryAssets(false, _earliestDate);
};

/**
 * Provides the liquid backing of the treasury for the latest data available in the subgraph.
 *
 * Liquid backing is defined as the value of all liquid assets in the treasury.
 *
 * @returns react-query result wrapping a number representing the liquid backing of the treasury
 */
export const useTreasuryLiquidValue = (_earliestDate?: string): number => {
  return useTreasuryAssets(true, _earliestDate);
};
