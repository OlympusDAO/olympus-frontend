import { useTokenSuppliesQuery } from "src/generated/graphql";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { getSubgraphUrl } from "src/helpers/SubgraphUrlHelper";
import { useTokenRecordsLatestBlock } from "src/hooks/useTokenRecordsMetrics";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

export const useOhmCirculatingSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    { endpoint: endpoint },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmCirculatingSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

export const useOhmFloatingSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    { endpoint: endpoint },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmFloatingSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

export const useOhmBackedSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    { endpoint: endpoint },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmBackedSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

export const useGOhmSyntheticSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);
  const endpoint = subgraphUrl || getSubgraphUrl();

  return useTokenSuppliesQuery(
    { endpoint: endpoint },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
      endpoint: endpoint,
    },
    {
      select: data => getOhmFloatingSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};
