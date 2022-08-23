import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  TokenRecord_Filter,
  TokenRecordsDocument,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  useInfiniteTokenRecordsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
  getDataKeysFromTokens,
  TokenRow,
} from "src/helpers/ProtocolMetricsHelper";
import {
  CATEGORY_POL,
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  DEFAULT_RECORD_COUNT,
  GraphProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import {
  getNextPageStartDate,
  getSubgraphQueryExplorerUrl,
} from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  DateTokenSummary,
  getDateTokenSummary,
  getNextPageParamFactory,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

/**
 * Stacked area chart that displays protocol-owned liquidity.
 */
export const ProtocolOwnedLiquidityGraph = ({ subgraphUrl, earliestDate }: GraphProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const theme = useTheme();
  const chartName = "ProtocolOwnedLiquidityGraph";

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate);

  const [baseFilter] = useState<TokenRecord_Filter>({
    category: CATEGORY_POL,
  });

  /**
   * Pagination:
   *
   * We create {paginator} within a useEffect block, so that it isn't re-created every re-render.
   */
  const paginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate) {
      return;
    }

    console.info(`${chartName}: earliestDate changed to ${earliestDate}. Re-fetching.`);

    // Reset cache
    resetCachedData();

    // Force fetching of data with the new paginator
    // Calling refetch() after setting the new paginator causes the query to never finish
    refetch();

    // Create a new paginator with the new earliestDate
    paginator.current = getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter);
  }, [baseFilter, earliestDate]);

  /**
   * This code block kicks off data fetching with an initial date range.
   *
   * The definition of getNextPageParam() handles pagination.
   */
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteTokenRecordsQuery(
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
      enabled: earliestDate !== null && baseFilter !== null,
      getNextPageParam: paginator.current,
    },
  );

  const resetCachedData = () => {
    setByDateTokenSummary([]);
    setCategoryDataKeyMap(new Map<string, string>());
    setDataKeys([]);
    setDataKeyBulletpointStylesMap(new Map<string, CSSProperties>());
  };

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (hasNextPage) {
      console.debug(chartName + ": fetching next page");
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage]);

  /**
   * Chart population:
   *
   * The following code block processes the {tokenRecords} array and
   * generates the data structures required to populate the chart.
   */
  const [byDateTokenSummary, setByDateTokenSummary] = useState<DateTokenSummary[]>([]);
  const [categoryDataKeyMap, setCategoryDataKeyMap] = useState(new Map<string, string>());
  const initialDataKeys: string[] = [];
  const [dataKeys, setDataKeys] = useState(initialDataKeys);
  const [dataKeyBulletpointStylesMap, setDataKeyBulletpointStylesMap] = useState(new Map<string, CSSProperties>());
  const [dataKeyColorsMap, setDataKeyColorsMap] = useState(new Map<string, string>());
  const [total, setTotal] = useState("");
  useMemo(() => {
    // While data is loading, ensure dependent data is empty
    if (hasNextPage || !data) {
      console.debug(`${chartName}: removing cached data, as query is in progress.`);
      resetCachedData();
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();

    const newDateTokenSummary = getDateTokenSummary(tokenRecords);
    setByDateTokenSummary(newDateTokenSummary);

    const tokenCategories = Array.from(new Set(tokenRecords.map(tokenRecord => tokenRecord.token))).sort();

    const tempDataKeys = getDataKeysFromTokens(tokenCategories, "");
    setDataKeys(tempDataKeys);

    const tempCategoriesMap = getCategoriesMap(tokenCategories, tempDataKeys);
    setCategoryDataKeyMap(tempCategoriesMap);

    const tempBulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys);
    setDataKeyBulletpointStylesMap(tempBulletpointStylesMap);

    const tempColorsMap = getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys);
    setDataKeyColorsMap(tempColorsMap);
  }, [data, hasNextPage]);

  /**
   * Set total
   */
  useMemo(() => {
    if (!byDateTokenSummary.length) {
      setTotal("");
      return;
    }

    console.info(`${chartName}: Data loading is done. Re-calculating total.`);

    const tempTotal =
      byDateTokenSummary.length > 0
        ? Object.values(byDateTokenSummary[0].tokens).reduce((previousValue: number, token: TokenRow) => {
            return +previousValue + parseFloat(token.value);
          }, 0)
        : 0;
    setTotal(formatCurrency(tempTotal, 0));
  }, [byDateTokenSummary]);

  return (
    <Chart
      type={ChartType.StackedArea}
      data={byDateTokenSummary}
      dataKeys={dataKeys}
      dataKeyColors={dataKeyColorsMap}
      dataFormat={DataFormat.Currency}
      headerText={t`Protocol-Owned Liquidity`}
      headerSubText={total}
      dataKeyBulletpointStyles={dataKeyBulletpointStylesMap}
      dataKeyLabels={categoryDataKeyMap}
      infoTooltipMessage={t`Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`}
      isLoading={byDateTokenSummary.length == 0}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      margin={{ left: -5 }}
    />
  );
};
