import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { ProtocolMetricsDocument, TokenRecord_Filter } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import {
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmBacked,
  getTreasuryAssetValue,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useProtocolMetricsQuery } from "src/hooks/useSubgraphProtocolMetrics";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import { getLatestTimestamp } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per backed OHM.
 */
export const LiquidBackingPerOhmComparisonGraph = ({
  subgraphUrls,
  earliestDate,
  activeToken,
  subgraphDaysOffset,
}: GraphProps) => {
  // TODO look at how to combine query documents
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolMetricsDocument, subgraphUrls.Ethereum);
  const theme = useTheme();
  const chartName = "LiquidBackingComparison";
  const [baseFilter] = useState<TokenRecord_Filter>({});

  const tokenRecordResults = useTokenRecordsQueries(
    chartName,
    subgraphUrls,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

  const tokenSupplyResults = useTokenSuppliesQueries(
    chartName,
    subgraphUrls,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

  const protocolMetricResults = useProtocolMetricsQuery(
    chartName,
    subgraphUrls.Ethereum,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

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
    if (!protocolMetricResults || !tokenRecordResults || !tokenSupplyResults) {
      return;
    }

    // We need to flatten the records from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const tempByDateLiquidBacking: LiquidBackingComparison[] = [];
    tokenRecordResults.forEach((value, key) => {
      const currentTokenRecords = value;
      const currentTokenSupplies = tokenSupplyResults.get(key);
      const currentProtocolMetrics = protocolMetricResults.get(key);

      if (!currentTokenSupplies || !currentProtocolMetrics) {
        /**
         * Similar to the other charts (except that it is abstracted into {useTokenRecordsQueries}),
         * once we reach a date that does not contain TokenSupply or ProtocolMetric records, we abort.
         *
         * This will cause the chart to display up to (but not including) that date.
         */
        return;
      }

      // Determine the earliest timestamp for the current date, as we can then guarantee that data is up-to-date as of {earliestTimestamp}
      const earliestTimestamp = getLatestTimestamp(currentTokenRecords);
      const latestTokenRecord = currentTokenRecords[0];
      const latestProtocolMetric = currentProtocolMetrics[0];

      const liquidBacking = getTreasuryAssetValue(currentTokenRecords, true);

      const liquidBackingRecord: LiquidBackingComparison = {
        date: key,
        timestamp: earliestTimestamp,
        block: latestTokenRecord.block,
        gOhmPrice: latestProtocolMetric.gOhmPrice,
        ohmPrice: latestProtocolMetric.ohmPrice,
        liquidBackingPerBackedOhm: getLiquidBackingPerOhmBacked(
          liquidBacking,
          currentTokenSupplies,
          latestProtocolMetric.currentIndex,
        ),
        liquidBackingPerGOhmSynthetic: getLiquidBackingPerGOhmSynthetic(
          liquidBacking,
          latestProtocolMetric.currentIndex,
          currentTokenSupplies,
        ),
      };

      tempByDateLiquidBacking.push(liquidBackingRecord);
    });

    setByDateLiquidBacking(tempByDateLiquidBacking);
  }, [protocolMetricResults, tokenRecordResults, tokenSupplyResults]);

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
