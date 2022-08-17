import { t } from "@lingui/macro";
import { Grid } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { TabBar } from "@olympusdao/component-library";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { TokenRecord, TokenRecordsDocument, useInfiniteTokenRecordsQuery } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
  getDataKeysFromTokens,
  TokenMap,
  TokenRow,
} from "src/helpers/ProtocolMetricsHelper";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";

// These constants are used by charts to have consistent colours
// Source: https://www.figma.com/file/RCfzlYA1i8wbJI3rPGxxxz/SubGraph-Charts-V3?node-id=0%3A1
const DEFAULT_COLORS: string[] = [
  "#917BD9",
  "#49A1F2",
  "#95B7A1",
  "#E49471",
  "#D85F73",
  "#A3CFF0",
  "#70E8C7",
  "#DF7FD0",
  "#F6BD67",
  "#F090A0",
];
const DEFAULT_BULLETPOINT_COLOURS: CSSProperties[] = DEFAULT_COLORS.map(value => {
  return {
    background: value,
  };
});
export const DEFAULT_DAYS = 30;
const DEFAULT_RECORD_COUNT = 1000;
const DEFAULT_DATE_OFFSET = -14;

const QUERY_TREASURY_MARKET_VALUE = "marketValue";
const QUERY_TREASURY_LIQUID_BACKING = "liquidBacking";
const QUERY_TREASURY = "treasuryAssets";

const getTickStyle = (theme: Theme): Record<string, string | number> => {
  return {
    stroke: theme.palette.primary.light,
    fill: theme.palette.primary.light,
    strokeWidth: "0.1px",
  };
};

const getSubgraphQueryExplorerUrl = (queryDocument: string, subgraphUrl: string): string => {
  return `${subgraphUrl}/graphql?query=${encodeURIComponent(queryDocument)}`;
};

/**
 * Extract the tokenRecords into a map, indexed by the date string
 * @param tokenRecords
 * @returns
 */
const getTokenRecordDateMap = (tokenRecords: TokenRecord[]): Map<string, TokenRecord[]> => {
  const dateTokenRecords: Map<string, TokenRecord[]> = new Map<string, TokenRecord[]>();
  tokenRecords.map(value => {
    const currentDateRecords = dateTokenRecords.get(value.date) || [];
    currentDateRecords.push(value);
    dateTokenRecords.set(value.date, currentDateRecords);
  });

  return dateTokenRecords;
};

type GraphProps = {
  subgraphUrl: string;
  earliestDate: string;
  activeToken?: string;
  onMouseMove?: CategoricalChartFunc;
};

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
// export const LiquidBackingPerOhmComparisonGraph = ({
//   subgraphUrl,
//   activeToken,
//   count = DEFAULT_RECORDS_COUNT,
// }: GraphProps) => {
//   const queryExplorerUrl = getSubgraphQueryExplorerUrl(KeyMetricsDocument, subgraphUrl);

//   const theme = useTheme();

//   const isActiveTokenOHM = (): boolean => {
//     return activeToken === PARAM_TOKEN_OHM;
//   };

//   const dataKeys: string[] = isActiveTokenOHM()
//     ? ["ohmPrice", "treasuryLiquidBackingPerOhmFloating"]
//     : ["gOhmPrice", "treasuryLiquidBackingPerGOhm"];
//   const itemNames: string[] = isActiveTokenOHM()
//     ? [t`OHM Price`, t`Liquid Backing per Floating OHM`]
//     : [t`gOHM Price`, t`Liquid Backing per gOHM`];

//   const { data } = useKeyMetricsQuery({ endpoint: subgraphUrl }, { records: count }, QUERY_OPTIONS);

//   // No caching needed, as these are static categories
//   const categoriesMap = getCategoriesMap(itemNames, dataKeys);
//   const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
//   const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

//   return (
//     <Chart
//       type={ChartType.AreaDifference}
//       data={data ? data.protocolMetrics : []}
//       dataKeys={dataKeys}
//       dataKeyColors={colorsMap}
//       headerText={isActiveTokenOHM() ? t`OHM Backing` : t`gOHM Backing`}
//       headerSubText={`${
//         data &&
//         formatCurrency(
//           isActiveTokenOHM()
//             ? data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating
//             : data.protocolMetrics[0].treasuryLiquidBackingPerGOhm,
//           2,
//         )
//       }`}
//       dataFormat={DataFormat.Currency}
//       dataKeyBulletpointStyles={bulletpointStylesMap}
//       dataKeyLabels={categoriesMap}
//       margin={{ left: 30 }}
//       infoTooltipMessage={
//         isActiveTokenOHM()
//           ? t`This chart compares the price of OHM against its liquid backing. When OHM is above liquid backing, the difference will be highlighted in green. Conversely, when OHM is below liquid backing, the difference will be highlighted in red.`
//           : t`This chart compares the price of gOHM against its liquid backing. When gOHM is above liquid backing, the difference will be highlighted in green. Conversely, when gOHM is below liquid backing, the difference will be highlighted in red.`
//       }
//       isLoading={!data}
//       itemDecimals={2}
//       subgraphQueryUrl={queryExplorerUrl}
//       tickStyle={getTickStyle(theme)}
//     />
//   );
// };

/**
 * Displays the market value chart and assets table together, along with a toggle
 * to choose between displaying the market value or liquid backing.
 *
 * The assets table will update according to the toggle selection.
 *
 * @param param0
 * @returns
 */
export const TreasuryAssets = ({ subgraphUrl, earliestDate }: GraphProps) => {
  const isTreasuryAssetActive = (assets: string): boolean => {
    return selectedTreasuryAssets === assets;
  };

  // State variable for the selected tab
  const [selectedTreasuryAssets, setSelectedTreasuryAssets] = useState(QUERY_TREASURY_MARKET_VALUE);
  const [isLiquidBackingActive, setIsLiquidBackingActive] = useState(false);
  // Set the selected treasury assets from search parameters
  const [searchParams] = useSearchParams();
  useMemo(() => {
    // Get the record count from the URL query parameters, or use the default
    const queryTreasuryAssets = searchParams.get(QUERY_TREASURY) || QUERY_TREASURY_MARKET_VALUE;
    setSelectedTreasuryAssets(queryTreasuryAssets);
    setIsLiquidBackingActive(queryTreasuryAssets === QUERY_TREASURY_LIQUID_BACKING);
  }, [searchParams]);

  const getSearchParamsWithUpdatedTreasuryAssets = (assets: string): string => {
    return updateSearchParams(searchParams, QUERY_TREASURY, assets).toString();
  };

  // State variable for the selected index in the chart
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * Uses mouse movement events in the market value chart to record the
   * current index that the user is hovering over. This is then passed to
   * the assets table in order to have the contents reflect the current
   * index (date).
   *
   * @param nextState
   * @param event
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onMouseMove: CategoricalChartFunc = (nextState, event) => {
    // We need to explictly check for undefined, otherwise an index of 0 will be caught (OlympusDAO/olympus-frontend#2128)
    if (nextState.activeTooltipIndex === undefined) return;

    setSelectedIndex(nextState.activeTooltipIndex);
  };

  return (
    <>
      <Grid container paddingBottom={2}>
        <Grid item xs={12}>
          {/* The TabBar is designed to work with a flexbox so that it contracts & expands as necessary.
              With a Grid component, the width is more fixed, which leads to rendering issues. */}
          <Box display="flex" flexDirection="row" justifyContent="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: t`Market Value`,
                  to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_MARKET_VALUE)}`,
                  isActive: isTreasuryAssetActive(QUERY_TREASURY_MARKET_VALUE),
                },
                {
                  label: t`Liquid Backing`,
                  to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_LIQUID_BACKING)}`,
                  isActive: isTreasuryAssetActive(QUERY_TREASURY_LIQUID_BACKING),
                },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
      <MarketValueGraph
        subgraphUrl={subgraphUrl}
        isLiquidBackingActive={isLiquidBackingActive}
        onMouseMove={onMouseMove}
        earliestDate={earliestDate}
      />
      {/* <AssetsTable
        subgraphUrl={subgraphUrl}
        isLiquidBackingActive={isLiquidBackingActive}
        selectedIndex={selectedIndex}
      /> */}
    </>
  );
};

type LiquidBackingProps = {
  isLiquidBackingActive: boolean;
};

const CATEGORY_STABLE = "Stable";
const CATEGORY_VOLATILE = "Volatile";
const CATEGORY_POL = "Protocol-Owned Liquidity";

export const MarketValueGraph = ({
  subgraphUrl,
  earliestDate,
  onMouseMove,
  isLiquidBackingActive,
}: GraphProps & LiquidBackingProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const theme = useTheme();

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = getNextPageStartDate(initialFinishDate, earliestDate);
  const baseFilter = {};

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
      getNextPageParam(lastPage) {
        /**
         * The last element of lastPage will have the earliest date.
         *
         * The current start date (and hence, current page) is determined using
         * {lastPage}, as defining constant or state variables outside of this
         * code block leads to undesired behaviour.
         */
        if (!lastPage.tokenRecords.length) {
          console.debug("lastPage has no records. Exiting.");
          return;
        }

        const currentStartDate = lastPage.tokenRecords.slice(-1)[0].date;

        /**
         * If we are at the earliestDate, then there is no need to fetch the next page.
         *
         * Returning undefined tells react-query not to fetch the next page.
         */
        if (new Date(currentStartDate).getTime() <= new Date(earliestDate).getTime()) {
          console.debug("Data loading done");
          return;
        }

        /**
         * We adjust the date range and trigger the next query.
         */
        const newStartDate = getNextPageStartDate(currentStartDate, earliestDate);
        console.debug("Loading data for " + newStartDate);
        return {
          filter: {
            ...baseFilter,
            date_gte: newStartDate,
            date_lt: currentStartDate,
          },
        };
      },
    },
  );

  /**
   * We need to trigger a re-fetch when the earliestDate prop is changed.
   */
  useEffect(() => {
    console.debug("earliestDate changed to " + earliestDate + ". Re-fetching.");
    refetch();
  }, [earliestDate, refetch]);

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [data, hasNextPage, fetchNextPage]);

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
  const [byDateMetrics, setByDateMetrics] = useState<DateTreasuryMetrics[]>([]);
  const [total, setTotal] = useState("");

  /**
   * Generates an array containing one DateTreasuryMetrics element for each date,
   * in which the metrics are contained.
   *
   * The array is sorted in descending order by date.
   *
   * @param tokenRecords
   * @returns
   */
  const getDateTreasuryMetrics = (tokenRecords: TokenRecord[]): DateTreasuryMetrics[] => {
    const dateTokenRecords = getTokenRecordDateMap(tokenRecords);
    const dateMetricsMap: Map<string, DateTreasuryMetrics> = new Map<string, DateTreasuryMetrics>();

    const filterReduce = (records: TokenRecord[], filterPredicate: (value: TokenRecord) => unknown): number => {
      return records.filter(filterPredicate).reduce((previousValue, currentRecord) => {
        return previousValue + +currentRecord.value;
      }, 0);
    };

    /**
     * For each date, we have an array of token records.
     *
     * The relevant total is calculated by applying certain filters and summing (reducing) the value for the matching records.
     */
    dateTokenRecords.forEach((value, key) => {
      const marketStable = filterReduce(value, record => record.category == CATEGORY_STABLE);
      const marketVolatile = filterReduce(value, record => record.category == CATEGORY_VOLATILE);
      const marketPol = filterReduce(value, record => record.category == CATEGORY_POL);
      const liquidStable = filterReduce(value, record => record.category == CATEGORY_STABLE && record.isLiquid == true);
      const liquidVolatile = filterReduce(
        value,
        record => record.category == CATEGORY_VOLATILE && record.isLiquid == true,
      );
      const liquidPol = filterReduce(value, record => record.category == CATEGORY_POL && record.isLiquid == true);

      const dateMetric: DateTreasuryMetrics = {
        date: key,
        timestamp: new Date(key).getTime(), // We inject the timestamp, as it's used by the Chart component
        block: value[0].block,
        marketStable: marketStable,
        marketVolatile: marketVolatile,
        marketPol: marketPol,
        marketTotal: marketStable + marketVolatile + marketPol,
        liquidStable: liquidStable,
        liquidVolatile: liquidVolatile,
        liquidPol: liquidPol,
        liquidTotal: liquidStable + liquidVolatile + liquidPol,
      };

      dateMetricsMap.set(key, dateMetric);
    });

    // Sort in descending date order
    return Array.from(dateMetricsMap.values()).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  useMemo(() => {
    if (hasNextPage || !data) {
      // While data is loading, ensure dependent data is empty
      setByDateMetrics([]);
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();
    const tempByDateMetrics = getDateTreasuryMetrics(tokenRecords);
    setByDateMetrics(tempByDateMetrics);
  }, [data, hasNextPage]);

  useMemo(() => {
    if (!byDateMetrics.length) {
      setTotal("");
      return;
    }

    const lastMetric = byDateMetrics[byDateMetrics.length - 1];
    const tempTotal = isLiquidBackingActive ? lastMetric.liquidTotal : lastMetric.marketTotal;
    setTotal(formatCurrency(tempTotal, 0));
  }, [byDateMetrics, isLiquidBackingActive]);

  // What is displayed in the chart differs based on the value of isLiquidBackingActive
  const itemNames: string[] = [
    t`Stablecoins`,
    t`Volatile Assets`,
    t`Protocol-Owned Liquidity`,
    ...(isLiquidBackingActive ? [t`Market Value`] : [t`Liquid Backing`]),
  ];
  const dataKeys: string[] = isLiquidBackingActive
    ? ["liquidStable", "liquidVolatile", "liquidPol", "marketTotal"]
    : ["marketStable", "marketVolatile", "marketPol", "liquidTotal"];
  // The keys to display as a line
  const composedLineDataKeys: string[] = isLiquidBackingActive ? ["marketTotal"] : ["liquidTotal"];

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

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
      isLoading={hasNextPage || false} // hasNextPage will be false or undefined if loading is complete
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      composedLineDataKeys={composedLineDataKeys}
      onMouseMove={onMouseMove}
    />
  );
};

type DateTokenSummary = {
  date: string;
  timestamp: number;
  block: number;
  tokens: TokenMap;
};

/**
 * Generates an array containing one DateTokenSummary element for each date,
 * in which the token balances are contained.
 *
 * The array is sorted in descending order by date.
 *
 * @param tokenRecords
 * @returns
 */
const getDateTokenSummary = (tokenRecords: TokenRecord[]): DateTokenSummary[] => {
  const dateSummaryMap: Map<string, DateTokenSummary> = new Map<string, DateTokenSummary>();

  // tokenRecords is an array of flat records, one token each. We need to aggregate that date, then token
  tokenRecords.forEach(record => {
    const dateSummary = dateSummaryMap.get(record.date) || {
      date: record.date,
      timestamp: new Date(record.date).getTime(), // We inject the timestamp, as it's used by the Chart component
      block: record.block,
      tokens: {} as TokenMap,
    };
    dateSummaryMap.set(record.date, dateSummary);

    const tokenRecord = dateSummary.tokens[record.token] || ({} as TokenRow);
    tokenRecord.token = record.token;
    tokenRecord.category = record.category;

    const existingValue = tokenRecord.value ? parseFloat(tokenRecord.value) : 0;
    // record.value is typed as a number, but is actually a string
    tokenRecord.value = (existingValue + +record.value).toString(); // TODO consider shifting to use number
    dateSummary.tokens[record.token] = tokenRecord;
  });

  return Array.from(dateSummaryMap.values()).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

/**
 * Returns a date string (YYYY-MM-DD format) that represents the start date
 * for the next page in a react-query infinite query.
 *
 * If {earliestDateString} is greater than the adjusted date, it will be returned.
 *
 * @param dateString
 * @param earliestDateString
 * @returns
 */
const getNextPageStartDate = (dateString: string, earliestDateString: string, offset = DEFAULT_DATE_OFFSET): string => {
  const date = adjustDateByDays(new Date(dateString), offset);
  const earliestDate = new Date(earliestDateString);
  // We don't want to go further back than the earliestDate
  const finalDate = date.getTime() < earliestDate.getTime() ? earliestDate : date;

  return getISO8601String(finalDate);
};

export const ProtocolOwnedLiquidityGraph = ({ subgraphUrl, earliestDate }: GraphProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const theme = useTheme();

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = getNextPageStartDate(initialFinishDate, earliestDate);
  const baseFilter = {
    category: "Protocol-Owned Liquidity",
  };

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
      getNextPageParam(lastPage) {
        /**
         * The last element of lastPage will have the earliest date.
         *
         * The current start date (and hence, current page) is determined using
         * {lastPage}, as defining constant or state variables outside of this
         * code block leads to undesired behaviour.
         */
        if (!lastPage.tokenRecords.length) {
          console.debug("lastPage has no records. Exiting.");
          return;
        }

        const currentStartDate = lastPage.tokenRecords.slice(-1)[0].date;

        /**
         * If we are at the earliestDate, then there is no need to fetch the next page.
         *
         * Returning undefined tells react-query not to fetch the next page.
         */
        if (new Date(currentStartDate).getTime() <= new Date(earliestDate).getTime()) {
          console.debug("Data loading done");
          return;
        }

        /**
         * We adjust the date range and trigger the next query.
         */
        const newStartDate = getNextPageStartDate(currentStartDate, earliestDate);
        console.debug("Loading data for " + newStartDate);
        return {
          filter: {
            ...baseFilter,
            date_gte: newStartDate,
            date_lt: currentStartDate,
          },
        };
      },
    },
  );

  /**
   * We need to trigger a re-fetch when the earliestDate prop is changed.
   */
  useEffect(() => {
    console.debug("earliestDate changed to " + earliestDate + ". Re-fetching.");
    refetch();
  }, [earliestDate, refetch]);

  /**
   * Any time the data changes, we want to check if there are more pages (and data) to fetch.
   *
   * react-query's infinite query functionality apparently does not support automatically
   * fetching all pages. This code block achieves that.
   */
  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
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
      setByDateTokenSummary([]);
      setCategoryDataKeyMap(new Map<string, string>());
      setDataKeys([]);
      setDataKeyBulletpointStylesMap(new Map<string, CSSProperties>());
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
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

    const tempTotal =
      newDateTokenSummary.length > 0
        ? Object.values(newDateTokenSummary[0].tokens).reduce((previousValue: number, token: TokenRow) => {
            return +previousValue + parseFloat(token.value);
          }, 0)
        : 0;
    setTotal(formatCurrency(tempTotal, 0));
  }, [data, hasNextPage]);

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
      isLoading={hasNextPage || false} // hasNextPage will be false or undefined if loading is complete
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      margin={{ left: -5 }}
    />
  );
};

type AssetsTableProps = {
  selectedIndex: number;
};

// export const AssetsTable = ({
//   subgraphUrl,
//   isLiquidBackingActive,
//   selectedIndex,
// }: GraphProps & LiquidBackingProps & AssetsTableProps) => {
//   const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsComponentsDocument, subgraphUrl);

//   const { data } = useMarketValueMetricsComponentsQuery({ endpoint: subgraphUrl }, undefined, QUERY_OPTIONS);

//   // State variables used for rendering
//   const [reducedTokens, setReducedTokens] = useState<MetricRow[]>([]);
//   const [currentTokens, setCurrentTokens] = useState<TokenRow[]>([]);

//   /**
//    * We derive reducedTokens and currentMetric from {data}. They only need to be re-calculated
//    * when {data} changes, so they get wrapped in `useMemo`.
//    */
//   useMemo(() => {
//     if (!data) {
//       setReducedTokens([]);
//       return;
//     }

//     const keys: readonly string[] = isLiquidBackingActive
//       ? [
//           "treasuryLiquidBackingStableComponents",
//           "treasuryLiquidBackingVolatileComponents",
//           "treasuryLiquidBackingProtocolOwnedLiquidityComponents",
//         ]
//       : ["treasuryStableValueComponents", "treasuryVolatileValueComponents", "treasuryLPValueComponents"];
//     const categories: readonly string[] = [t`Stablecoins`, t`Volatile`, t`Protocol-Owned Liquidity`];

//     const newTokenSummary = getKeysTokenSummary(data.protocolMetrics, keys, categories);
//     const newReducedTokens = reduceKeysTokenSummary(newTokenSummary, keys);
//     setReducedTokens(newReducedTokens);
//   }, [data, isLiquidBackingActive]);

//   /**
//    * Cache the tokens for the current value of selectedIndex.
//    */
//   useMemo(() => {
//     setCurrentTokens(reducedTokens[selectedIndex] ? reducedTokens[selectedIndex].tokens : []);
//   }, [reducedTokens, selectedIndex]);

//   const columns: GridColDef[] = [
//     {
//       field: "token",
//       headerName: t`Asset`,
//       description: t`The token asset that is held`,
//       flex: 1,
//       valueGetter: (params: GridValueGetterParams) => renameToken(params.row.token),
//     },
//     {
//       field: "category",
//       headerName: t`Category`,
//       description: t`The category of the token asset`,
//       flex: 1,
//     },
//     {
//       field: "value",
//       headerName: t`Value`,
//       description: t`The total value of the token asset in USD`,
//       flex: 0.5,
//       type: "string",
//       sortComparator: (v1, v2) => {
//         // Get rid of all non-number characters
//         const stripCurrency = (currencyString: string) => currencyString.replaceAll(/[$,]/g, "");

//         return parseFloat(stripCurrency(v1)) - parseFloat(stripCurrency(v2));
//       },
//       valueGetter: (params: GridValueGetterParams) => formatCurrency(parseFloat(params.row.value)),
//       minWidth: 120,
//     },
//   ];

//   const headerText = t`Holdings`;

//   return (
//     <ChartCard
//       headerText={headerText}
//       headerTooltip={
//         isLiquidBackingActive
//           ? t`This table lists the details of the treasury assets that make up the liquid backing`
//           : t`This table lists the details of the treasury assets that make up the market value`
//       }
//       subgraphQueryUrl={queryExplorerUrl}
//       isLoading={false}
//     >
//       <DataGrid
//         autoHeight
//         loading={!data}
//         disableSelectionOnClick
//         rows={currentTokens}
//         rowHeight={30}
//         columns={columns}
//         rowsPerPageOptions={[10]}
//         pageSize={10}
//         getRowId={row => row.token}
//         // Sort by value descending
//         initialState={{
//           sorting: {
//             sortModel: [{ field: "value", sort: "desc" }],
//           },
//         }}
//         // Only ascending or descending sort
//         sortingOrder={["desc", "asc"]}
//         sx={{
//           "& .MuiDataGrid-columnHeaders": {
//             fontSize: "16px",
//             height: "40px",
//             borderBottom: "0px",
//           },
//           "& .MuiDataGrid-columnHeaderTitle": {
//             fontWeight: 800,
//           },
//           "& .MuiDataGrid-cellContent": {
//             fontSize: "14px",
//           },
//           // "& .MuiDataGrid-root" doesn't work here, for some reason
//           "&.MuiDataGrid-root": {
//             paddingLeft: "12px",
//             paddingRight: "12px",
//             border: "0px",
//           },
//           "& .MuiDataGrid-columnSeparator": {
//             display: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "0px",
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "0px",
//           },
//           // Disables outline on clicked cells
//           "& .MuiDataGrid-cell:focus": {
//             outline: "none",
//           },
//           // Disables outline on clicked header cells
//           "& .MuiDataGrid-columnHeader:focus": {
//             outline: "none",
//           },
//         }}
//       />
//     </ChartCard>
//   );
// };
