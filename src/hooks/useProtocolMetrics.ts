import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";

const query = `
  query ProtcolMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      block
      currentAPY
      id
      marketCap
      nextDistributedOhm
      nextEpochRebase
      ohmCirculatingSupply
      ohmPrice
      runway10k
      runway20k
      runway2dot5k
      runway50k
      runway5k
      runway7dot5k
      runwayCurrent
      sOhmCirculatingSupply
      timestamp
      timestampISO8901
      totalSupply
      totalValueLocked
      treasuryDaiMarketValue
      treasuryDaiRiskFreeValue
      treasuryFraxMarketValue
      treasuryFraxRiskFreeValue
      treasuryLiquidBacking
      treasuryLusdMarketValue
      treasuryLusdRiskFreeValue
      treasuryMarketValue
      treasuryOhmDaiPOL
      treasuryOhmFraxPOL
      treasuryOtherMarketValue
      treasuryRiskFreeValue
      treasuryTotalBacking
      treasuryUstMarketValue
      treasuryWBTCMarketValue
      treasuryWETHMarketValue
      treasuryXsushiMarketValue
    }
  }
`;

interface ProtocolMetrics {
  id: string;
  block: string;
  timestampISO8901: string;
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
  treasuryLiquidBacking: string;
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
export const useTreasuryLiquidBacking = () => useProtocolMetrics(metrics => metrics[0].treasuryLiquidBacking);
export const useOhmCirculatingSupply = () => useProtocolMetrics(metrics => metrics[0].ohmCirculatingSupply);
