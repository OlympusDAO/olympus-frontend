import { t } from "@lingui/macro";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TokenRecord_Filter,
  TokenRecordsDocument,
  TokenRecordsQuery,
  TokenRecordsQueryVariables,
  useInfiniteTokenRecordsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { renameToken, TokenRow } from "src/helpers/ProtocolMetricsHelper";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";
import {
  AssetsTableProps,
  DEFAULT_RECORD_COUNT,
  GraphProps,
  LiquidBackingProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import {
  DateTokenSummary,
  getDateTokenSummary,
  getNextPageStartDate,
  getSubgraphQueryExplorerUrl,
} from "src/views/TreasuryDashboard/components/Graph/SubgraphHelper";
import { getNextPageParamFactory } from "src/views/TreasuryDashboard/components/Graph/TokenRecordsQueryHelper";

export const TreasuryAssetsTable = ({
  subgraphUrl,
  earliestDate,
  isLiquidBackingActive,
  selectedIndex,
}: GraphProps & LiquidBackingProps & AssetsTableProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrl);
  const chartName = "TreasuryAssetsTable";

  const initialFinishDate = getISO8601String(adjustDateByDays(new Date(), 1)); // Tomorrow
  const initialStartDate = getNextPageStartDate(initialFinishDate, earliestDate);
  const baseFilter: TokenRecord_Filter = {
    ...(isLiquidBackingActive && { isLiquid: true }), // This will trigger a refresh/refetch of data
  };

  /**
   * Pagination:
   *
   * We create {paginator} within a useEffect block, so that it isn't re-created every re-render.
   */
  const paginator = useRef<(lastPage: TokenRecordsQuery) => TokenRecordsQueryVariables | undefined>();
  useEffect(() => {
    paginator.current = getNextPageParamFactory(chartName, earliestDate, DEFAULT_RECORD_COUNT, baseFilter);
  }, [earliestDate]);

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
      getNextPageParam: paginator.current,
    },
  );

  /**
   * We need to trigger a re-fetch when the earliestDate prop is changed.
   */
  useEffect(() => {
    console.debug(chartName + ": earliestDate changed to " + earliestDate + ". Re-fetching.");
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
      console.log(chartName + ": fetching next page");
      fetchNextPage();
      return;
    }
  }, [data, hasNextPage, fetchNextPage]);

  // State variables used for rendering
  const [byDateTokenSummary, setByDateTokenSummary] = useState<DateTokenSummary[]>([]);
  const [currentTokens, setCurrentTokens] = useState<TokenRow[]>([]);

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  useMemo(() => {
    if (hasNextPage || !data) {
      // While data is loading, ensure dependent data is empty
      setByDateTokenSummary([]);
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    const tokenRecords = data.pages.map(query => query.tokenRecords).flat();
    const newDateTokenSummary = getDateTokenSummary(tokenRecords);
    setByDateTokenSummary(newDateTokenSummary);
  }, [data, hasNextPage]);

  /**
   * Cache the tokens for the current value of selectedIndex.
   */
  useMemo(() => {
    setCurrentTokens(byDateTokenSummary[selectedIndex] ? Object.values(byDateTokenSummary[selectedIndex].tokens) : []);
  }, [byDateTokenSummary, selectedIndex]);

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: t`Asset`,
      description: t`The token asset that is held`,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => renameToken(params.row.token),
    },
    {
      field: "category",
      headerName: t`Category`,
      description: t`The category of the token asset`,
      flex: 1,
    },
    {
      field: "value",
      headerName: t`Value`,
      description: t`The total value of the token asset in USD`,
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
        loading={hasNextPage || false} // hasNextPage will be false or undefined if loading is complete
        disableSelectionOnClick
        rows={currentTokens}
        rowHeight={30}
        columns={columns}
        rowsPerPageOptions={[10]}
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
          // Disables outline on clicked header cells
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </ChartCard>
  );
};
