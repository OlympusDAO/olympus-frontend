import { Snapshot, useGetSnapshots } from "src/generated/coolerLoans";
import { getISO8601String } from "src/helpers/DateHelper";

export const useCoolerSnapshot = (startDate?: Date) => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const { data, isLoading } = useGetSnapshots(
    {
      startDate: startDate ? getISO8601String(startDate) : "", // Will not be set if startDate is undefined
      beforeDate: getISO8601String(tomorrowDate),
    },
    {
      query: {
        enabled: !!startDate, // Don't query if the startDate is not set
      },
    },
  );

  return {
    data: data?.records,
    isLoading,
  };
};

export const useCoolerSnapshotLatest = () => {
  // Go back 2 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);

  const { data, isLoading } = useCoolerSnapshot(startDate);

  const latestSnapshot = data ? data[data.length - 1] : undefined;

  return {
    latestSnapshot,
    isLoading,
  };
};

export const getClearinghouseCapacity = (snapshot: Snapshot | undefined): number => {
  if (!snapshot) {
    return 0;
  }

  const daiBalance = snapshot.clearinghouse?.daiBalance || 0;
  const sDaiInDaiBalance = snapshot.clearinghouse?.sDaiInDaiBalance || 0;

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

export const getTreasuryCapacity = (snapshot: Snapshot | undefined): number => {
  if (!snapshot) {
    return 0;
  }

  const daiBalance = snapshot.treasury?.daiBalance || 0;
  const sDaiInDaiBalance = snapshot.treasury?.sDaiInDaiBalance || 0;

  return daiBalance + sDaiInDaiBalance;
};
