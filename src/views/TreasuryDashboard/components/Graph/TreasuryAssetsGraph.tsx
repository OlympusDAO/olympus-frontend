import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import { CSSProperties, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { TokenRecord_Filter, TokenRecordsDocument } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { CATEGORY_POL, CATEGORY_STABLE, CATEGORY_VOLATILE } from "src/helpers/subgraph/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import { useTokenRecordsQueries } from "src/hooks/useTokenRecords";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
  LiquidBackingProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

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
  subgraphUrls,
  earliestDate,
  onMouseMove,
  isLiquidBackingActive,
  subgraphDaysOffset,
}: GraphProps & LiquidBackingProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrls.Ethereum);
  const theme = useTheme();
  const chartName = "TreasuryAssetsGraph";
  const [baseFilter] = useState<TokenRecord_Filter>({});

  const tokenRecordResults = useTokenRecordsQueries(
    chartName,
    subgraphUrls,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

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

    // We need to flatten the tokenRecords from all of the pages arrays
    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);

    const tempByDateMetrics: DateTreasuryMetrics[] = [];

    /**
     * For each date, we have an array of token records.
     *
     * The relevant total is calculated by applying certain filters and summing (reducing) the value for the matching records.
     */
    tokenRecordResults.forEach((value, key) => {
      const marketStable = getTreasuryAssetValue(value, false, [CATEGORY_STABLE]);
      const marketVolatile = getTreasuryAssetValue(value, false, [CATEGORY_VOLATILE]);
      const marketPol = getTreasuryAssetValue(value, false, [CATEGORY_POL]);
      const marketTotal = getTreasuryAssetValue(value, false);
      const liquidStable = getTreasuryAssetValue(value, true, [CATEGORY_STABLE]);
      const liquidVolatile = getTreasuryAssetValue(value, true, [CATEGORY_VOLATILE]);
      const liquidPol = getTreasuryAssetValue(value, true, [CATEGORY_POL]);
      const liquidTotal = getTreasuryAssetValue(value, true);

      const dateMetric: DateTreasuryMetrics = {
        date: key,
        timestamp: new Date(key).getTime(), // We inject the timestamp, as it's used by the Chart component
        block: value[0].block,
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
      t`Stablecoins`,
      t`Volatile Assets`,
      t`Protocol-Owned Liquidity`,
      ...(isLiquidBackingActive ? [t`Market Value`] : [t`Liquid Backing`]),
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
      headerText={isLiquidBackingActive ? t`Treasury Liquid Backing` : t`Market Value of Treasury Assets`}
      headerSubText={total}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      infoTooltipMessage={
        isLiquidBackingActive
          ? t`Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, excluding OHM. This excludes the value of any illiquid (vesting/locked) assets. It represents the budget the Treasury has for specific market operations which cannot use OHM (inverse bonds, some liquidity provision, OHM incentives, etc).`
          : t`Market Value of Treasury Assets is the sum of the value (in dollars) of all assets held by the treasury (excluding pTokens).`
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
