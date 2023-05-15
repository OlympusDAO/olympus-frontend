import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { createHooks } from "@wundergraph/react-query";
import { useEffect, useState } from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { CHAIN_ETHEREUM } from "src/helpers/subgraph/Constants";

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

/**
 * Returns TokenRecords objects from the {startDate}.
 *
 * The query will only be enabled if the {startDate} is set.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @returns
 */
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
export const useTokenRecordsQueryComplete = (startDate: string | null | undefined): TokenRecord[] | undefined => {
  const { data: tokenRecordResults } = useTokenRecordsQuery(startDate);
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

    // Get the latest date across all chains
    const ethereumResults = sortedResults.filter(result => result.blockchain === CHAIN_ETHEREUM);
    if (ethereumResults.length == 0) {
      setUntilLatestDateResults(undefined);
      return;
    }

    // Restrict to the latest date
    const latestDateEthereum: Date = new Date(ethereumResults[0].date);
    const _untilLatestDateResults = sortedResults.filter(
      result => new Date(result.date).getTime() <= latestDateEthereum.getTime(),
    );

    setUntilLatestDateResults(_untilLatestDateResults);
  }, [tokenRecordResults]);

  return untilLatestDateResults;
};

/**
 * Returns TokenRecord records for the latest date that is considered complete.
 *
 * @param startDate
 * @returns TokenRecord[] or undefined if there are no results
 */
export const useTokenRecordsQueryLatestCompleteData = (
  startDate: string | null | undefined,
): TokenRecord[] | undefined => {
  const tokenRecordResults = useTokenRecordsQueryComplete(startDate);
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
 * Returns TokenRecord records for which the data for a given day is complete.
 *
 * For example, if the data for 2023-05-11 is missing Ethereum records,
 * then the latest data returned will be for 2023-05-10.
 *
 * Uses {useTokenRecordsQuery} under the hood.
 *
 * @param startDate Date string in YYYY-MM-DD format.
 * @returns TokenSupply[] or undefined if there are no results
 */
export const useTokenSuppliesQueryComplete = (startDate: string | null | undefined): TokenSupply[] | undefined => {
  const { data: tokenSupplyResults } = useTokenSuppliesQuery(startDate);
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

    // Get the latest date across all chains
    const ethereumResults = sortedResults.filter(result => result.blockchain === CHAIN_ETHEREUM);
    if (ethereumResults.length == 0) {
      setUntilLatestDateResults(undefined);
      return;
    }

    // Restrict to the latest date
    const latestDateEthereum: Date = new Date(ethereumResults[0].date);
    const _untilLatestDateResults = sortedResults.filter(
      result => new Date(result.date).getTime() <= latestDateEthereum.getTime(),
    );

    setUntilLatestDateResults(_untilLatestDateResults);
  }, [tokenSupplyResults]);

  return untilLatestDateResults;
};

/**
 * Returns TokenSupply records for the latest date that is considered complete.
 *
 * @param startDate
 * @returns TokenSupply[] or undefined if there are no results
 */
export const useTokenSuppliesQueryLatestCompleteData = (
  startDate: string | null | undefined,
): TokenSupply[] | undefined => {
  const tokenSupplyResults = useTokenSuppliesQueryComplete(startDate);
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
