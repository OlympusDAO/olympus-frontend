import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { createHooks } from "@wundergraph/react-query";
import { useEffect, useState } from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";

const wgNodeUrl: string | undefined = Environment.getWundergraphNodeUrl();
const client = createClient({
  ...(wgNodeUrl ? { baseURL: wgNodeUrl } : {}), // Override the wundergraph client's API endpoint if the environment variable is present
}); // Typesafe WunderGraph client

type TokenRecordArray = Exclude<Queries["paginated/tokenRecords"]["response"]["data"], undefined>;
export type TokenRecord = TokenRecordArray[0];

type ProtocolMetricArray = Exclude<Queries["paginated/protocolMetrics"]["response"]["data"], undefined>;
export type ProtocolMetric = ProtocolMetricArray[0];

type TokenSupplyArray = Exclude<Queries["paginated/tokenSupplies"]["response"]["data"], undefined>;
export type TokenSupply = TokenSupplyArray[0];

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
export const useTokenRecordsQueryLatestData = (startDate: string | null | undefined): [TokenRecord[], string] => {
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
): [TokenSupply[], string | undefined] => {
  const { data: tokenSupplyResults } = useTokenSuppliesQuery(startDate);
  const [latestDate, setLatestDate] = useState<string | undefined>();
  const [latestSupplyData, setLatestSupplyData] = useState<TokenSupply[]>([]);

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

export const useProtocolMetricsLatestQuery = () => {
  return useFederatedSubgraphQuery({
    operationName: "latest/protocolMetrics",
  });
};
