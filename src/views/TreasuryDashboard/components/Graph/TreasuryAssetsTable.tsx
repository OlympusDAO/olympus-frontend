import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { TokenRecord_Filter, TokenRecordsDocument } from "src/generated/graphql";
import { formatCurrency, formatNumber } from "src/helpers";
import { renameToken } from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";
import {
  AssetsTableProps,
  GraphProps,
  LiquidBackingProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  DateTokenSummary,
  getDateTokenSummary,
  TokenRow,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

/**
 * Data grid that displays the details of treasury assets.
 */
export const TreasuryAssetsTable = ({
  subgraphUrls,
  earliestDate,
  isLiquidBackingActive,
  selectedIndex,
  subgraphDaysOffset,
}: GraphProps & LiquidBackingProps & AssetsTableProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrls.Ethereum);
  const chartName = "TreasuryAssetsTable";
  const [baseFilter] = useState<TokenRecord_Filter>({});

  const tokenRecordResults = useTokenRecordsQueries(
    chartName,
    subgraphUrls,
    baseFilter,
    earliestDate,
    subgraphDaysOffset,
  );

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateTokenSummary, setByDateTokenSummary] = useState<DateTokenSummary[]>([]);
  const [currentTokens, setCurrentTokens] = useState<TokenRow[]>([]);
  useMemo(() => {
    if (!tokenRecordResults) {
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date token summary`);

    const flatRecords = Array.from(tokenRecordResults.values()).flat();
    // We do the filtering of isLiquid client-side. Doing it in the GraphQL query results in incorrect data being spliced into the TreasuryAssetsGraph. Very weird.
    const filteredRecords = isLiquidBackingActive ? flatRecords.filter(value => value.isLiquid == true) : flatRecords;
    /**
     * latestOnly is false as the "latest" block is different on each blockchain.
     * They are already filtered by latest block per chain in the useTokenRecordsQueries hook.
     */
    const newDateTokenSummary = getDateTokenSummary(filteredRecords, false);
    setByDateTokenSummary(newDateTokenSummary);
  }, [isLiquidBackingActive, tokenRecordResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.debug(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateTokenSummary([]);
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Cache the tokens for the current value of selectedIndex.
   */
  const [headerSubtext, setHeaderSubtext] = useState("");
  useMemo(() => {
    console.debug(`${chartName}: rebuilding current tokens`);
    const currentTokenSummary = byDateTokenSummary[selectedIndex];
    setCurrentTokens(currentTokenSummary ? Object.values(currentTokenSummary.tokens) : []);

    // Set the subtext to be the current date (otherwise the changing table data can be a bit too subtle)
    setHeaderSubtext(currentTokenSummary ? currentTokenSummary.date : "");
  }, [byDateTokenSummary, selectedIndex]);

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: `Asset`,
      description: `The token asset that is held`,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => renameToken(params.row.token),
    },
    {
      field: "category",
      headerName: `Category`,
      description: `The category of the token asset`,
      flex: 0.5,
    },
    {
      field: "blockchain",
      headerName: `Blockchain`,
      description: `The blockchain of the token asset`,
      flex: 0.5,
    },
    {
      field: "isLiquid",
      headerName: `Liquid`,
      description: `Whether the token asset is liquid`,
      flex: 0.5,
      valueGetter: (params: GridValueGetterParams) => (params.row.isLiquid ? "Yes" : "No"),
    },
    {
      field: "balance",
      headerName: `Balance`,
      description: `The total balance of the token asset`,
      flex: 0.5,
      type: "string",
      sortComparator: (v1, v2) => {
        // Get rid of all non-number characters
        const stripCurrency = (currencyString: string) => currencyString.replaceAll(/[$,]/g, "");

        return parseFloat(stripCurrency(v1)) - parseFloat(stripCurrency(v2));
      },
      valueGetter: (params: GridValueGetterParams) => formatNumber(parseFloat(params.row.balance)),
    },
    {
      field: "value",
      headerName: `Value`,
      description: `The total value of the token asset in USD`,
      flex: 0.5,
      type: "string",
      sortComparator: (v1, v2) => {
        // Get rid of all non-number characters
        const stripCurrency = (currencyString: string) => currencyString.replaceAll(/[$,]/g, "");

        return parseFloat(stripCurrency(v1)) - parseFloat(stripCurrency(v2));
      },
      valueGetter: (params: GridValueGetterParams) =>
        formatCurrency(parseFloat(isLiquidBackingActive ? params.row.valueExcludingOhm : params.row.value)),
      minWidth: 120,
    },
  ];

  const headerText = `Holdings`;

  return (
    <ChartCard
      headerText={headerText}
      headerSubtext={headerSubtext}
      headerTooltip={
        isLiquidBackingActive
          ? `This table lists the details of the treasury assets that make up the liquid backing`
          : `This table lists the details of the treasury assets that make up the market value`
      }
      subgraphQueryUrl={queryExplorerUrl}
      isLoading={false}
    >
      <DataGrid
        autoHeight
        loading={currentTokens.length == 0}
        disableSelectionOnClick
        rows={currentTokens}
        rowHeight={30}
        columns={columns}
        rowsPerPageOptions={[10]}
        pageSize={10}
        getRowId={row => row.id}
        // Sort by value descending
        initialState={{
          sorting: {
            sortModel: [{ field: "value", sort: "desc" }],
          },
          columns: {
            // Hide these columns by default
            columnVisibilityModel: {
              isLiquid: false,
              balance: false,
            },
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
          // Disables outline on clicked header cells
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </ChartCard>
  );
};
