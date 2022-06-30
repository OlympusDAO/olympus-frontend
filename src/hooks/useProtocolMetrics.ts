import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";

const query = `
  query ProtcolMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      block
      currentAPY
      currentIndex
      gOhmPrice
      marketCap
      nextDistributedOhm
      nextEpochRebase
      ohmCirculatingSupply
      ohmFloatingSupply
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
      treasuryLiquidBackingPerOhmFloating
      treasuryLPValue
      treasuryLusdMarketValue
      treasuryLusdRiskFreeValue
      treasuryMarketValue
      treasuryOhmDaiPOL
      treasuryOhmFraxPOL
      treasuryOtherMarketValue
      treasuryRiskFreeValue
      treasuryStableValue
      treasuryTotalBacking
      treasuryUstMarketValue
      treasuryVolatileValue
      treasuryWBTCMarketValue
      treasuryWETHMarketValue
      treasuryXsushiMarketValue
    }
  }
`;

interface ProtocolMetrics {
  id: string;
  block: string;
  currentAPY: string;
  currentIndex: string;
  gOhmPrice: string;
  marketCap: string;
  nextDistributedOhm: string;
  nextEpochRebase: string;
  ohmCirculatingSupply: string;
  ohmFloatingSupply: string;
  ohmPrice: string;
  runway10k: string;
  runway20k: string;
  runway2dot5k: string;
  runway50k: string;
  runway5k: string;
  runway7dot5k: string;
  runwayCurrent: string;
  sOhmCirculatingSupply: string;
  timestamp: string;
  timestampISO8901: string;
  totalSupply: string;
  totalValueLocked: string;
  treasuryDaiMarketValue: string;
  treasuryDaiRiskFreeValue: string;
  treasuryFraxMarketValue: string;
  treasuryFraxRiskFreeValue: string;
  treasuryLiquidBacking: string;
  treasuryLiquidBackingPerOhmFloating: string;
  treasuryLPValue: string;
  treasuryLusdMarketValue: string;
  treasuryLusdRiskFreeValue: string;
  treasuryMarketValue: string;
  treasuryOhmDaiPOL: string;
  treasuryOhmFraxPOL: string;
  treasuryOtherMarketValue: string;
  treasuryRiskFreeValue: string;
  treasuryStableValue: string;
  treasuryTotalBacking: string;
  treasuryUstMarketValue: string;
  treasuryVolatileValue: string;
  treasuryWBTCMarketValue: string;
  treasuryWETHMarketValue: string;
  treasuryXsushiMarketValue: string;
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
export const useTreasuryLiquidBackingPerOhmFloating = () =>
  useProtocolMetrics(metrics => metrics[0].treasuryLiquidBackingPerOhmFloating);
export const useOhmCirculatingSupply = () => useProtocolMetrics(metrics => metrics[0].ohmCirculatingSupply);
export const useOhmFloatingSupply = () => useProtocolMetrics(metrics => metrics[0].ohmFloatingSupply);
export const useOhmPrice = () => useProtocolMetrics(metrics => metrics[0].ohmPrice);
export const useGOhmPrice = () => useProtocolMetrics(metrics => metrics[0].gOhmPrice);
export const useCurrentIndex = () => useProtocolMetrics(metrics => metrics[0].currentIndex);
