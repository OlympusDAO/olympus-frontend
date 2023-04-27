import { useState } from "react";
import { TokenSupply_Filter, useTokenSuppliesQuery } from "src/generated/graphql";
import { getDataSource } from "src/graphql/query";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { getSubgraphUrl, SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useCurrentIndex } from "src/hooks/useProtocolMetrics";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";
import { useTokenRecordsLatestBlock } from "src/hooks/useTokenRecordsMetrics";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

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

export const useGOhmSyntheticSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const currentIndexQuery = useCurrentIndex(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    getDataSource(endpoint),
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmFloatingSupply(data.tokenSupplies, currentIndexQuery.data || 0),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && currentIndexQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};
