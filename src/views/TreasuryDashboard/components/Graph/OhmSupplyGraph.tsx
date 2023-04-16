import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { TokenSuppliesDocument, TokenSupply_Filter } from "src/generated/graphql";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import {
  getBondDepositsSupply,
  getBondPremintedSupply,
  getBondVestingTokensSupply,
  getBoostedLiquidityVaultSupply,
  getExternalSupply,
  getLendingSupply,
  getMigrationOffsetSupply,
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
  getOhmTotalSupply,
  getProtocolOwnedLiquiditySupply,
  getTreasurySupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenSuppliesQuery } from "src/hooks/useSubgraphTokenSupplies";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import { getLatestTimestamp } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM total, circulating and floating supply.
 *
 * @returns
 */
export const OhmSupplyGraph = ({ subgraphUrls, earliestDate, subgraphDaysOffset }: GraphProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenSuppliesDocument, subgraphUrls.Ethereum);
  const theme = useTheme();

  const chartName = "OhmSupplyGraph";
  const [baseFilter] = useState<TokenSupply_Filter>({});

  const tokenSupplyResults = useTokenSuppliesQuery(
    chartName,
    subgraphUrls.Ethereum,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

  /**
   * Chart population:
   *
   * When the data fetching for the query is completed,
   * the calculations are performed and cached. This avoids re-calculation
   * upon every rendering loop.
   */
  type OhmSupplyComparison = {
    date: string;
    timestamp: number;
    block: number;
    circulatingSupply: number;
    floatingSupply: number;
    backedSupply: number;
    totalSupply: number;
    protocolOwnedLiquidity: number;
    treasury: number;
    migrationOffset: number;
    bondDeposits: number;
    bondVestingTokens: number;
    bondPreminted: number;
    external: number;
    lending: number;
    boostedLiquidityVault: number;
  };
  const [byDateOhmSupply, setByDateOhmSupply] = useState<OhmSupplyComparison[]>([]);
  useMemo(() => {
    if (!tokenSupplyResults) {
      return;
    }

    console.debug(`${chartName}: rebuilding by date metrics`);
    const tempByDateOhmSupply: OhmSupplyComparison[] = [];
    tokenSupplyResults.forEach((dateSupplyValues, dateString) => {
      const earliestTimestamp = getLatestTimestamp(dateSupplyValues);
      const latestSupplyValue = dateSupplyValues[0];

      const dateOhmSupply: OhmSupplyComparison = {
        date: dateString,
        timestamp: earliestTimestamp,
        block: latestSupplyValue.block,
        circulatingSupply: getOhmCirculatingSupply(dateSupplyValues),
        floatingSupply: getOhmFloatingSupply(dateSupplyValues),
        backedSupply: getOhmBackedSupply(dateSupplyValues),
        totalSupply: getOhmTotalSupply(dateSupplyValues),
        protocolOwnedLiquidity: getProtocolOwnedLiquiditySupply(dateSupplyValues),
        treasury: getTreasurySupply(dateSupplyValues),
        migrationOffset: getMigrationOffsetSupply(dateSupplyValues),
        bondDeposits: getBondDepositsSupply(dateSupplyValues),
        bondVestingTokens: getBondVestingTokensSupply(dateSupplyValues),
        bondPreminted: getBondPremintedSupply(dateSupplyValues),
        external: getExternalSupply(dateSupplyValues),
        lending: getLendingSupply(dateSupplyValues),
        boostedLiquidityVault: getBoostedLiquidityVaultSupply(dateSupplyValues),
      };

      tempByDateOhmSupply.push(dateOhmSupply);
    });

    setByDateOhmSupply(tempByDateOhmSupply);
  }, [tokenSupplyResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.info(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateOhmSupply([]);
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = [
    "external",
    "lending",
    "bondVestingTokens",
    "protocolOwnedLiquidity",
    "boostedLiquidityVault",
    "treasury",
    "migrationOffset",
    "bondPreminted",
    "bondDeposits",
    "totalSupply",
    "circulatingSupply",
    "floatingSupply",
    "backedSupply",
  ];
  const itemNames: string[] = [
    `External`,
    `Deployed to Lending Markets`,
    `OHM Bonds (Vesting)`,
    `Protocol-Owned Liquidity`,
    `Boosted Liquidity Vault`,
    `Treasury`,
    `Migration Offset`,
    `OHM Bonds (Pre-minted)`,
    `OHM Bonds (User Deposits)`,
    `Total Supply`,
    `Circulating Supply`,
    `Floating Supply`,
    `Backed Supply`,
  ];

  const lineDataKeys: string[] = ["totalSupply", "circulatingSupply", "floatingSupply", "backedSupply"];

  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

  return (
    <Chart
      type={ChartType.Composed}
      data={byDateOhmSupply}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      headerText={`OHM Supply`}
      headerSubText={""}
      dataFormat={DataFormat.Number}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={`This chart visualises the OHM supply over time.`}
      isLoading={byDateOhmSupply.length == 0}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      composedLineDataKeys={lineDataKeys}
      tickStyle={getTickStyle(theme)}
    />
  );
};
