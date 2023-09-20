import { Snapshot, useGetSnapshots } from "src/generated/coolerLoans";
import { getISO8601String } from "src/helpers/DateHelper";

export const useCoolerSnapshot = (startDate: Date) => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const { data, isLoading } = useGetSnapshots({
    startDate: getISO8601String(startDate),
    beforeDate: getISO8601String(tomorrowDate),
  });

  return {
    data: data?.records,
    isLoading,
  };
};

export const useCoolerSnapshotLatest = () => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const { data, isLoading } = useGetSnapshots({
    startDate: getISO8601String(new Date()),
    beforeDate: getISO8601String(tomorrowDate),
  });

  const latestSnapshot = data?.records ? data?.records[data?.records.length - 1] : undefined;

  return {
    latestSnapshot,
    isLoading,
  };
};

export const getCapacity = (snapshot: Snapshot | undefined): number => {
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
