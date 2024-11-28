import { useMemo } from "react";
import { Snapshot, useGetCurrentSnapshot, useGetSnapshots } from "src/generated/coolerLoans";
import { getISO8601String } from "src/helpers/DateHelper";

/**
 * Get the Cooler Loans snapshots for a given date range
 *
 * @param startDate - The start date of the range
 * @param beforeDate - The end date of the range
 * @returns The snapshots for the given date range, sorted in descending order
 */
export const useCoolerSnapshot = (startDate?: Date, beforeDate?: Date) => {
  let _beforeDate = beforeDate;
  // If there is no beforeDate, set it to tomorrow
  if (!_beforeDate) {
    _beforeDate = new Date();
    _beforeDate.setDate(_beforeDate.getDate() + 1);
  }

  const { data, isLoading } = useGetSnapshots(
    {
      startDate: startDate ? getISO8601String(startDate) : "", // Will not be set if startDate is undefined
      beforeDate: getISO8601String(_beforeDate),
    },
    {
      query: {
        enabled: !!startDate, // Don't query if the startDate is not set
      },
    },
  );

  // Add a timestamp field to each snapshot, and cache the result
  const cachedData = useMemo(() => {
    if (!data || !data.records) {
      return undefined;
    }

    return data.records.map(snapshot => {
      return {
        ...snapshot,
        timestamp: new Date(snapshot.snapshotDate).getTime(),
      };
    });
  }, [data]);

  return {
    data: cachedData,
    isLoading,
  };
};

/**
 * Get the latest Cooler Loans snapshot
 *
 * @returns The latest snapshot, or undefined if there is no snapshot
 */
export const useCurrentCoolerSnapshot = () => {
  const { data, isLoading } = useGetCurrentSnapshot();

  // Add a timestamp field to the snapshot, and cache the result
  const cachedData: Snapshot | undefined = useMemo(() => {
    if (!data || !data.record) {
      return undefined;
    }

    return {
      ...data.record,
      timestamp: new Date(data.record.snapshotDate).getTime(),
    };
  }, [data]);

  return {
    latestSnapshot: cachedData,
    isLoading,
  };
};

export const getClearinghouseCapacity = (snapshot: Snapshot | undefined): number => {
  if (!snapshot) {
    return 0;
  }

  const daiBalance = snapshot.clearinghouseTotals.daiBalance || 0;
  const sDaiInDaiBalance = snapshot.clearinghouseTotals.sDaiInDaiBalance || 0;

  return daiBalance + sDaiInDaiBalance;
};

export const getReceivables = (snapshot: Snapshot | undefined): number => {
  if (!snapshot) {
    return 0;
  }

  const principalReceivables = snapshot.principalReceivables || 0;
  const interestReceivables = snapshot.interestReceivables || 0;

  return principalReceivables + interestReceivables;
};

export const getTotalCapacity = (snapshot: Snapshot | undefined): number => {
  if (!snapshot) {
    return 0;
  }

  const treasuryDaiBalance = snapshot.treasury?.daiBalance || 0;
  const treasurySDaiInDaiBalance = snapshot.treasury?.sDaiInDaiBalance || 0;
  const treasuryUsdsBalance = snapshot.treasury?.usdsBalance || 0;
  const treasurySUsdsInUsdsBalance = snapshot.treasury?.sUsdsInUsdsBalance || 0;

  const clearinghouseDaiBalance = snapshot.clearinghouseTotals.daiBalance || 0;
  const clearinghouseSDaiInDaiBalance = snapshot.clearinghouseTotals.sDaiInDaiBalance || 0;
  const clearinghouseUsdsBalance = snapshot.clearinghouseTotals.usdsBalance || 0;
  const clearinghouseSUsdsInUsdsBalance = snapshot.clearinghouseTotals.sUsdsInUsdsBalance || 0;

  return (
    treasuryDaiBalance +
    treasurySDaiInDaiBalance +
    treasuryUsdsBalance +
    treasurySUsdsInUsdsBalance +
    clearinghouseDaiBalance +
    clearinghouseSDaiInDaiBalance +
    clearinghouseUsdsBalance +
    clearinghouseSUsdsInUsdsBalance
  );
};
