import { useState } from "react";
import { TokenSupply_Filter } from "src/generated/graphql";
import {
  getGOhmSyntheticSupply,
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useCurrentIndex } from "src/hooks/useProtocolMetrics";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";

export const useOhmCirculatingSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("CirculatingSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);

  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  return getOhmCirculatingSupply(supplyData, currentIndexQuery.data || 0);
};

export const useOhmFloatingSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("FloatingSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);

  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  return getOhmFloatingSupply(supplyData, currentIndexQuery.data || 0);
};

export const useOhmBackedSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("BackedSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);

  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  return getOhmBackedSupply(supplyData, currentIndexQuery.data || 0);
};

export const useGOhmSyntheticSupply = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null) => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries("GOhmSyntheticSupply", subgraphUrls, tokenSupplyBaseFilter, earliestDate);

  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  return getGOhmSyntheticSupply(
    currentIndexQuery.data || 0,
    getOhmFloatingSupply(supplyData, currentIndexQuery.data || 0),
  );
};
