import { ProtocolMetric } from "src/hooks/useFederatedSubgraphQuery";

export const getDateProtocolMetricMap = (records: ProtocolMetric[]): Map<string, ProtocolMetric[]> => {
  const dateMap = new Map<string, ProtocolMetric[]>();
  records.map(value => {
    // Group all records by date
    const currentDateRecords = dateMap.get(value.date) || [];
    currentDateRecords.push(value);
    dateMap.set(value.date, currentDateRecords);
  });

  return dateMap;
};
