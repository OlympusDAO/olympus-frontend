import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { createHooks } from "@wundergraph/react-query";

const client = createClient(); // Typesafe WunderGraph client

type PaginatedTokenRecordArray = Exclude<Queries["paginated/tokenRecords"]["response"]["data"], undefined>;
export type PaginatedTokenRecord = PaginatedTokenRecordArray[0];

type PaginatedProtocolMetricArray = Exclude<Queries["paginated/protocolMetrics"]["response"]["data"], undefined>;
export type PaginatedProtocolMetric = PaginatedProtocolMetricArray[0];

type PaginatedTokenSupplyArray = Exclude<Queries["paginated/tokenSupplies"]["response"]["data"], undefined>;
export type PaginatedTokenSupply = PaginatedTokenSupplyArray[0];

export const { useQuery: useFederatedSubgraphQuery } = createHooks<Operations>(client);

export const useTokenRecordsQuery = (startDate: string | null | undefined) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/tokenRecords",
    input: {
      startDate: startDate || "",
    },
    enabled: startDate != null,
  });
};

/**
 * Returns the latest token records for each chain.
 */
export const useTokenRecordsLatestQuery = () => {
  return useFederatedSubgraphQuery({
    operationName: "latest/tokenRecords",
  });
};

export const useTokenSuppliesQuery = (startDate: string | null | undefined) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/tokenSupplies",
    input: {
      startDate: startDate || "",
    },
    enabled: startDate != null,
  });
};

export const useTokenSuppliesQueryData = (startDate: string | null | undefined): [PaginatedTokenSupply[], string] => {
  const { data: tokenSupplyResults } = useTokenSuppliesQuery(startDate);
  const supplyData = tokenSupplyResults && tokenSupplyResults.length > 0 ? tokenSupplyResults : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  return [supplyData, latestDate];
};

export const useProtocolMetricsQuery = (startDate: string | null | undefined) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/protocolMetrics",
    input: {
      startDate: startDate || "",
    },
    enabled: startDate != null,
  });
};
