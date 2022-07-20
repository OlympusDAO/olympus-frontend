import { t } from "@lingui/macro";
import { Theme, useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { CSSProperties, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { getSubgraphUrl } from "src/constants";
import {
  KeyMetricsDocument,
  MarketValueMetricsComponentsDocument,
  MarketValueMetricsDocument,
  ProtocolOwnedLiquidityComponentsDocument,
  useKeyMetricsQuery,
  useLiquidBackingMetricsQuery,
  useMarketValueMetricsComponentsQuery,
  useMarketValueMetricsQuery,
  useProtocolOwnedLiquidityComponentsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import {
  getCategoriesMap,
  getColoursMap,
  getDataKeysFromTokens,
  getKeysTokenSummary,
  getTokensFromKey,
  MetricRow,
  reduceKeysTokenSummary,
  renameToken,
} from "src/helpers/ProtocolMetricsHelper";
import { ChartCard, ToggleCallback } from "src/views/TreasuryDashboard/components/Graph/ChartCard";

// These constants are used by charts to have consistent colours
// Source: https://www.figma.com/file/RCfzlYA1i8wbJI3rPGxxxz/SubGraph-Charts-V3?node-id=0%3A1
const DEFAULT_COLORS: string[] = [
  "#49A1F2",
  "#95B7A1",
  "#917BD9",
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
  count?: number;
};

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = ({ count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
  const theme = useTheme();

  const dataKeys: string[] = ["ohmPrice", "treasuryLiquidBackingPerOhmFloating"];
  const itemNames: string[] = [t`OHM Price`, t`Liquid Backing per Floating OHM`];

  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count }, QUERY_OPTIONS);
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(KeyMetricsDocument);

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const colorsMap = getColoursMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);

  return (
    <Chart
      type={ChartType.ComposedArea}
      data={data ? data.protocolMetrics : []}
      dataKey={dataKeys}
      stroke={DEFAULT_COLORS}
      headerText={t`OHM Backing`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating, 2)}`}
      dataFormat={DataFormat.Currency}
      bulletpointColors={colorsMap}
      categories={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={t`This chart compares the price of OHM against its liquid backing. When OHM is above liquid backing, the difference will be highlighted in green. Conversely, when OHM is below liquid backing, the difference will be highlighted in red.`}
      isLoading={!data}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
      tickStyle={getTickStyle(theme)}
    />
  );
};

export const MarketValueGraph = ({ count = DEFAULT_RECORDS_COUNT }: GraphProps) => {
  const theme = useTheme();

  const itemNames: string[] = [t`Stablecoins`, t`Volatile Assets`, t`Protocol-Owned Liquidity`];
  const dataKeys: string[] = ["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue"];
  const liquidBackingDataKeys: string[] = [
    "treasuryLiquidBackingStable",
    "treasuryLiquidBackingVolatile",
    "treasuryLiquidBackingProtocolOwnedLiquidity",
  ];

  const [isLiquidBackingActive, setIsLiquidBackingActive] = useState(false);

  const { data: marketValueData } = useMarketValueMetricsQuery(
    { endpoint: getSubgraphUrl() },
    { records: count },
    QUERY_OPTIONS,
  );
  const { data: liquidBackingData } = useLiquidBackingMetricsQuery(
    { endpoint: getSubgraphUrl() },
    { records: count },
    QUERY_OPTIONS,
  );
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsDocument);

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const colorsMap = getColoursMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);

  const handleToggle: ToggleCallback = (event, newValue): void => {
    // TODO fix this
    setIsLiquidBackingActive(!isLiquidBackingActive);
  };

  const selectedData = isLiquidBackingActive ? liquidBackingData : marketValueData;
  console.log("selectedData = " + JSON.stringify(selectedData?.protocolMetrics[0]));

  const selectedDataKeys = isLiquidBackingActive ? liquidBackingDataKeys : dataKeys;

  return (
    <Chart
      type={ChartType.StackedArea}
      data={selectedData ? selectedData.protocolMetrics : []}
      dataKey={selectedDataKeys}
      stroke={DEFAULT_COLORS}
      dataFormat={DataFormat.Currency}
      headerText={t`Market Value of Treasury Assets`}
      headerSubText={""} // TODO fix
      bulletpointColors={colorsMap}
      categories={categoriesMap}
      infoTooltipMessage={t`Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury (Excluding pTokens and Vested tokens).`}
      isLoading={!selectedData}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      handleToggle={handleToggle}
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
  const [colorsMap, setColorsMap] = useState(new Map<string, CSSProperties>());

  // Dependent variables are only re-calculated when the data changes
  useMemo(() => {
    if (!data) {
      setTokenSummary([]);
      setCategoriesMap(new Map<string, string>());
      setDataKeys([]);
      setColorsMap(new Map<string, CSSProperties>());
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

    const tempColorsMap = getColoursMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys);
    setColorsMap(tempColorsMap);
  }, [data]);

  return (
    <Chart
      type={ChartType.StackedArea}
      data={tokenSummary}
      dataKey={dataKeys}
      stroke={DEFAULT_COLORS}
      dataFormat={DataFormat.Currency}
      headerText={t`Protocol-Owned Liquidity`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLPValueComponents.value, 0)}`}
      bulletpointColors={colorsMap}
      categories={categoriesMap}
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

export const AssetsTable = () => {
  const { data } = useMarketValueMetricsComponentsQuery({ endpoint: getSubgraphUrl() }, undefined, QUERY_OPTIONS);
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsComponentsDocument);

  // State variables used for rendering
  const [currentMetric, setCurrentMetric] = useState<MetricRow | null>(null);

  /**
   * We derive reducedTokens and currentMetric from {data}. They only need to be re-calculated
   * when {data} changes, so they get wrapped in `useMemo`.
   */
  useMemo(() => {
    if (!data) {
      setCurrentMetric(null);
      return;
    }

    const keys: readonly string[] = [
      "treasuryStableValueComponents",
      "treasuryVolatileValueComponents",
      "treasuryLPValueComponents",
    ];
    const categories: readonly string[] = [t`Stablecoins`, t`Volatile`, t`Protocol-Owned Liquidity`];

    const newTokenSummary = getKeysTokenSummary(data.protocolMetrics, keys, categories);
    const newReducedTokens = reduceKeysTokenSummary(newTokenSummary, keys);
    const newCurrentMetric = newReducedTokens[0];

    setCurrentMetric(newCurrentMetric);
  }, [data]);

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
    },
  ];

  const headerText = t`Holdings`;

  return (
    <ChartCard
      headerText={headerText}
      headerTooltip={t`This table lists the details of the treasury assets that make up the market value`}
      subgraphQueryUrl={queryExplorerUrl}
      isLoading={false}
    >
      <DataGrid
        autoHeight
        loading={!data}
        disableSelectionOnClick
        rows={currentMetric ? currentMetric.tokens : []}
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
