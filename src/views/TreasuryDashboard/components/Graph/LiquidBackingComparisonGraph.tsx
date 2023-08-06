import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { formatCurrency } from "src/helpers";
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
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per backed OHM.
 */
export const LiquidBackingPerOhmComparisonGraph = ({ earliestDate, activeToken, subgraphDaysOffset }: GraphProps) => {
  // TODO look at how to combine query documents
  const queryExplorerUrl = "";
  const theme = useTheme();
  const chartName = "LiquidBackingComparison";

  const { data: metricResults } = useMetricsQuery({ startDate: earliestDate });

  /**
   * Active token:
   *
   * We cache this, because there are code blocks that depend on the value.
   */
  const [isActiveTokenOHM, setIsActiveTokenOHM] = useState(true);
  useMemo(() => {
    setIsActiveTokenOHM(activeToken === PARAM_TOKEN_OHM);
  }, [activeToken]);

  /**
   * Chart population:
   *
   * When the data fetching for all three queries is completed,
   * the calculations are performed and cached. This avoids re-calculation
   * upon every rendering loop.
   */
  type LiquidBackingComparison = {
    date: string;
    timestamp: number;
    block: number;
    gOhmPrice: number;
    liquidBackingPerGOhmSynthetic: number;
    liquidBackingPerBackedOhm: number;
    ohmPrice: number;
  };
  const [byDateLiquidBacking, setByDateLiquidBacking] = useState<LiquidBackingComparison[]>([]);
  useMemo(() => {
    // While data is loading, ensure dependent data is empty
    if (!metricResults) {
      return;
    }

    // We need to flatten the records from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const tempByDateLiquidBacking: LiquidBackingComparison[] = [];

    // Iterate over the records, one record per day
    metricResults.forEach(metricRecord => {
      const liquidBackingRecord: LiquidBackingComparison = {
        date: metricRecord.date,
        timestamp: metricRecord.timestamps.Ethereum * 1000, // convert to ms format
        block: metricRecord.blocks.Ethereum,
        gOhmPrice: metricRecord.gOhmPrice,
        ohmPrice: metricRecord.ohmPrice,
        liquidBackingPerBackedOhm: metricRecord.treasuryLiquidBackingPerOhmBacked,
        liquidBackingPerGOhmSynthetic: metricRecord.treasuryLiquidBackingPerGOhmBacked,
      };

      tempByDateLiquidBacking.push(liquidBackingRecord);
    });

    setByDateLiquidBacking(tempByDateLiquidBacking);
  }, [metricResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.info(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateLiquidBacking([]);
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Header subtext
   */
  const [currentBackingHeaderText, setCurrentBackingHeaderText] = useState("");
  useMemo(() => {
    if (!byDateLiquidBacking.length) {
      setCurrentBackingHeaderText("");
      return;
    }

    console.info(`${chartName}: Data loading is done or isActiveTokenOHM has changed. Re-calculating total.`);

    // Date descending order, so 0 is the latest
    setCurrentBackingHeaderText(
      formatCurrency(
        isActiveTokenOHM
          ? byDateLiquidBacking[0].liquidBackingPerBackedOhm
          : byDateLiquidBacking[0].liquidBackingPerGOhmSynthetic,
        2,
      ),
    );
  }, [isActiveTokenOHM, byDateLiquidBacking]);

  /**
   * There are a number of variables (data keys, categories) that are dependent on the value of
   * {isLiquidBackingActive}. As a result, we watch for changes to that prop and re-create the
   * cached variables.
   */
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [categoriesMap, setCategoriesMap] = useState(new Map<string, string>());
  const [bulletpointStylesMap, setBulletpointStylesMap] = useState(new Map<string, CSSProperties>());
  const [colorsMap, setColorsMap] = useState(new Map<string, string>());
  const [headerText, setHeaderText] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  useMemo(() => {
    const tempDataKeys: string[] = isActiveTokenOHM
      ? ["ohmPrice", "liquidBackingPerBackedOhm"]
      : ["gOhmPrice", "liquidBackingPerGOhmSynthetic"];
    setDataKeys(tempDataKeys);

    const itemNames: string[] = isActiveTokenOHM
      ? [`OHM Price`, `Liquid Backing per Backed OHM`]
      : [`gOHM Price`, `Liquid Backing per gOHM`];

    setCategoriesMap(getCategoriesMap(itemNames, tempDataKeys));
    setBulletpointStylesMap(getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys));
    setColorsMap(getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys));
    setHeaderText(isActiveTokenOHM ? `OHM Backing` : `gOHM Backing`);
    setTooltipText(
      isActiveTokenOHM
        ? `This chart compares the price of OHM against its liquid backing per backed OHM. When OHM is above liquid backing, the difference will be highlighted in green. Conversely, when OHM is below liquid backing, the difference will be highlighted in red.
        
The values are determined at the time a snapshot is recorded (every 8 hours). As a result, they will lag the real-time market rates.

As data is sourced from multiple chains that may have different snapshot times, the data shown represents the snapshots for which all data has been recorded. As a result, the data may lag.`
        : `This chart compares the price of gOHM against its liquid backing per backed gOHM. When gOHM is above liquid backing, the difference will be highlighted in green. Conversely, when gOHM is below liquid backing, the difference will be highlighted in red.

The values are determined at the time a snapshot is recorded (every 8 hours). As a result, they will lag the real-time market rates.

As data is sourced from multiple chains that may have different snapshot times, the data shown represents the snapshots for which all data has been recorded. As a result, the data may lag.`,
    );
  }, [isActiveTokenOHM]);

  return (
    <Chart
      type={ChartType.AreaDifference}
      data={byDateLiquidBacking}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      headerText={headerText}
      headerSubText={currentBackingHeaderText}
      dataFormat={DataFormat.Currency}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={tooltipText}
      isLoading={byDateLiquidBacking.length == 0}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
      tickStyle={getTickStyle(theme)}
    />
  );
};
