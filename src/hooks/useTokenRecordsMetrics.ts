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
export const useTreasuryAssetsLatestValue = (liquidOnly: boolean): number | undefined => {
  // State variables
  const [latestDate, setLatestDate] = useState<string>();
  const [assetValue, setAssetValue] = useState<number>();

  // Query hooks
  const latestDateQuery = useTokenRecordsLatestDate();
  const [latestTokenRecordData] = useTokenRecordsQueryLatestData(latestDate);

  //
  useEffect(() => {
    if (!latestDateQuery) {
      return;
    }

    console.log(`latest date = ${latestDateQuery}`);
    setLatestDate(latestDateQuery);
  }, [latestDateQuery]);

  useEffect(() => {
    if (!latestTokenRecordData || latestTokenRecordData.length === 0 || !latestDate) {
      console.log(`count = ${latestTokenRecordData.length}`);
      console.log(`date = ${latestDate}`);
      return;
    }

    console.log(`setting asset value`);
    setAssetValue(getTreasuryAssetValue(latestTokenRecordData, liquidOnly));
  }, [latestTokenRecordData, latestDate, liquidOnly]);

  return assetValue;
};
