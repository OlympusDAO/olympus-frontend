import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  TokenRecord_Filter,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  useInfiniteTokenRecordsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { getBulletpointStylesMap, getCategoriesMap, getDataKeyColorsMap } from "src/helpers/ProtocolMetricsHelper";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/ChartHelper";
import {
  CATEGORY_POL,
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  DEFAULT_RECORD_COUNT,
  GraphProps,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/SubgraphHelper";
import { getNextPageParamFactory } from "src/views/TreasuryDashboard/components/Graph/TokenRecordsQueryHelper";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = ({ subgraphUrl, earliestDate, activeToken }: GraphProps) => {
  // TODO enable
  const queryExplorerUrl = ""; //getSubgraphQueryExplorerUrl(KeyMetricsDocument, subgraphUrl);
  const theme = useTheme();
  const chartName = "LiquidBackingComparison";

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate);
  const baseFilter: TokenRecord_Filter = {
    category: CATEGORY_POL,
  };

  /**
   * Pagination:
   *
   * We create {paginator} within a useEffect block, so that it isn't re-created every re-render.
   */
  const treasuryPaginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate) {
      return;
    }

    treasuryPaginator.current = getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter);
  }, [earliestDate]);

  /**
   * Data Fetching:
   *
   * This code block kicks off data fetching with an initial date range.
   *
   * The definition of getNextPageParam() handles pagination.
   */
  const {
    data: treasuryData,
    hasNextPage: treasuryHasNextPage,
    fetchNextPage: treasuryFetchNextPage,
    refetch: treasuryRefetch,
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
      getNextPageParam: treasuryPaginator.current,
    },
  );

  // infinite query for tokensupply

  const resetCachedData = () => {
    //
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
    treasuryRefetch();
  }, [earliestDate, treasuryRefetch]);

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (treasuryHasNextPage) {
      console.log(chartName + ": fetching next page");
      treasuryFetchNextPage();
      return;
    }
  }, [treasuryData, treasuryHasNextPage, treasuryFetchNextPage]);

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

  // TODO cache data
  // TODO set header subtext

  const isActiveTokenOHM = (): boolean => {
    return activeToken === PARAM_TOKEN_OHM;
  };

  const dataKeys: string[] = isActiveTokenOHM()
    ? ["ohmPrice", "liquidBackingPerOhmFloating"]
    : ["gOhmPrice", "liquidBackingPerGOhmSynthetic"];
  const itemNames: string[] = isActiveTokenOHM()
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
      headerText={isActiveTokenOHM() ? t`OHM Backing` : t`gOHM Backing`}
      headerSubText={`${
        data &&
        formatCurrency(
          isActiveTokenOHM()
            ? data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating
            : data.protocolMetrics[0].treasuryLiquidBackingPerGOhm,
          2,
        )
      }`}
      dataFormat={DataFormat.Currency}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={
        isActiveTokenOHM()
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
