import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";

const query = `
  query ProtcolMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      runway5k
      timestamp
      ohmPrice
      runway10k
      runway20k
      runway50k
      marketCap
      currentAPY
      totalSupply
      runway7dot5k
      runway2dot5k
      runwayCurrent
      nextEpochRebase
      totalValueLocked
      treasuryOhmDaiPOL
      treasuryOhmFraxPOL
      nextDistributedOhm
      treasuryMarketValue
      treasuryTotalBacking
      ohmCirculatingSupply
      sOhmCirculatingSupply
      treasuryRiskFreeValue
      treasuryDaiMarketValue
      treasuryUstMarketValue
      treasuryFraxMarketValue
      treasuryWETHMarketValue
      treasuryLusdMarketValue
      treasuryWBTCMarketValue
      treasuryDaiRiskFreeValue
      treasuryOtherMarketValue
      treasuryLusdRiskFreeValue
      treasuryXsushiMarketValue
      treasuryFraxRiskFreeValue
    }
  }
`;

interface ProtocolMetrics {
  id: string;
  runway5k: string;
  timestamp: string;
  ohmPrice: string;
  runway10k: string;
  runway20k: string;
  runway50k: string;
  marketCap: string;
  currentAPY: string;
  totalSupply: string;
  runway7dot5k: string;
  runway2dot5k: string;
  runwayCurrent: string;
  nextEpochRebase: string;
  totalValueLocked: string;
  treasuryOhmDaiPOL: string;
  treasuryOhmFraxPOL: string;
  nextDistributedOhm: string;
  treasuryMarketValue: string;
  treasuryTotalBacking: string;
  ohmCirculatingSupply: string;
  sOhmCirculatingSupply: string;
  treasuryRiskFreeValue: string;
  treasuryDaiMarketValue: string;
  treasuryUstMarketValue: string;
  treasuryFraxMarketValue: string;
  treasuryWETHMarketValue: string;
  treasuryLusdMarketValue: string;
  treasuryWBTCMarketValue: string;
  treasuryDaiRiskFreeValue: string;
  treasuryOtherMarketValue: string;
  treasuryLusdRiskFreeValue: string;
  treasuryXsushiMarketValue: string;
  treasuryFraxRiskFreeValue: string;
}

type ProtocolMetricsNumbers = Record<keyof ProtocolMetrics, number>;

export const protocolMetricsQueryKey = () => ["useProtocolMetrics"];

export const useProtocolMetrics = <TSelectData = unknown>(select?: (data: ProtocolMetricsNumbers[]) => TSelectData) => {
  return useQuery<ProtocolMetricsNumbers[], Error, TSelectData>(
    protocolMetricsQueryKey(),
    async () => {
      const response = await apollo<{ protocolMetrics: ProtocolMetrics[] }>(query);

      if (!response) throw new Error("No response from TheGraph");

      // Convert all strings to numbers
      return response.data.protocolMetrics.map(metric =>
        Object.entries(metric).reduce(
          (obj, [key, value]) => Object.assign(obj, { [key]: parseFloat(value) }),
          {} as ProtocolMetricsNumbers,
        ),
      );
    },
    { select },
  );
};

export const useMarketCap = () => useProtocolMetrics(metrics => metrics[0].marketCap);
export const useTotalSupply = () => useProtocolMetrics(metrics => metrics[0].totalSupply);
export const useTotalValueDeposited = () => useProtocolMetrics(metrics => metrics[0].totalValueLocked);
export const useTreasuryMarketValue = () => useProtocolMetrics(metrics => metrics[0].treasuryMarketValue);
export const useTreasuryTotalBacking = () => useProtocolMetrics(metrics => metrics[0].treasuryTotalBacking);
export const useOhmCirculatingSupply = () => useProtocolMetrics(metrics => metrics[0].ohmCirculatingSupply);
