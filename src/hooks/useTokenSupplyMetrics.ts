import { useState } from "react";
import { TokenSupply_Filter } from "src/generated/graphql";
import {
  getGOhmSyntheticSupply,
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useIndexOnDate } from "src/hooks/useProtocolMetrics";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";

export const useOhmCirculatingSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("CirculatingSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);

  return getOhmCirculatingSupply(supplyData, currentIndexQuery.data || 0);
};

export const useOhmFloatingSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("FloatingSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);

  return getOhmFloatingSupply(supplyData, currentIndexQuery.data || 0);
};

export const useOhmBackedSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("BackedSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);

  return getOhmBackedSupply(supplyData, currentIndexQuery.data || 0);
};

export const useGOhmSyntheticSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null) => {
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("GOhmSyntheticSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  const latestDate: string = supplyData.length ? supplyData[0].date : "";

  // Ensures that the index for the day is displayed. Otherwise metrics will be inconsistent.
  const currentIndexQuery = useIndexOnDate(latestDate, subgraphUrls?.Ethereum);

  return getGOhmSyntheticSupply(
    currentIndexQuery.data || 0,
    getOhmFloatingSupply(supplyData, currentIndexQuery.data || 0),
  );
};
