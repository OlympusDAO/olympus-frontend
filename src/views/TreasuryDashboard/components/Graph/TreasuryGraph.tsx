import { t } from "@lingui/macro";
import { Theme, useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { TokenRecord, TokenRecordsDocument, useTokenRecordsQuery } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
  getDataKeysFromTokens,
  TokenMap,
  TokenRow,
} from "src/helpers/ProtocolMetricsHelper";

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
const QUERY_OPTIONS = { refetchInterval: 60000 }; // Refresh every 60 seconds

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

type GraphProps = {
  subgraphUrl: string;
  startDate: string;
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
// export const TreasuryAssets = ({ subgraphUrl, count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
//   const isTreasuryAssetActive = (assets: string): boolean => {
//     return selectedTreasuryAssets === assets;
//   };

//   // State variable for the selected tab
//   const [selectedTreasuryAssets, setSelectedTreasuryAssets] = useState(QUERY_TREASURY_MARKET_VALUE);
//   const [isLiquidBackingActive, setIsLiquidBackingActive] = useState(false);
//   // Set the selected treasury assets from search parameters
//   const [searchParams] = useSearchParams();
//   useMemo(() => {
//     // Get the record count from the URL query parameters, or use the default
//     const queryTreasuryAssets = searchParams.get(QUERY_TREASURY) || QUERY_TREASURY_MARKET_VALUE;
//     setSelectedTreasuryAssets(queryTreasuryAssets);
//     setIsLiquidBackingActive(queryTreasuryAssets === QUERY_TREASURY_LIQUID_BACKING);
//   }, [searchParams]);

//   const getSearchParamsWithUpdatedTreasuryAssets = (assets: string): string => {
//     return updateSearchParams(searchParams, QUERY_TREASURY, assets).toString();
//   };

//   // State variable for the selected index in the chart
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   /**
//    * Uses mouse movement events in the market value chart to record the
//    * current index that the user is hovering over. This is then passed to
//    * the assets table in order to have the contents reflect the current
//    * index (date).
//    *
//    * @param nextState
//    * @param event
//    * @returns
//    */
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const onMouseMove: CategoricalChartFunc = (nextState, event) => {
//     // We need to explictly check for undefined, otherwise an index of 0 will be caught (OlympusDAO/olympus-frontend#2128)
//     if (nextState.activeTooltipIndex === undefined) return;

//     setSelectedIndex(nextState.activeTooltipIndex);
//   };

//   return (
//     <>
//       <Grid container paddingBottom={2}>
//         <Grid item xs={12}>
//           {/* The TabBar is designed to work with a flexbox so that it contracts & expands as necessary.
//               With a Grid component, the width is more fixed, which leads to rendering issues. */}
//           <Box display="flex" flexDirection="row" justifyContent="center">
//             <TabBar
//               disableRouting
//               items={[
//                 {
//                   label: t`Market Value`,
//                   to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_MARKET_VALUE)}`,
//                   isActive: isTreasuryAssetActive(QUERY_TREASURY_MARKET_VALUE),
//                 },
//                 {
//                   label: t`Liquid Backing`,
//                   to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_LIQUID_BACKING)}`,
//                   isActive: isTreasuryAssetActive(QUERY_TREASURY_LIQUID_BACKING),
//                 },
//               ]}
//             />
//           </Box>
//         </Grid>
//       </Grid>
//       <MarketValueGraph
//         subgraphUrl={subgraphUrl}
//         isLiquidBackingActive={isLiquidBackingActive}
//         onMouseMove={onMouseMove}
//         count={count}
//       />
//       <AssetsTable
//         subgraphUrl={subgraphUrl}
//         isLiquidBackingActive={isLiquidBackingActive}
//         selectedIndex={selectedIndex}
//       />
//     </>
//   );
// };

type LiquidBackingProps = {
  isLiquidBackingActive: boolean;
};

// export const MarketValueGraph = ({
//   subgraphUrl,
//   count = DEFAULT_RECORDS_COUNT,
//   onMouseMove,
//   isLiquidBackingActive,
// }: GraphProps & LiquidBackingProps) => {
//   const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsDocument, subgraphUrl);

//   const theme = useTheme();

//   // What is displayed in the chart differs based on the value of isLiquidBackingActive
//   const itemNames: string[] = [
//     t`Stablecoins`,
//     t`Volatile Assets`,
//     t`Protocol-Owned Liquidity`,
//     ...(isLiquidBackingActive ? [t`Market Value`] : [t`Liquid Backing`]),
//   ];
//   const dataKeys: string[] = isLiquidBackingActive
//     ? [
//         "treasuryLiquidBackingStable",
//         "treasuryLiquidBackingVolatile",
//         "treasuryLiquidBackingProtocolOwnedLiquidity",
//         "treasuryMarketValue",
//       ]
//     : ["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue", "treasuryLiquidBacking"];
//   // The keys to display as a line
//   const composedLineDataKeys: string[] = isLiquidBackingActive ? ["treasuryMarketValue"] : ["treasuryLiquidBacking"];

//   const { data } = useMarketValueMetricsQuery({ endpoint: subgraphUrl }, { records: count }, QUERY_OPTIONS);

//   const headerSubtext = data
//     ? isLiquidBackingActive
//       ? formatCurrency(data.protocolMetrics[0].treasuryLiquidBacking)
//       : formatCurrency(data.protocolMetrics[0].treasuryMarketValue)
//     : "";

//   // No caching needed, as these are static categories
//   const categoriesMap = getCategoriesMap(itemNames, dataKeys);
//   const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
//   const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

//   return (
//     <Chart
//       type={ChartType.Composed}
//       data={data ? data.protocolMetrics : []}
//       dataKeys={dataKeys}
//       dataKeyColors={colorsMap}
//       dataFormat={DataFormat.Currency}
//       headerText={isLiquidBackingActive ? t`Treasury Liquid Backing` : t`Market Value of Treasury Assets`}
//       headerSubText={headerSubtext}
//       dataKeyBulletpointStyles={bulletpointStylesMap}
//       dataKeyLabels={categoriesMap}
//       infoTooltipMessage={
//         isLiquidBackingActive
//           ? t`Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, excluding OHM. This excludes the value of any illiquid (vesting/locked) assets. It represents the budget the Treasury has for specific market operations which cannot use OHM (inverse bonds, some liquidity provision, OHM incentives, etc).`
//           : t`Market Value of Treasury Assets is the sum of the value (in dollars) of all assets held by the treasury (excluding pTokens).`
//       }
//       isLoading={!data}
//       itemDecimals={0}
//       subgraphQueryUrl={queryExplorerUrl}
//       displayTooltipTotal={true}
//       tickStyle={getTickStyle(theme)}
//       composedLineDataKeys={composedLineDataKeys}
//       onMouseMove={onMouseMove}
//     />
//   );
// };

type DateTokenSummary = {
  date: string;
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
  const filteredRecords = tokenRecords.filter(tokenRecord => tokenRecord.category === "Protocol-Owned Liquidity");
  const dateSummaryMap: Map<string, DateTokenSummary> = new Map<string, DateTokenSummary>();

  // filteredRecords is an array of flat records, one token each. We need to aggregate that date, then token
  filteredRecords.forEach(record => {
    const dateSummary = dateSummaryMap.get(record.date) || {
      date: record.date,
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

export const ProtocolOwnedLiquidityGraph = ({ subgraphUrl, startDate }: GraphProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const theme = useTheme();

  /**
   * Initial data fetching:
   *
   * This code block kicks off data fetching with a default startingRecord of 0.
   *
   * Pagination is handled in the subsequent code block.
   */
  const [startingRecord, setStartingRecord] = useState(0);
  const { data, isSuccess } = useTokenRecordsQuery(
    { endpoint: subgraphUrl },
    { startDate: startDate, recordCount: DEFAULT_RECORD_COUNT, startingRecord: startingRecord },
    QUERY_OPTIONS, // TODO what happens to auto-updating?
  );

  /**
   * Pagination:
   *
   * When data fetching (of the current "page") is complete, it is handled
   * by this code block, which triggers the next page.
   */
  const [tokenRecords, setTokenRecords] = useState<TokenRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  useEffect(() => {
    // Ignore if the data hasn't finished loading
    if (!isSuccess) return;
    if (!data) return;

    // If there are no more records, we trigger processing of the complete data set
    if (data.tokenRecords.length === 0) {
      setIsDataLoading(false);
      return;
    }

    // Combine the new records with the existing ones
    tokenRecords.push(...data.tokenRecords);

    // Trigger fetching the next set of records
    setStartingRecord(startingRecord => startingRecord + DEFAULT_RECORD_COUNT);
  }, [data, isSuccess]);

  /**
   * Resetting data fetching:
   *
   * When the {startDate} changes, we need to reset the data. Doing so
   * will trigger re-fetching of the data.
   */
  useEffect(() => {
    setIsDataLoading(true);
    setTokenRecords([]);
    setStartingRecord(0);
  }, [startDate]);
  // TODO look at extracting pagination into a hook

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
    if (isDataLoading) {
      setByDateTokenSummary([]);
      setCategoryDataKeyMap(new Map<string, string>());
      setDataKeys([]);
      setDataKeyBulletpointStylesMap(new Map<string, CSSProperties>());
      return;
    }

    const newDateTokenSummary = getDateTokenSummary(tokenRecords);
    setByDateTokenSummary(newDateTokenSummary);

    const filteredRecords = tokenRecords.filter(tokenRecord => tokenRecord.category === "Protocol-Owned Liquidity");
    const tokenCategories = Array.from(new Set(filteredRecords.map(tokenRecord => tokenRecord.token)));

    const tempDataKeys = getDataKeysFromTokens(tokenCategories, "");
    setDataKeys(tempDataKeys);

    const tempCategoriesMap = getCategoriesMap(tokenCategories, tempDataKeys);
    setCategoryDataKeyMap(tempCategoriesMap);

    const tempBulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys);
    setDataKeyBulletpointStylesMap(tempBulletpointStylesMap);

    const tempColorsMap = getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys);
    setDataKeyColorsMap(tempColorsMap);

    const tempTotal =
      byDateTokenSummary.length > 0
        ? Object.values(byDateTokenSummary[0].tokens).reduce((previousValue: number, token: TokenRow) => {
            return +previousValue + parseFloat(token.value);
          }, 0)
        : 0;
    setTotal(formatCurrency(tempTotal, 0));
  }, [isDataLoading]);

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
      isLoading={!data}
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
