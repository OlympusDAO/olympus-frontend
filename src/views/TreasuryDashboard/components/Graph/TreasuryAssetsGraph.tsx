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
import { CATEGORY_POL, CATEGORY_STABLE, CATEGORY_VOLATILE } from "src/helpers/subgraph/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { getTreasuryAssetValue } from "src/helpers/subgraph/TreasuryQueryHelper";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  DEFAULT_RECORD_COUNT,
  GraphProps,
  LiquidBackingProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import {
  getNextPageStartDate,
  getSubgraphQueryExplorerUrl,
} from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  getNextPageParamFactory,
  getTokenRecordDateMap,
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
  subgraphUrl,
  earliestDate,
  onMouseMove,
  isLiquidBackingActive,
}: GraphProps & LiquidBackingProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const theme = useTheme();
  const chartName = "TreasuryAssetsGraph";

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = !earliestDate ? null : getNextPageStartDate(initialFinishDate, earliestDate);

  const [baseFilter] = useState<TokenRecord_Filter>({});

  /**
   * Pagination:
   *
   * We create {paginator} within a useEffect block, so that it isn't re-created every re-render.
   */
  const paginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  useEffect(() => {
    // We can't create the paginator until we have an earliestDate
    if (!earliestDate || !baseFilter) {
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
      enabled: earliestDate !== null && baseFilter != null,
      getNextPageParam: paginator.current,
    },
  );

  const resetCachedData = () => {
    setByDateMetrics([]);
    setTotal("");
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
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateMetrics, setByDateMetrics] = useState<DateTreasuryMetrics[]>([]);
  const [total, setTotal] = useState("");
  useMemo(() => {
    if (hasNextPage || !data) {
      console.debug(`${chartName}: Removing cached data, as query is in progress.`);
      resetCachedData();

      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.info(`${chartName}: Data loading is done. Rebuilding by date metrics`);
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();

    const dateTokenRecords = getTokenRecordDateMap(tokenRecords);
    const tempByDateMetrics: DateTreasuryMetrics[] = [];

    /**
     * For each date, we have an array of token records.
     *
     * The relevant total is calculated by applying certain filters and summing (reducing) the value for the matching records.
     */
    dateTokenRecords.forEach((value, key) => {
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
  }, [data, hasNextPage]);

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
