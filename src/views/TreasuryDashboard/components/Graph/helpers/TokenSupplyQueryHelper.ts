import { TokenSupply } from "src/hooks/useFederatedSubgraphQuery";

export const getDateTokenSupplyMap = (records: TokenSupply[]): Map<string, TokenSupply[]> => {
  const dateMap = new Map<string, TokenSupply[]>();
  records.map(value => {
    // Group all records by date
    const currentDateRecords = dateMap.get(value.date) || [];
    currentDateRecords.push(value);
    dateMap.set(value.date, currentDateRecords);
  });

  return dateMap;
};

export const getLatestTimestamp = (records: TokenSupply[]): number => {
  return (
    records.reduce((previousValue: number, currentValue: TokenSupply) => {
      if (previousValue == -1) return +currentValue.timestamp;

      if (+currentValue.timestamp > previousValue) return +currentValue.timestamp;

      return previousValue;
    }, -1) * 1000 // To convert from second to millisecond accuracy
  );
};
