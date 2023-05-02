import { PaginatedTokenSupply } from "src/hooks/useFederatedSubgraphQuery";

export const getDateTokenSupplyMap = (records: PaginatedTokenSupply[]): Map<string, PaginatedTokenSupply[]> => {
  const dateMap = new Map<string, PaginatedTokenSupply[]>();
  records.map(value => {
    // Group all records by date
    const currentDateRecords = dateMap.get(value.date) || [];
    currentDateRecords.push(value);
    dateMap.set(value.date, currentDateRecords);
  });

  return dateMap;
};

export const getLatestTimestamp = (records: PaginatedTokenSupply[]): number => {
  return (
    records.reduce((previousValue: number, currentValue: PaginatedTokenSupply) => {
      if (previousValue == -1) return +currentValue.timestamp;

      if (+currentValue.timestamp > previousValue) return +currentValue.timestamp;

      return previousValue;
    }, -1) * 1000 // To convert from second to millisecond accuracy
  );
};
