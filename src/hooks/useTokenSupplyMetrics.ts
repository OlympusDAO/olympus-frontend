import {
  getGOhmSyntheticSupply,
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenSuppliesQueryData } from "src/hooks/useFederatedSubgraphQuery";
import { useIndexOnDate } from "src/hooks/useProtocolMetrics";

export const useOhmCirculatingSupply = (earliestDate?: string | null): number => {
  const [supplyData, latestDate] = useTokenSuppliesQueryData(earliestDate);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate) || 0;

  return getOhmCirculatingSupply(supplyData, currentIndexQuery);
};

export const useOhmFloatingSupply = (earliestDate?: string | null): number => {
  const [supplyData, latestDate] = useTokenSuppliesQueryData(earliestDate);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate) || 0;

  return getOhmFloatingSupply(supplyData, currentIndexQuery);
};

export const useOhmBackedSupply = (earliestDate?: string | null): number => {
  const [supplyData, latestDate] = useTokenSuppliesQueryData(earliestDate);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate) || 0;

  return getOhmBackedSupply(supplyData, currentIndexQuery);
};

export const useGOhmSyntheticSupply = (earliestDate?: string | null) => {
  const [supplyData, latestDate] = useTokenSuppliesQueryData(earliestDate);

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate) || 0;

  return getGOhmSyntheticSupply(currentIndexQuery, getOhmFloatingSupply(supplyData, currentIndexQuery));
};
