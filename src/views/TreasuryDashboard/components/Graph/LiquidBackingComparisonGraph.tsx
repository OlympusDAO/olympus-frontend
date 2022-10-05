import { t } from "@lingui/macro";
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
  getLiquidBackingPerOhmFloating,
  getTreasuryAssetValue,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { useProtocolMetricsQuery } from "src/hooks/useSubgraphProtocolMetrics";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import { useTokenSuppliesQuery } from "src/hooks/useSubgraphTokenSupplies";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
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

  const tokenSupplyResults = useTokenSuppliesQuery(
    chartName,
    subgraphUrls.Ethereum,
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
    liquidBackingPerOhmFloating: number;
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

      const latestTokenRecord = currentTokenRecords[0];
      const latestProtocolMetric = currentProtocolMetrics[0];

      const liquidBacking = getTreasuryAssetValue(currentTokenRecords, true);

      const liquidBackingRecord: LiquidBackingComparison = {
        date: key,
        timestamp: new Date(key).getTime(), // We inject the timestamp, as it's used by the Chart component
        block: latestTokenRecord.block,
        gOhmPrice: latestProtocolMetric.gOhmPrice,
        ohmPrice: latestProtocolMetric.ohmPrice,
        liquidBackingPerOhmFloating: getLiquidBackingPerOhmFloating(liquidBacking, currentTokenSupplies),
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
          ? byDateLiquidBacking[0].liquidBackingPerOhmFloating
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
      ? ["ohmPrice", "liquidBackingPerOhmFloating"]
      : ["gOhmPrice", "liquidBackingPerGOhmSynthetic"];
    setDataKeys(tempDataKeys);

    const itemNames: string[] = isActiveTokenOHM
      ? [t`OHM Price`, t`Liquid Backing per Floating OHM`]
      : [t`gOHM Price`, t`Liquid Backing per gOHM`];

    setCategoriesMap(getCategoriesMap(itemNames, tempDataKeys));
    setBulletpointStylesMap(getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys));
    setColorsMap(getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys));
    setHeaderText(isActiveTokenOHM ? t`OHM Backing` : t`gOHM Backing`);
    setTooltipText(
      isActiveTokenOHM
        ? t`This chart compares the price of OHM against its liquid backing. When OHM is above liquid backing, the difference will be highlighted in green. Conversely, when OHM is below liquid backing, the difference will be highlighted in red.`
        : t`This chart compares the price of gOHM against its liquid backing. When gOHM is above liquid backing, the difference will be highlighted in green. Conversely, when gOHM is below liquid backing, the difference will be highlighted in red.`,
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
