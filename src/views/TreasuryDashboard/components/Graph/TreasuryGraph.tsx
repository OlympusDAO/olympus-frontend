import { t } from "@lingui/macro";
import { Grid } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { TabBar } from "@olympusdao/component-library";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { getSubgraphUrl } from "src/constants";
import {
  KeyMetricsDocument,
  MarketValueMetricsComponentsDocument,
  MarketValueMetricsDocument,
  ProtocolOwnedLiquidityComponentsDocument,
  useKeyMetricsQuery,
  useMarketValueMetricsComponentsQuery,
  useMarketValueMetricsQuery,
  useProtocolOwnedLiquidityComponentsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
  getDataKeysFromTokens,
  getKeysTokenSummary,
  getTokensFromKey,
  MetricRow,
  reduceKeysTokenSummary,
  renameToken,
  TokenRow,
} from "src/helpers/ProtocolMetricsHelper";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";

import { QUERY_TOKEN_OHM } from "./Constants";

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
export const DEFAULT_RECORDS_COUNT = 90;
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

const getSubgraphQueryExplorerUrl = (queryDocument: string): string => {
  return `${getSubgraphUrl()}/graphql?query=${encodeURIComponent(queryDocument)}`;
};

type GraphProps = {
  activeToken?: string;
  count?: number;
  onMouseMove?: CategoricalChartFunc;
};

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = ({ activeToken, count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
  const theme = useTheme();

  const isActiveTokenOHM = (): boolean => {
    return activeToken === QUERY_TOKEN_OHM;
  };

  const dataKeys: string[] = isActiveTokenOHM()
    ? ["ohmPrice", "treasuryLiquidBackingPerOhmFloating"]
    : ["gOhmPrice", "treasuryLiquidBackingPerGOhmCirculating"];
  const itemNames: string[] = isActiveTokenOHM()
    ? [t`OHM Price`, t`Liquid Backing per Floating OHM`]
    : [t`gOHM Price`, t`Liquid Backing per Circulating gOHM`];

  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count }, QUERY_OPTIONS);
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(KeyMetricsDocument);

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

  return (
    <Chart
      type={ChartType.AreaDifference}
      data={data ? data.protocolMetrics : []}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      headerText={isActiveTokenOHM() ? t`OHM Backing` : t`gOHM Backing`}
      headerSubText={`${
        data &&
        formatCurrency(
          isActiveTokenOHM()
            ? data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating
            : data.protocolMetrics[0].treasuryLiquidBackingPerGOhmCirculating,
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
      isLoading={!data}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
      tickStyle={getTickStyle(theme)}
    />
  );
};

/**
 * Displays the market value chart and assets table together, along with a toggle
 * to choose between displaying the market value or liquid backing.
 *
 * The assets table will update according to the toggle selection.
 *
 * @param param0
 * @returns
 */
export const MarketValueLiquidBackingGraphContainer = ({ count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
  const isTreasuryAssetActive = (assets: string): boolean => {
    return selectedTreasuryAssets === assets;
  };

  // State variable for the selected tab
  const [selectedTreasuryAssets, setSelectedTreasuryAssets] = useState(QUERY_TREASURY_MARKET_VALUE);
  const [isLiquidBackingActive, setIsLiquidBackingActive] = useState(false);
  // Set the selected treasury assets from search parameters
  const [searchParams] = useSearchParams();
  useEffect(() => {
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
    if (!nextState.activeTooltipIndex) return;

    setSelectedIndex(nextState.activeTooltipIndex);
  };

  return (
    <>
      <Grid container paddingBottom={2}>
        <Grid item xs={2} md={4} />
        <Grid item xs={8} md={4} textAlign={"center"}>
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
        </Grid>
        <Grid item xs={2} md={4} />
      </Grid>
      <MarketValueGraph isLiquidBackingActive={isLiquidBackingActive} onMouseMove={onMouseMove} count={count} />
      <AssetsTable isLiquidBackingActive={isLiquidBackingActive} selectedIndex={selectedIndex} />
    </>
  );
};

type LiquidBackingProps = {
  isLiquidBackingActive: boolean;
};

export const MarketValueGraph = ({
  count = DEFAULT_RECORDS_COUNT,
  onMouseMove,
  isLiquidBackingActive,
}: GraphProps & LiquidBackingProps) => {
  const theme = useTheme();

  // What is displayed in the chart differs based on the value of isLiquidBackingActive
  const itemNames: string[] = [
    t`Stablecoins`,
    t`Volatile Assets`,
    t`Protocol-Owned Liquidity`,
    ...(isLiquidBackingActive ? [t`Market Value`] : [t`Liquid Backing`]),
  ];
  const dataKeys: string[] = isLiquidBackingActive
    ? [
        "treasuryLiquidBackingStable",
        "treasuryLiquidBackingVolatile",
        "treasuryLiquidBackingProtocolOwnedLiquidity",
        "treasuryMarketValue",
      ]
    : ["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue", "treasuryLiquidBacking"];
  // The keys to display as a line
  const composedLineDataKeys: string[] = isLiquidBackingActive ? ["treasuryMarketValue"] : ["treasuryLiquidBacking"];

  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count }, QUERY_OPTIONS);
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsDocument);

  const headerSubtext = data
    ? isLiquidBackingActive
      ? formatCurrency(data.protocolMetrics[0].treasuryLiquidBacking)
      : formatCurrency(data.protocolMetrics[0].treasuryMarketValue)
    : "";

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const bulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);

  return (
    <Chart
      type={ChartType.Composed}
      data={data ? data.protocolMetrics : []}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataFormat={DataFormat.Currency}
      headerText={isLiquidBackingActive ? t`Treasury Liquid Backing` : t`Market Value of Treasury Assets`}
      headerSubText={headerSubtext}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
      infoTooltipMessage={
        isLiquidBackingActive
          ? t`Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, excluding OHM. This excludes the value of any illiquid (vesting/locked) assets. It represents the budget the Treasury has for specific market operations which cannot use OHM (inverse bonds, some liquidity provision, OHM incentives, etc).`
          : t`Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury (Excluding pTokens and Vested tokens).`
      }
      isLoading={!data}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      composedLineDataKeys={composedLineDataKeys}
      onMouseMove={onMouseMove}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = ({ count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
  const theme = useTheme();

  const { data } = useProtocolOwnedLiquidityComponentsQuery(
    { endpoint: getSubgraphUrl() },
    { records: count },
    QUERY_OPTIONS,
  );
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolOwnedLiquidityComponentsDocument);

  // State variables used for rendering
  const initialTokenSummary: any[] = [];
  const [tokenSummary, setTokenSummary] = useState(initialTokenSummary);
  const [categoriesMap, setCategoriesMap] = useState(new Map<string, string>());
  const initialDataKeys: string[] = [];
  const [dataKeys, setDataKeys] = useState(initialDataKeys);
  const [bulletpointStylesMap, setBulletpointStylesMap] = useState(new Map<string, CSSProperties>());
  const [colorsMap, setColorsMap] = useState(new Map<string, string>());

  // Dependent variables are only re-calculated when the data changes
  useMemo(() => {
    if (!data) {
      setTokenSummary([]);
      setCategoriesMap(new Map<string, string>());
      setDataKeys([]);
      setBulletpointStylesMap(new Map<string, CSSProperties>());
      return;
    }

    const tempTokenSummary = getKeysTokenSummary(
      data?.protocolMetrics,
      ["treasuryLPValueComponents"],
      ["Protocol-Owned Liquidity"],
    );
    setTokenSummary(tempTokenSummary);

    const tokenCategories = getTokensFromKey(tempTokenSummary, "treasuryLPValueComponents");
    const tempDataKeys = getDataKeysFromTokens(tokenCategories, "treasuryLPValueComponents");
    setDataKeys(tempDataKeys);

    const tempCategoriesMap = getCategoriesMap(tokenCategories, tempDataKeys);
    setCategoriesMap(tempCategoriesMap);

    const tempBulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys);
    setBulletpointStylesMap(tempBulletpointStylesMap);

    const tempColorsMap = getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys);
    setColorsMap(tempColorsMap);
  }, [data]);

  return (
    <Chart
      type={ChartType.StackedArea}
      data={tokenSummary}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataFormat={DataFormat.Currency}
      headerText={t`Protocol-Owned Liquidity`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLPValueComponents.value, 0)}`}
      dataKeyBulletpointStyles={bulletpointStylesMap}
      dataKeyLabels={categoriesMap}
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

export const AssetsTable = ({ isLiquidBackingActive, selectedIndex }: LiquidBackingProps & AssetsTableProps) => {
  const { data } = useMarketValueMetricsComponentsQuery({ endpoint: getSubgraphUrl() }, undefined, QUERY_OPTIONS);
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsComponentsDocument);

  // State variables used for rendering
  const [reducedTokens, setReducedTokens] = useState<MetricRow[]>([]);
  const [currentTokens, setCurrentTokens] = useState<TokenRow[]>([]);

  /**
   * We derive reducedTokens and currentMetric from {data}. They only need to be re-calculated
   * when {data} changes, so they get wrapped in `useMemo`.
   */
  useMemo(() => {
    if (!data) {
      setReducedTokens([]);
      return;
    }

    const keys: readonly string[] = isLiquidBackingActive
      ? [
          "treasuryLiquidBackingStableComponents",
          "treasuryLiquidBackingVolatileComponents",
          "treasuryLiquidBackingProtocolOwnedLiquidityComponents",
        ]
      : ["treasuryStableValueComponents", "treasuryVolatileValueComponents", "treasuryLPValueComponents"];
    const categories: readonly string[] = [t`Stablecoins`, t`Volatile`, t`Protocol-Owned Liquidity`];

    const newTokenSummary = getKeysTokenSummary(data.protocolMetrics, keys, categories);
    const newReducedTokens = reduceKeysTokenSummary(newTokenSummary, keys);
    setReducedTokens(newReducedTokens);
  }, [data, isLiquidBackingActive]);

  /**
   * Cache the tokens for the current value of selectedIndex.
   */
  useMemo(() => {
    setCurrentTokens(reducedTokens[selectedIndex] ? reducedTokens[selectedIndex].tokens : []);
  }, [reducedTokens, selectedIndex]);

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: t`Asset`,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => renameToken(params.row.token),
    },
    { field: "category", headerName: t`Category`, flex: 1 },
    {
      field: "value",
      headerName: t`Value`,
      flex: 0.5,
      type: "string",
      sortComparator: (v1, v2) => {
        // Get rid of all non-number characters
        const stripCurrency = (currencyString: string) => currencyString.replaceAll(/[$,]/g, "");

        return parseFloat(stripCurrency(v1)) - parseFloat(stripCurrency(v2));
      },
      valueGetter: (params: GridValueGetterParams) => formatCurrency(parseFloat(params.row.value)),
      minWidth: 120,
    },
  ];

  const headerText = t`Holdings`;

  return (
    <ChartCard
      headerText={headerText}
      headerTooltip={
        isLiquidBackingActive
          ? t`This table lists the details of the treasury assets that make up the liquid backing`
          : t`This table lists the details of the treasury assets that make up the market value`
      }
      subgraphQueryUrl={queryExplorerUrl}
      isLoading={false}
    >
      <DataGrid
        autoHeight
        loading={!data}
        disableSelectionOnClick
        rows={currentTokens}
        rowHeight={30}
        columns={columns}
        pageSize={10}
        getRowId={row => row.token}
        // Sort by value descending
        initialState={{
          sorting: {
            sortModel: [{ field: "value", sort: "desc" }],
          },
        }}
        // Only ascending or descending sort
        sortingOrder={["desc", "asc"]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "16px",
            height: "40px",
            borderBottom: "0px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
          },
          "& .MuiDataGrid-cellContent": {
            fontSize: "14px",
          },
          // "& .MuiDataGrid-root" doesn't work here, for some reason
          "&.MuiDataGrid-root": {
            paddingLeft: "12px",
            paddingRight: "12px",
            border: "0px",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "0px",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "0px",
          },
          // Disables outline on clicked cells
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />
    </ChartCard>
  );
};
