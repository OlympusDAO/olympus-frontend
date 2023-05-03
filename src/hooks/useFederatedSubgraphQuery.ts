import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { createHooks } from "@wundergraph/react-query";
import { useEffect, useState } from "react";

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
 * Returns TokenRecord records for the latest date.
 *
 * @param startDate
 * @returns [array of latest TokenRecord records, latest date in YYYY-MM-DD format]
 */
export const useTokenRecordsQueryLatestData = (
  startDate: string | null | undefined,
): [PaginatedTokenRecord[], string] => {
  const { data: tokenRecordResults } = useTokenRecordsQuery(startDate);
  const recordData = tokenRecordResults && tokenRecordResults.length > 0 ? tokenRecordResults : [];
  const latestDate: string = recordData.length ? recordData[0].date : "";
  const latestRecordData = recordData.filter(record => record.date === latestDate);

  return [latestRecordData, latestDate];
};

/**
 * Returns the latest token record for each chain.
 *
 * This is useful for determining the latest block that has been indexed.
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

/**
 * Returns TokenSupply records for the latest date.
 *
 * @param startDate
 * @returns [array of latest TokenSupply records, latest date in YYYY-MM-DD format]
 */
export const useTokenSuppliesQueryLatestData = (
  startDate: string | null | undefined,
): [PaginatedTokenSupply[], string | undefined] => {
  const { data: tokenSupplyResults } = useTokenSuppliesQuery(startDate);
  const [latestDate, setLatestDate] = useState<string | undefined>();
  const [latestSupplyData, setLatestSupplyData] = useState<PaginatedTokenSupply[]>([]);

  useEffect(() => {
    if (!tokenSupplyResults || tokenSupplyResults.length === 0) {
      return;
    }

    const tempLatestDate: string = tokenSupplyResults[0].date;
    setLatestDate(tempLatestDate);
    setLatestSupplyData(tokenSupplyResults.filter(record => record.date === tempLatestDate));
  }, [tokenSupplyResults]);

  return [latestSupplyData, latestDate];
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
