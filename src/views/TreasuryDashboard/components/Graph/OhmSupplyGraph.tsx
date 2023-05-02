import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
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
import { useProtocolMetricsQuery, useTokenSuppliesQuery } from "src/hooks/useFederatedSubgraphQuery";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getDateProtocolMetricMap } from "src/views/TreasuryDashboard/components/Graph/helpers/ProtocolMetricsQueryHelper";
import {
  getDateTokenSupplyMap,
  getLatestTimestamp,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM total, circulating and floating supply.
 *
 * @returns
 */
export const OhmSupplyGraph = ({ subgraphUrls, earliestDate, subgraphDaysOffset }: GraphProps) => {
  const queryExplorerUrl = "";
  const theme = useTheme();

  const chartName = "OhmSupplyGraph";

  const { data: tokenSupplyResults } = useTokenSuppliesQuery(earliestDate);
  const { data: protocolMetricResults } = useProtocolMetricsQuery(earliestDate);

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
    if (!tokenSupplyResults || !protocolMetricResults) {
      return;
    }

    // Extract into a by-date map
    const byDateTokenSupplyMap = getDateTokenSupplyMap(tokenSupplyResults);
    const byDateProtocolMetricMap = getDateProtocolMetricMap(protocolMetricResults);

    console.debug(`${chartName}: rebuilding by date metrics`);
    const tempByDateOhmSupply: OhmSupplyComparison[] = [];
    byDateTokenSupplyMap.forEach((dateSupplyValues, dateString) => {
      /**
       * Non-Ethereum mainnet chains do not have the OHM index, so they return
       * TokenSupply results in terms of gOHM. We supply the OHM index from the
       * protocol metrics query to convert the gOHM values to OHM.
       */
      const dayProtocolMetricsResults = byDateProtocolMetricMap.get(dateString);
      if (!dayProtocolMetricsResults || dayProtocolMetricsResults.length == 0) {
        console.log(`${chartName}: No protocol metrics found for ${dateString}. Skipping.`);
        return;
      }

      const ohmIndex: number = +dayProtocolMetricsResults[0].currentIndex;

      const earliestTimestamp = getLatestTimestamp(dateSupplyValues);
      const latestSupplyValue = dateSupplyValues[0];

      const dateOhmSupply: OhmSupplyComparison = {
        date: dateString,
        timestamp: earliestTimestamp,
        block: +latestSupplyValue.block,
        circulatingSupply: getOhmCirculatingSupply(dateSupplyValues, ohmIndex),
        floatingSupply: getOhmFloatingSupply(dateSupplyValues, ohmIndex),
        backedSupply: getOhmBackedSupply(dateSupplyValues, ohmIndex),
        totalSupply: getOhmTotalSupply(dateSupplyValues, ohmIndex),
        protocolOwnedLiquidity: getProtocolOwnedLiquiditySupply(dateSupplyValues, ohmIndex),
        treasury: getTreasurySupply(dateSupplyValues, ohmIndex),
        migrationOffset: getMigrationOffsetSupply(dateSupplyValues, ohmIndex),
        bondDeposits: getBondDepositsSupply(dateSupplyValues, ohmIndex),
        bondVestingTokens: getBondVestingTokensSupply(dateSupplyValues, ohmIndex),
        bondPreminted: getBondPremintedSupply(dateSupplyValues, ohmIndex),
        external: getExternalSupply(dateSupplyValues, ohmIndex),
        lending: getLendingSupply(dateSupplyValues, ohmIndex),
        boostedLiquidityVault: getBoostedLiquidityVaultSupply(dateSupplyValues, ohmIndex),
      };

      tempByDateOhmSupply.push(dateOhmSupply);
    });

    setByDateOhmSupply(tempByDateOhmSupply);
  }, [tokenSupplyResults, protocolMetricResults]);

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
