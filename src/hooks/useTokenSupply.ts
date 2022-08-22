import { getSubgraphUrl } from "src/constants";
import { useTokenSuppliesQuery } from "src/generated/graphql";
import { useTokenRecordsLatestBlock } from "src/hooks/useTokenRecords";
import { DEFAULT_RECORD_COUNT } from "src/views/TreasuryDashboard/components/Graph/Constants";
import {
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

export const useOhmCirculatingSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
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

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
    },
    {
      select: data => getOhmFloatingSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};

export const useGOhmSyntheticSupply = (subgraphUrl?: string) => {
  const latestDateQuery = useTokenRecordsLatestBlock(subgraphUrl);

  return useTokenSuppliesQuery(
    { endpoint: subgraphUrl || getSubgraphUrl() },
    {
      recordCount: DEFAULT_RECORD_COUNT,
      filter: { block: latestDateQuery.data },
    },
    {
      select: data => getOhmFloatingSupply(data.tokenSupplies),
      ...QUERY_OPTIONS,
      enabled: latestDateQuery.isSuccess, // Only fetch when we've been able to get the latest date
    },
  );
};
