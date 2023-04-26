import { useEffect, useState } from "react";
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
import { useTokenRecordsLatestBlock, useTokenRecordsLatestRecord } from "src/hooks/useTokenRecordsMetrics";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

export const useOhmCirculatingSupply = (subgraphUrls?: SUBGRAPH_URLS): number => {
  const { data } = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter, setTokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  useEffect(() => {
    if (!data) {
      return;
    }

    setTokenSupplyBaseFilter({ date: data.date });
  }, [data]);

  const supplyQuery = useTokenSuppliesQueries("CirculatingSupply", subgraphUrls, tokenSupplyBaseFilter, null);
  console.log(`CirculatingSupply results: ${JSON.stringify(supplyQuery)}`);

  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];
  return getOhmCirculatingSupply(supplyData, currentIndexQuery.data || 0);
};

export const useOhmFloatingSupply = (subgraphUrl?: string) => {
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

export const useOhmBackedSupply = (subgraphUrl?: string) => {
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
      select: data => getOhmBackedSupply(data.tokenSupplies, currentIndexQuery.data || 0),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess && currentIndexQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
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
