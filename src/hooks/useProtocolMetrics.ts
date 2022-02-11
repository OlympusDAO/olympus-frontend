import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";

const query = `
  query {
    protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
      timestamp
      marketCap
      totalSupply
      nextEpochRebase
      totalValueLocked
      nextDistributedOhm
      treasuryMarketValue
      ohmCirculatingSupply
      sOhmCirculatingSupply
    }
  }
`;

interface ProtocolMetrics {
  readonly timestamp: string;
  readonly marketCap: string;
  readonly totalSupply: string;
  readonly totalValueLocked: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
  readonly treasuryMarketValue: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
}

export const protocolMetricsQueryKey = () => ["useProtocolMetrics"];

export const useProtocolMetrics = <TSelectData = unknown>(select: (data: ProtocolMetrics) => TSelectData) => {
  return useQuery<ProtocolMetrics, Error, TSelectData>(
    protocolMetricsQueryKey(),
    async () => {
      const response = await apollo<{ protocolMetrics: ProtocolMetrics[] }>(query);

      if (!response) throw new Error("No response from TheGraph");

      const [metrics] = response.data.protocolMetrics;

      return metrics;
    },
    { select },
  );
};

export const useMarketCap = () => {
  return useProtocolMetrics<number>(metrics => parseFloat(metrics.marketCap));
};

export const useTotalSupply = () => {
  return useProtocolMetrics<number>(metrics => parseFloat(metrics.totalSupply));
};

export const useTreasuryMarketValue = () => {
  return useProtocolMetrics<number>(metrics => parseFloat(metrics.treasuryMarketValue));
};

export const useOhmCirculatingSupply = () => {
  return useProtocolMetrics<number>(metrics => parseFloat(metrics.ohmCirculatingSupply));
};
