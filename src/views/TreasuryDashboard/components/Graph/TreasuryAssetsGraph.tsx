import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { formatCurrency } from "src/helpers";
import { CATEGORY_POL, CATEGORY_STABLE, CATEGORY_VOLATILE } from "src/helpers/subgraph/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenRecordsQueryComplete } from "src/hooks/useFederatedSubgraphQuery";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
  LiquidBackingProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import {
  getDateTokenRecordMap,
  getLatestTimestamp,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

type DateTreasuryMetrics = {
  date: string;
  timestamp: number;
  block: number;
  marketStable: number;
  marketVolatile: number;
  marketPol: number;
  marketTotal: number;
  liquidStable: number;
  liquidVolatile: number;
  liquidPol: number;
  liquidTotal: number;
};

/**
 * Stacked area chart that displays the value of treasury assets.
 *
 * These are grouped into three categories: stable, volatile and protocol-owned liquidity.
 *
 * By default, it displays the market value. It supports toggling to the liquid backing value,
 * specified by the `isLiquidBackingActive` prop.
 */
export const TreasuryAssetsGraph = ({
  earliestDate,
  onMouseMove,
  isLiquidBackingActive,
  subgraphDaysOffset,
}: GraphProps & LiquidBackingProps) => {
  const queryExplorerUrl = "";
  const theme = useTheme();
  const chartName = "TreasuryAssetsGraph";

  const tokenRecordResults = useTokenRecordsQueryComplete(earliestDate);

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateMetrics, setByDateMetrics] = useState<DateTreasuryMetrics[]>([]);
  const [total, setTotal] = useState("");
  useMemo(() => {
    if (!tokenRecordResults) {
      return;
    }

    // Extract into a by-date map
    const byDateTokenRecordMap = getDateTokenRecordMap(tokenRecordResults);

    // We need to flatten the tokenRecords from all of the pages arrays
    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);

    const tempByDateMetrics: DateTreasuryMetrics[] = [];

    /**
     * For each date, we have an array of token records.
     *
     * The relevant total is calculated by applying certain filters and summing (reducing) the value for the matching records.
     */
    byDateTokenRecordMap.forEach((value, key) => {
      const marketStable = getTreasuryAssetValue(value, false, [CATEGORY_STABLE]);
      const marketVolatile = getTreasuryAssetValue(value, false, [CATEGORY_VOLATILE]);
      const marketPol = getTreasuryAssetValue(value, false, [CATEGORY_POL]);
      const marketTotal = getTreasuryAssetValue(value, false);
      const liquidStable = getTreasuryAssetValue(value, true, [CATEGORY_STABLE]);
      const liquidVolatile = getTreasuryAssetValue(value, true, [CATEGORY_VOLATILE]);
      const liquidPol = getTreasuryAssetValue(value, true, [CATEGORY_POL]);
      const liquidTotal = getTreasuryAssetValue(value, true);

      // Determine the earliest timestamp for the current date, as we can then guarantee that data is up-to-date as of {earliestTimestamp}
      const earliestTimestamp = getLatestTimestamp(value);

      const dateMetric: DateTreasuryMetrics = {
        date: key,
        timestamp: earliestTimestamp,
        block: +value[0].block,
        marketStable: marketStable,
        marketVolatile: marketVolatile,
        marketPol: marketPol,
        marketTotal: marketTotal,
        liquidStable: liquidStable,
        liquidVolatile: liquidVolatile,
        liquidPol: liquidPol,
        liquidTotal: liquidTotal,
      };

      tempByDateMetrics.push(dateMetric);
    });

    setByDateMetrics(tempByDateMetrics);
  }, [tokenRecordResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.info(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateMetrics([]);
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Set total
   */
  useMemo(() => {
    if (!byDateMetrics.length) {
      setTotal("");
      return;
    }

    console.info(`${chartName}: Data loading is done or isLiquidBackingActive has changed. Re-calculating total.`);

    // Date descending order, so 0 is the latest
    const lastMetric = byDateMetrics[0];
    const tempTotal = isLiquidBackingActive ? lastMetric.liquidTotal : lastMetric.marketTotal;
    setTotal(formatCurrency(tempTotal, 0));
  }, [byDateMetrics, isLiquidBackingActive]);

  /**
   * There are a number of variables (data keys, categories) that are dependent on the value of
   * {isLiquidBackingActive}. As a result, we watch for changes to that prop and re-create the
   * cached variables.
   */
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [composedLineDataKeys, setComposedLineDataKeys] = useState<string[]>([]);
  const [categoriesMap, setCategoriesMap] = useState(new Map<string, string>());
  const [bulletpointStylesMap, setBulletpointStylesMap] = useState(new Map<string, CSSProperties>());
  const [colorsMap, setColorsMap] = useState(new Map<string, string>());
  useMemo(() => {
    console.info(`${chartName}: isLiquidBackingActive changed. Re-calculating data keys.`);

    // What is displayed in the chart differs based on the value of isLiquidBackingActive
    const tempItemNames: string[] = [
      `Stablecoins`,
      `Volatile Assets`,
      `Protocol-Owned Liquidity`,
      ...(isLiquidBackingActive ? [`Market Value`] : [`Liquid Backing`]),
    ];

    const tempDataKeys: string[] = isLiquidBackingActive
      ? ["liquidStable", "liquidVolatile", "liquidPol", "marketTotal"]
      : ["marketStable", "marketVolatile", "marketPol", "liquidTotal"];
    setDataKeys(tempDataKeys);

    // The keys to display as a line
    setComposedLineDataKeys(isLiquidBackingActive ? ["marketTotal"] : ["liquidTotal"]);

    setCategoriesMap(getCategoriesMap(tempItemNames, tempDataKeys));
    setBulletpointStylesMap(getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys));
    setColorsMap(getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys));
  }, [isLiquidBackingActive]);

  return (
    <Chart
      type={ChartType.Composed}
      data={byDateMetrics}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataFormat={DataFormat.Currency}
      headerText={isLiquidBackingActive ? `Treasury Liquid Backing` : `Market Value of Treasury Assets`}
      headerSubText={total}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      infoTooltipMessage={
        isLiquidBackingActive
          ? `Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, excluding OHM. This excludes the value of any illiquid (vesting/locked) assets. It represents the budget the Treasury has for specific market operations which cannot use OHM (inverse bonds, some liquidity provision, OHM incentives, etc).`
          : `Market Value of Treasury Assets is the sum of the value (in dollars) of all assets held by the treasury (excluding pTokens).`
      }
      isLoading={byDateMetrics.length == 0}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      composedLineDataKeys={composedLineDataKeys}
      onMouseMove={onMouseMove}
    />
  );
};
