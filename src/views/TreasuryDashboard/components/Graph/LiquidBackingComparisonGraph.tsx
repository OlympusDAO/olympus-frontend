import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  ProtocolMetricsDocument,
  ProtocolMetricsQuery,
  ProtocolMetricsQueryVariables,
  TokenRecord_Filter,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  TokenSuppliesQuery,
  TokenSuppliesQueryVariables,
  useInfiniteProtocolMetricsQuery,
  useInfiniteTokenRecordsQuery,
  useInfiniteTokenSuppliesQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { getBulletpointStylesMap, getCategoriesMap, getDataKeyColorsMap } from "src/helpers/ProtocolMetricsHelper";
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
  getLiquidBackingValue,
  getNextPageParamFactory as getNextPageParamTokenRecordFactory,
  getTokenRecordDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";
import {
  getNextPageParamFactory as getNextPageParamTokenSupplyFactory,
  getTokenSupplyDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";
import {
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmFloating,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TreasuryQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = ({ subgraphUrl, earliestDate, activeToken }: GraphProps) => {
  // TODO look at how to combine query documents
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolMetricsDocument, subgraphUrl);
  const theme = useTheme();
  const chartName = "LiquidBackingComparison";

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate);
  const baseFilter: TokenRecord_Filter = {};

  /**
   * Active token
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
  const tokenRecordsPaginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  const tokenSuppliesPaginator = useRef<(lastPage: TokenSuppliesQuery) => TokenSuppliesQueryVariables | undefined>();
  const protocolMetricsPaginator =
    useRef<(lastPage: ProtocolMetricsQuery) => ProtocolMetricsQueryVariables | undefined>();
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate) {
      return;
    }

    tokenRecordsPaginator.current = getNextPageParamTokenRecordFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
    );
    tokenSuppliesPaginator.current = getNextPageParamTokenSupplyFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
    );
    protocolMetricsPaginator.current = getNextPageParamProtocolMetricFactory(
      chartName,
      earliestDate,
      DEFAULT_RECORD_COUNT,
      baseFilter,
    );
  }, [earliestDate]);

  /**
   * Data Fetching:
   *
   * This code block kicks off data fetching with an initial date range.
   *
   * The definition of getNextPageParam() handles pagination.
   */
  // TokenRecord
  const {
    data: tokenRecordsData,
    hasNextPage: tokenRecordsHasNextPage,
    fetchNextPage: tokenRecordsFetchNextPage,
    refetch: tokenRecordsRefetch,
  } = useInfiniteTokenRecordsQuery(
    { endpoint: subgraphUrl },
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
      enabled: earliestDate !== null,
      getNextPageParam: tokenRecordsPaginator.current,
    },
  );

  // TokenSupply
  const {
    data: tokenSuppliesData,
    hasNextPage: tokenSuppliesHasNextPage,
    fetchNextPage: tokenSuppliesFetchNextPage,
    refetch: tokenSuppliesRefetch,
  } = useInfiniteTokenSuppliesQuery(
    { endpoint: subgraphUrl },
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
      enabled: earliestDate !== null,
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
    { endpoint: subgraphUrl },
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
      enabled: earliestDate !== null,
      getNextPageParam: protocolMetricsPaginator.current,
    },
  );

  // infinite query for protocol metrics

  const resetCachedData = () => {
    setByDateLiquidBacking([]);
  };

  /**
   * We need to trigger a re-fetch when the earliestDate prop is changed.
   */
  useEffect(() => {
    if (!earliestDate) {
      return;
    }

    console.debug(chartName + ": earliestDate changed to " + earliestDate + ". Re-fetching.");
    resetCachedData();
    tokenRecordsRefetch();
    tokenSuppliesRefetch();
    protocolMetricsRefetch();
  }, [earliestDate]);

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (tokenRecordsHasNextPage) {
      console.debug(chartName + ": fetching next page of tokenRecords");
      tokenRecordsFetchNextPage();
      return;
    }
  }, [tokenRecordsData, tokenRecordsHasNextPage, tokenRecordsFetchNextPage]);

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
   * Chart population
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
      tokenRecordsHasNextPage ||
      tokenSuppliesHasNextPage ||
      protocolMetricsHasNextPage ||
      !tokenRecordsData ||
      !tokenSuppliesData ||
      !protocolMetricsData
    ) {
      console.debug(`${chartName}: removing cached data, as query is in progress.`);
      resetCachedData();
      return;
    }

    // We need to flatten the records from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const byDateTokenRecords = getTokenRecordDateMap(tokenRecordsData.pages.map(query => query.tokenRecords).flat());
    const byDateTokenSupplies = getTokenSupplyDateMap(tokenSuppliesData.pages.map(query => query.tokenSupplies).flat());
    const byDateProtocolMetrics = getProtocolMetricDateMap(
      protocolMetricsData.pages.map(query => query.protocolMetrics).flat(),
    );

    const tempByDateLiquidBacking = new Map<string, LiquidBackingComparison>();
    byDateTokenRecords.forEach((value, key) => {
      const currentTokenRecords = value;
      const currentTokenSupplies = byDateTokenSupplies.get(key);
      if (!currentTokenSupplies) {
        throw new Error(`${chartName}: expected tokenSupplies on date ${key} to exist`);
      }

      const currentProtocolMetrics = byDateProtocolMetrics.get(key);
      if (!currentProtocolMetrics) {
        throw new Error(`${chartName}: expected protocolMetrics on date ${key} to exist`);
      }

      const latestTokenRecord = currentTokenRecords[0];
      const latestProtocolMetric = currentProtocolMetrics[0];

      const liquidBacking = getLiquidBackingValue(currentTokenRecords);

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

      tempByDateLiquidBacking.set(key, liquidBackingRecord);
    });

    setByDateLiquidBacking(Array.from(tempByDateLiquidBacking.values()));
  }, [
    tokenRecordsHasNextPage,
    tokenSuppliesHasNextPage,
    protocolMetricsHasNextPage,
    tokenRecordsData,
    tokenSuppliesData,
    protocolMetricsData,
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
   * Data keys, categories
   */
  const dataKeys: string[] = isActiveTokenOHM
    ? ["ohmPrice", "liquidBackingPerOhmFloating"]
    : ["gOhmPrice", "liquidBackingPerGOhmSynthetic"];
  const itemNames: string[] = isActiveTokenOHM
    ? [t`OHM Price`, t`Liquid Backing per Floating OHM`]
    : [t`gOHM Price`, t`Liquid Backing per gOHM`];

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

  return (
    <Chart
      type={ChartType.AreaDifference}
      data={byDateLiquidBacking}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      headerText={isActiveTokenOHM ? t`OHM Backing` : t`gOHM Backing`}
      headerSubText={currentBackingHeaderText}
      dataFormat={DataFormat.Currency}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={
        isActiveTokenOHM
          ? t`This chart compares the price of OHM against its liquid backing. When OHM is above liquid backing, the difference will be highlighted in green. Conversely, when OHM is below liquid backing, the difference will be highlighted in red.`
          : t`This chart compares the price of gOHM against its liquid backing. When gOHM is above liquid backing, the difference will be highlighted in green. Conversely, when gOHM is below liquid backing, the difference will be highlighted in red.`
      }
      isLoading={byDateLiquidBacking.length == 0}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
      tickStyle={getTickStyle(theme)}
    />
  );
};
