import { useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { TokenSupply, useTokenSuppliesQuery } from "src/hooks/useFederatedSubgraphQuery";
import { AssetsTableProps, GraphProps } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getDateTokenSupplyMap } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

export const OhmSupplyTable = ({ earliestDate, selectedIndex, subgraphDaysOffset }: GraphProps & AssetsTableProps) => {
  const theme = useTheme();

  const queryExplorerUrl = "";
  const chartName = "OhmSupplyTable";

  const { data: tokenSupplyResults } = useTokenSuppliesQuery(earliestDate);

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateTokenSupplyMap, setByDateTokenSupplyMap] = useState<Map<string, TokenSupply[]>>(
    new Map<string, TokenSupply[]>(),
  );
  const [currentTokens, setCurrentTokens] = useState<TokenRow[]>([]);
  useMemo(() => {
    if (!tokenSupplyResults) {
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date token summary`);

    /**
     * latestOnly is false as the "latest" block is different on each blockchain.
     * They are already filtered by latest block per chain in the useTokenRecordsQueries hook.
     */
    const tempDateTokenSupplyMap = getDateTokenSupplyMap(tokenSupplyResults);
    setByDateTokenSupplyMap(tempDateTokenSupplyMap);
  }, [tokenSupplyResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.debug(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateTokenSupplyMap(new Map<string, TokenSupply[]>());
  }, [earliestDate, subgraphDaysOffset]);
};
