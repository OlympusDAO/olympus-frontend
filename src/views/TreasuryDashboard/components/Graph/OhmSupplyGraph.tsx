import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useMetricsQuery } from "src/hooks/useFederatedSubgraphQuery";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM total, circulating and floating supply.
 *
 * @returns
 */
export const OhmSupplyGraph = ({ earliestDate, onMouseMove, subgraphDaysOffset }: GraphProps) => {
  const queryExplorerUrl = "";
  const theme = useTheme();

  const chartName = "OhmSupplyGraph";

  const { data: metricResults } = useMetricsQuery({ startDate: earliestDate });

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
    // While data is loading, ensure dependent data is empty
    if (!metricResults) {
      return;
    }

    console.debug(`${chartName}: rebuilding by date metrics`);
    const tempByDateOhmSupply: OhmSupplyComparison[] = [];

    // Iterate over the records, one record per day
    metricResults.forEach(metricRecord => {
      /**
       * Non-Ethereum mainnet chains do not have the OHM index, so they return
       * TokenSupply results in terms of gOHM. We supply the OHM index from the
       * protocol metrics query to convert the gOHM values to OHM.
       */

      const dateOhmSupply: OhmSupplyComparison = {
        date: metricRecord.date,
        timestamp: metricRecord.timestamps.Ethereum * 1000, // convert to ms format
        block: metricRecord.blocks.Ethereum,
        circulatingSupply: metricRecord.ohmCirculatingSupply,
        floatingSupply: metricRecord.ohmFloatingSupply,
        backedSupply: metricRecord.ohmBackedSupply,
        totalSupply: metricRecord.ohmTotalSupply,
        protocolOwnedLiquidity: metricRecord.ohmSupplyCategories.ProtocolOwnedLiquidity,
        treasury: metricRecord.ohmSupplyCategories.Treasury,
        migrationOffset: metricRecord.ohmSupplyCategories.MigrationOffset,
        bondDeposits:
          metricRecord.ohmSupplyCategories.BondsDepositsVesting + metricRecord.ohmSupplyCategories.BondsDeposits,
        bondVestingTokens: metricRecord.ohmSupplyCategories.BondsTokensVesting,
        bondPreminted: metricRecord.ohmSupplyCategories.BondsPreminted,
        external: metricRecord.ohmBackedSupply,
        lending: metricRecord.ohmSupplyCategories.LendingMarkets,
        boostedLiquidityVault: metricRecord.ohmSupplyCategories.BoostedLiquidityVault,
      };

      tempByDateOhmSupply.push(dateOhmSupply);
    });

    setByDateOhmSupply(tempByDateOhmSupply);
  }, [metricResults]);

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
      margin={{ left: -5 }}
      infoTooltipMessage={`This chart visualises the OHM supply over time.`}
      isLoading={byDateOhmSupply.length == 0}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      composedLineDataKeys={lineDataKeys}
      tickStyle={getTickStyle(theme)}
      onMouseMove={onMouseMove}
    />
  );
};
