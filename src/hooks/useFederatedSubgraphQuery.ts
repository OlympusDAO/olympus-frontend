import { createClient, Operations } from "@olympusdao/treasury-subgraph-client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";

const treasuryDashNodeUrl: string | undefined = Environment.getTreasuryDashNodeUrl();
const client = createClient({
  ...(treasuryDashNodeUrl ? { baseUrl: treasuryDashNodeUrl } : {}), // Override the client's API endpoint if the environment variable is present
}); // Typesafe TreasurySubgraphClient

// Re-export types from the client for convenience
export type TokenRecord = Operations["paginated/tokenRecords"]["response"]["data"][number];
export type TokenSupply = Operations["paginated/tokenSupplies"]["response"]["data"][number];
export type ProtocolMetric = Operations["paginated/protocolMetrics"]["response"]["data"][number];

/**
 * Custom hook wrapping @tanstack/react-query's useQuery.
 *
 * IMPORTANT: The v2.0.0 client returns { data: T }, but we UNWRAP it here
 * to maintain backward compatibility with the old Wundergraph behavior.
 *
 * @returns UseQueryResult where data is the unwrapped value (e.g., Metric[], not { data: Metric[] })
 */
export const useFederatedSubgraphQuery = <K extends keyof Operations, TData = Operations[K]["response"]["data"]>({
  operationName,
  input,
  ...options
}: {
  operationName: K;
  input?: Operations[K]["input"];
  enabled?: boolean;
  retry?: number;
  retryDelay?: number;
} & Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">) => {
  return useQuery<TData>({
    queryKey: [operationName, input] as const,
    queryFn: async (): Promise<TData> => {
      const response = await client.query({ operationName, input });
      // UNWRAP: client returns { data: T }, we return T directly for backward compatibility
      return response.data as TData;
    },
    ...options,
  });
};

/**
 * Returns TokenRecord objects from the {startDate}.
 *
 * The query will only be enabled if the {startDate} is set.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @param crossChainDataComplete If true, returns up (and including) the date with complete cross-chain data.
 * @returns
 */
export const useTokenRecordsQuery = ({
  startDate,
  crossChainDataComplete,
  ignoreCache,
}: {
  startDate: string | null | undefined;
  crossChainDataComplete?: boolean;
  ignoreCache?: boolean;
}) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/tokenRecords",
    input: {
      startDate: startDate || "",
      crossChainDataComplete: crossChainDataComplete || false,
      ignoreCache: ignoreCache || false,
    },
    enabled: startDate != null,
  });
};

/**
 * Returns TokenRecord records for which the data for a given day is complete.
 *
 * For example, if the data for 2023-05-11 is missing Ethereum records,
 * then the latest data returned will be for 2023-05-10.
 *
 * Uses {useTokenRecordsQuery} under the hood.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @returns TokenRecord[] or undefined if there are no results
 */
export const useTokenRecordsQueryComplete = ({
  startDate,
  ignoreCache,
}: {
  startDate: string | null | undefined;
  ignoreCache?: boolean;
}): TokenRecord[] | undefined => {
  const { data: tokenRecordResults } = useTokenRecordsQuery({ startDate, crossChainDataComplete: true, ignoreCache });
  const [untilLatestDateResults, setUntilLatestDateResults] = useState<TokenRecord[]>();

  useEffect(() => {
    if (!tokenRecordResults || tokenRecordResults.length === 0) {
      setUntilLatestDateResults(undefined);
      return;
    }

    // Sort by date descending (just in case)
    const sortedResults = tokenRecordResults.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setUntilLatestDateResults(sortedResults);
  }, [tokenRecordResults]);

  return untilLatestDateResults;
};

/**
 * Returns TokenRecord records for the latest date that is considered complete.
 *
 * @param startDate
 * @returns TokenRecord[] or undefined if there are no results
 */
export const useTokenRecordsQueryLatestCompleteData = ({
  startDate,
  ignoreCache,
}: {
  startDate: string | null | undefined;
  ignoreCache?: boolean;
}): TokenRecord[] | undefined => {
  const tokenRecordResults = useTokenRecordsQueryComplete({ startDate, ignoreCache });
  const [latestData, setLatestData] = useState<TokenRecord[]>();

  useEffect(() => {
    if (!tokenRecordResults || tokenRecordResults.length === 0) {
      setLatestData(undefined);
      return;
    }

    const latestDate: string = tokenRecordResults[0].date;
    const _latestData = tokenRecordResults.filter(record => record.date === latestDate);
    setLatestData(_latestData);
  }, [tokenRecordResults]);

  return latestData;
};

/**
 * Returns the latest token record for each chain.
 *
 * This is useful for determining the latest block that has been indexed.
 */
export const useTokenRecordsLatestQuery = ({ ignoreCache }: { ignoreCache?: boolean }) => {
  return useFederatedSubgraphQuery({
    operationName: "latest/tokenRecords",
    input: {
      ignoreCache: ignoreCache || false,
    },
  });
};

/**
 * Returns TokenSupply objects from the {startDate}.
 *
 * The query will only be enabled if the {startDate} is set.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @param crossChainDataComplete If true, returns up (and including) the date with complete cross-chain data.
 * @returns
 */
export const useTokenSuppliesQuery = ({
  startDate,
  crossChainDataComplete,
  ignoreCache,
}: {
  startDate: string | null | undefined;
  crossChainDataComplete?: boolean;
  ignoreCache?: boolean;
}) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/tokenSupplies",
    input: {
      startDate: startDate || "",
      crossChainDataComplete: crossChainDataComplete || false,
      ignoreCache: ignoreCache || false,
    },
    enabled: startDate != null,
  });
};

/**
 * Returns TokenSupply records for which the data for a given day is complete.
 *
 * For example, if the data for 2023-05-11 is missing Ethereum records,
 * then the latest data returned will be for 2023-05-10.
 *
 * Uses {useTokenSuppliesQuery} under the hood.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @returns TokenSupply[] or undefined if there are no results
 */
export const useTokenSuppliesQueryComplete = ({
  startDate,
  ignoreCache,
}: {
  startDate: string | null | undefined;
  ignoreCache?: boolean;
}): TokenSupply[] | undefined => {
  const { data: tokenSupplyResults } = useTokenSuppliesQuery({ startDate, crossChainDataComplete: true, ignoreCache });
  const [untilLatestDateResults, setUntilLatestDateResults] = useState<TokenSupply[]>();

  useEffect(() => {
    if (!tokenSupplyResults || tokenSupplyResults.length === 0) {
      setUntilLatestDateResults(undefined);
      return;
    }

    // Sort by date descending (just in case)
    const sortedResults = tokenSupplyResults.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setUntilLatestDateResults(sortedResults);
  }, [tokenSupplyResults]);

  return untilLatestDateResults;
};

/**
 * Returns TokenSupply records for the latest date that is considered complete.
 *
 * @param startDate
 * @returns TokenSupply[] or undefined if there are no results
 */
export const useTokenSuppliesQueryLatestCompleteData = ({
  startDate,
  ignoreCache,
}: {
  startDate?: string | null;
  ignoreCache?: boolean;
}): TokenSupply[] | undefined => {
  const tokenSupplyResults = useTokenSuppliesQueryComplete({ startDate, ignoreCache });
  const [latestData, setLatestData] = useState<TokenSupply[]>();

  useEffect(() => {
    if (!tokenSupplyResults || tokenSupplyResults.length === 0) {
      setLatestData(undefined);
      return;
    }

    const latestDate: string = tokenSupplyResults[0].date;
    const _latestData = tokenSupplyResults.filter(record => record.date === latestDate);
    setLatestData(_latestData);
  }, [tokenSupplyResults]);

  return latestData;
};

export const useMetricsQuery = ({
  startDate,
  includeContentRecords,
  ignoreCache,
  crossChainDataComplete,
}: {
  startDate?: string | null;
  includeContentRecords?: boolean;
  ignoreCache?: boolean;
  crossChainDataComplete?: boolean;
}) => {
  return useFederatedSubgraphQuery({
    operationName: "paginated/metrics",
    input: {
      startDate: startDate || "",
      includeRecords: includeContentRecords || false,
      ignoreCache: ignoreCache || false,
      crossChainDataComplete: crossChainDataComplete || true,
    },
    enabled: startDate != null,
    retry: 3, // Queries with long periods and with includeRecords = true will take a while if not cached, leading to a timeout
    retryDelay: 5000,
  });
};

export const useMetricsLatestQuery = ({ ignoreCache }: { ignoreCache?: boolean }) => {
  return useFederatedSubgraphQuery({
    operationName: "latest/metrics",
    input: {
      ignoreCache: ignoreCache || false,
    },
  });
};
