import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  ProtocolMetricsDocument,
  ProtocolMetricsQuery,
  ProtocolMetricsQueryVariables,
  TokenRecord_Filter,
  TokenSuppliesQuery,
  TokenSuppliesQueryVariables,
  useInfiniteProtocolMetricsQuery,
  useInfiniteTokenSuppliesQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
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
import { useTokenRecordsQueries } from "src/hooks/useTokenRecords";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  DEFAULT_RECORD_COUNT,
  GraphProps,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import {
  getNextPageParamFactory as getNextPageParamProtocolMetricFactory,
  getProtocolMetricDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/ProtocolMetricsQueryHelper";
import {
  getNextPageStartDate,
  getSubgraphQueryExplorerUrl,
} from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  getNextPageParamFactory as getNextPageParamTokenSupplyFactory,
  getTokenSupplyDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 */
export const LiquidBackingPerOhmComparisonGraph = ({ subgraphUrls, earliestDate, activeToken }: GraphProps) => {
  // TODO look at how to combine query documents
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolMetricsDocument, subgraphUrls.Ethereum);
  const theme = useTheme();
  const chartName = "LiquidBackingComparison";
  const [baseFilter] = useState<TokenRecord_Filter>({});

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate, -180); // TODO remove offset

  const tokenRecordResults = useTokenRecordsQueries(chartName, subgraphUrls, baseFilter, earliestDate);

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
   * Pagination:
   *
   * We create {paginator} within a useEffect block, so that it isn't re-created every re-render.
   */
  const tokenSuppliesPaginator = useRef<(lastPage: TokenSuppliesQuery) => TokenSuppliesQueryVariables | undefined>();
  const protocolMetricsPaginator =
    useRef<(lastPage: ProtocolMetricsQuery) => ProtocolMetricsQueryVariables | undefined>();
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate) {
      return;
    }

    console.info(`${chartName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    tokenSuppliesRefetch();
    protocolMetricsRefetch();

    // Create a new paginator with the new earliestDate
    tokenSuppliesPaginator.current = getNextPageParamTokenSupplyFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
      -180, // TODO remove offset
    );
    protocolMetricsPaginator.current = getNextPageParamProtocolMetricFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
      -180, // TODO remove offset
    );
  }, [baseFilter, earliestDate]);

  /**
   * Data Fetching:
   *
   * This code block kicks off data fetching with an initial date range.
   *
   * The definition of getNextPageParam() handles pagination.
   */
  // TokenSupply
  const {
    data: tokenSuppliesData,
    hasNextPage: tokenSuppliesHasNextPage,
    fetchNextPage: tokenSuppliesFetchNextPage,
    refetch: tokenSuppliesRefetch,
  } = useInfiniteTokenSuppliesQuery(
    { endpoint: subgraphUrls.Ethereum },
    "filter",
    {
      filter: {
        ...baseFilter,
        date_gte: initialStartDate,
        date_lt: initialFinishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
    },
    {
      enabled: earliestDate !== null && baseFilter !== null,
      getNextPageParam: tokenSuppliesPaginator.current,
    },
  );

  // ProtocolMetric
  const {
    data: protocolMetricsData,
    hasNextPage: protocolMetricsHasNextPage,
    fetchNextPage: protocolMetricsFetchNextPage,
    refetch: protocolMetricsRefetch,
  } = useInfiniteProtocolMetricsQuery(
    { endpoint: subgraphUrls.Ethereum },
    "filter",
    {
      filter: {
        ...baseFilter,
        date_gte: initialStartDate,
        date_lt: initialFinishDate,
      },
      recordCount: DEFAULT_RECORD_COUNT,
    },
    {
      enabled: earliestDate !== null && baseFilter !== null,
      getNextPageParam: protocolMetricsPaginator.current,
    },
  );

  const resetCachedData = () => {
    setByDateLiquidBacking([]);
  };

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (tokenSuppliesHasNextPage) {
      console.debug(chartName + ": fetching next page of tokenSupplies");
      tokenSuppliesFetchNextPage();
      return;
    }
  }, [tokenSuppliesData, tokenSuppliesHasNextPage, tokenSuppliesFetchNextPage]);

  useEffect(() => {
    if (protocolMetricsHasNextPage) {
      console.debug(chartName + ": fetching next page of protocolMetrics");
      protocolMetricsFetchNextPage();
      return;
    }
  }, [protocolMetricsData, protocolMetricsHasNextPage, protocolMetricsFetchNextPage]);

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
    if (
      tokenSuppliesHasNextPage ||
      protocolMetricsHasNextPage ||
      !tokenSuppliesData ||
      !protocolMetricsData ||
      !tokenRecordResults
    ) {
      console.debug(`${chartName}: removing cached data, as query is in progress.`);
      resetCachedData();
      return;
    }

    // We need to flatten the records from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const byDateTokenSupplies = getTokenSupplyDateMap(tokenSuppliesData.pages.map(query => query.tokenSupplies).flat());
    const byDateProtocolMetrics = getProtocolMetricDateMap(
      protocolMetricsData.pages.map(query => query.protocolMetrics).flat(),
    );

    const tempByDateLiquidBacking: LiquidBackingComparison[] = [];
    tokenRecordResults.forEach((value, key) => {
      const currentTokenRecords = value;
      const currentTokenSupplies = byDateTokenSupplies.get(key);
      if (!currentTokenSupplies) {
        return; // TODO resotre
        // throw new Error(`${chartName}: expected tokenSupplies on date ${key} to exist`);
      }

      const currentProtocolMetrics = byDateProtocolMetrics.get(key);
      if (!currentProtocolMetrics) {
        return; // TODO restore
        // throw new Error(`${chartName}: expected protocolMetrics on date ${key} to exist`);
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
  }, [
    tokenSuppliesHasNextPage,
    protocolMetricsHasNextPage,
    tokenSuppliesData,
    protocolMetricsData,
    tokenRecordResults,
  ]);

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
