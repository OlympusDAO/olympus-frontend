import { t } from "@lingui/macro";
import { Theme, useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { CSSProperties, useMemo, useState } from "react";
import Chart, { DataFormat } from "src/components/Chart/Chart";
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
  getCategoriesMap,
  getColoursMap,
  getDataKeysFromTokens,
  getKeysTokenSummary,
  getTokensFromKey,
  MetricRow,
  reduceKeysTokenSummary,
  renameToken,
} from "src/helpers/ProtocolMetricsHelper";

import { itemType, tooltipInfoMessages } from "../../treasuryData";
import { ChartCard } from "./ChartCard";

// These constants are used by charts to have consistent colours
// Source: https://www.figma.com/file/RCfzlYA1i8wbJI3rPGxxxz/SubGraph-Charts-V3?node-id=0%3A1
const defaultColors: string[] = [
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
const defaultBulletpointColours: CSSProperties[] = defaultColors.map(value => {
  return {
    background: value,
  };
});
export const defaultRecordsCount = 90;

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
export const LiquidBackingPerOhmComparisonGraph = ({ count = defaultRecordsCount }: GraphProps) => {
  const theme = useTheme();

  const dataKeys: string[] = ["ohmPrice", "treasuryLiquidBackingPerOhmFloating"];
  const itemNames: string[] = [t`OHM Price`, t`Liquid Backing per Floating OHM`];

  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(KeyMetricsDocument);

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const colorsMap = getColoursMap(defaultBulletpointColours, dataKeys);

  return (
    <Chart
      type="composed"
      data={data ? data.protocolMetrics : []}
      dataKey={dataKeys}
      itemType={itemType.dollar}
      color={""}
      stopColor={[[]]}
      stroke={defaultColors}
      headerText={t`OHM Backing`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating, 2)}`}
      dataFormat={DataFormat.Currency}
      bulletpointColors={colorsMap}
      categories={categoriesMap}
      margin={{ left: 30 }}
      infoTooltipMessage={tooltipInfoMessages().backingPerOhm}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isLoading={!data}
      isStaked={false}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
      tickStyle={getTickStyle(theme)}
    />
  );
};

export const MarketValueGraph = ({ count = defaultRecordsCount }: GraphProps) => {
  const theme = useTheme();

  const itemNames: string[] = [t`Stablecoins`, t`Volatile Assets`, t`Protocol-Owned Liquidity`];
  const dataKeys: string[] = ["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue"];

  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsDocument);

  // No caching needed, as these are static categories
  const categoriesMap = getCategoriesMap(itemNames, dataKeys);
  const colorsMap = getColoursMap(defaultBulletpointColours, dataKeys);

  return (
    <Chart
      type="stack"
      data={data ? data.protocolMetrics : []}
      dataKey={dataKeys}
      color={""}
      stopColor={[[]]}
      stroke={defaultColors}
      dataFormat={DataFormat.Currency}
      headerText={t`Market Value of Treasury Assets`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryMarketValue)}`}
      bulletpointColors={colorsMap}
      categories={categoriesMap}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().mvt}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isLoading={!data}
      isStaked={false}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = ({ count = defaultRecordsCount }: GraphProps) => {
  const theme = useTheme();

  const { data } = useProtocolOwnedLiquidityComponentsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolOwnedLiquidityComponentsDocument);

  // State variables used for rendering
  const initialTokenSummary: any[] = [];
  const [tokenSummary, setTokenSummary] = useState(initialTokenSummary);
  const [categoriesMap, setCategoriesMap] = useState(new Map<string, string>());
  const initialDataKeys: string[] = [];
  const [dataKeys, setDataKeys] = useState(initialDataKeys);
  const [colorsMap, setColorsMap] = useState(new Map<string, CSSProperties>());

  // Dependent variables are only re-calculate when the data changes
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

    const tempColorsMap = getColoursMap(defaultBulletpointColours, tempDataKeys);
    setColorsMap(tempColorsMap);
  }, [data]);

  return (
    <Chart
      type="stack"
      data={tokenSummary}
      dataKey={dataKeys}
      color={""}
      stopColor={[[]]}
      stroke={defaultColors}
      dataFormat={DataFormat.Currency}
      headerText={t`Protocol-Owned Liquidity`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLPValueComponents.value, 0)}`}
      bulletpointColors={colorsMap}
      categories={categoriesMap}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().pol}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isLoading={!data}
      isStaked={false}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
    />
  );
};

export const AssetsTable = () => {
  const { data } = useMarketValueMetricsComponentsQuery({ endpoint: getSubgraphUrl() });
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
    const categories: readonly string[] = ["Stablecoins", "Volatile", "Protocol-Owned Liquidity"];

    const newTokenSummary = getKeysTokenSummary(data.protocolMetrics, keys, categories);
    const newReducedTokens = reduceKeysTokenSummary(newTokenSummary, keys);
    const newCurrentMetric = newReducedTokens[0];

    setCurrentMetric(newCurrentMetric);
  }, [data]);

  // TODO handle date scrubbing

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: "Asset",
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => renameToken(params.row.token),
    },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "value",
      headerName: "Value",
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

  const headerText = "Holdings";

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
