import { PaginatedProtocolMetric } from "src/hooks/useFederatedSubgraphQuery";

export const getDateProtocolMetricMap = (
  records: PaginatedProtocolMetric[],
): Map<string, PaginatedProtocolMetric[]> => {
  const dateMap = new Map<string, PaginatedProtocolMetric[]>();
  records.map(value => {
    // Group all records by date
    const currentDateRecords = dateMap.get(value.date) || [];
    currentDateRecords.push(value);
    dateMap.set(value.date, currentDateRecords);
  });

  return dateMap;
};
