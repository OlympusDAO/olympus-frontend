import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GOHM_TOKEN } from "src/constants/tokens";
import { formatNumber } from "src/helpers";
import { TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY } from "src/helpers/subgraph/Constants";
import { TokenSupply, useMetricsQuery } from "src/hooks/useFederatedSubgraphQuery";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";
import { AssetsTableProps, GraphProps } from "src/views/TreasuryDashboard/components/Graph/Constants";

enum SupplyMetric {
  TotalSupply = "Total Supply",
  CirculatingSupply = "Circulating Supply",
  FloatingSupply = "Floating Supply",
  BackedSupply = "Backed Supply",
}

type OhmSupplyMetricMap = {
  currentIndex: number;
  metrics: {
    [category: string]: {
      metric: number;
      records: TokenSupply[];
    };
  };
};

type OhmSupplyDateMap = {
  [date: string]: OhmSupplyMetricMap;
};

export const OhmSupplyTable = ({ earliestDate, selectedIndex, subgraphDaysOffset }: GraphProps & AssetsTableProps) => {
  const theme = useTheme();
  const isBreakpointSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const columnHeaderColor = theme.palette.text.primary;

  const chartName = "OhmSupplyTable";

  const { data: metricResults } = useMetricsQuery({ startDate: earliestDate, includeContentRecords: true });

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateCategoryTokenSupplyMap, setByDateCategoryTokenSupplyMap] = useState<OhmSupplyDateMap>({});
  const [selectedDaySupplyMap, setSelectedDaySupplyMap] = useState<OhmSupplyMetricMap>();
  useMemo(() => {
    if (!metricResults) {
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date token summary`);

    const removeElementsFromArray = (array: TokenSupply[], elements: string[]): TokenSupply[] => {
      return array.filter(item => !elements.includes(item.id));
    };

    const addToProcessedRecords = (array: TokenSupply[], elements: string[]): void => {
      array.forEach(item => elements.push(item.id));
    };

    /**
     * Sorts the array elements by type, blockchain, location, then pool.
     *
     * @param array
     * @returns sorted array
     */
    const sortElements = (array: TokenSupply[]): TokenSupply[] => {
      return array.sort(
        (a, b) =>
          a.type.localeCompare(b.type) ||
          (a.blockchain || "").localeCompare(b.blockchain || "") ||
          (a.source || "").localeCompare(b.source || "") ||
          (a.pool || "").localeCompare(b.pool || ""),
      );
    };

    const flatten = (chainSupplies: Record<string, TokenSupply[]> | undefined): TokenSupply[] => {
      if (!chainSupplies) return [];

      return Object.values(chainSupplies).reduce((acc, val) => acc.concat(val), []);
    };

    // Group by date by category
    const tempDateCategoryTokenSupplyMap: OhmSupplyDateMap = {};
    for (const currentMetric of metricResults) {
      const dateLatestIndex: number = currentMetric.ohmIndex;

      const categoryTokenSupplyMap: OhmSupplyMetricMap = {
        currentIndex: dateLatestIndex,
        metrics: {},
      };
      const processedRecords: string[] = [];

      /**
       * For each metric:
       * - Get the metric value and records
       * - Assign the metric value
       * - Assign the array of records incremental to the metric
       */

      const totalSupply: number = currentMetric.ohmTotalSupply;
      const totalSupplyRecords: TokenSupply[] = flatten(currentMetric.ohmTotalSupplyRecords);

      categoryTokenSupplyMap.metrics[SupplyMetric.TotalSupply] = {
        metric: totalSupply,
        records: sortElements(removeElementsFromArray(totalSupplyRecords, processedRecords)),
      };
      addToProcessedRecords(totalSupplyRecords, processedRecords);

      const circulatingSupply: number = currentMetric.ohmCirculatingSupply;
      const circulatingSupplyRecords: TokenSupply[] = flatten(currentMetric.ohmCirculatingSupplyRecords);
      categoryTokenSupplyMap.metrics[SupplyMetric.CirculatingSupply] = {
        metric: circulatingSupply,
        records: sortElements(removeElementsFromArray(circulatingSupplyRecords, processedRecords)),
      };
      addToProcessedRecords(circulatingSupplyRecords, processedRecords);

      const floatingSupply: number = currentMetric.ohmFloatingSupply;
      const floatingSupplyRecords: TokenSupply[] = flatten(currentMetric.ohmFloatingSupplyRecords);
      categoryTokenSupplyMap.metrics[SupplyMetric.FloatingSupply] = {
        metric: floatingSupply,
        records: sortElements(removeElementsFromArray(floatingSupplyRecords, processedRecords)),
      };
      addToProcessedRecords(floatingSupplyRecords, processedRecords);

      const backedSupply: number = currentMetric.ohmBackedSupply;
      const backedSupplyRecords: TokenSupply[] = flatten(currentMetric.ohmBackedSupplyRecords);
      categoryTokenSupplyMap.metrics[SupplyMetric.BackedSupply] = {
        metric: backedSupply,
        records: sortElements(removeElementsFromArray(backedSupplyRecords, processedRecords)),
      };
      addToProcessedRecords(backedSupplyRecords, processedRecords);

      tempDateCategoryTokenSupplyMap[currentMetric.date] = categoryTokenSupplyMap;
    }

    setByDateCategoryTokenSupplyMap(tempDateCategoryTokenSupplyMap);
  }, [metricResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.debug(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateCategoryTokenSupplyMap({});
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Cache the tokens for the current value of selectedIndex.
   */
  const [headerSubtext, setHeaderSubtext] = useState("");
  useMemo(() => {
    console.debug(`${chartName}: rebuilding current tokens`);
    const selectedDate = Object.keys(byDateCategoryTokenSupplyMap)[selectedIndex];
    const tempSelectedDayRecords = byDateCategoryTokenSupplyMap[selectedDate] || {};

    setSelectedDaySupplyMap(tempSelectedDayRecords);

    // Set the subtext to be the current date (otherwise the changing table data can be a bit too subtle)
    setHeaderSubtext(selectedDate);
  }, [byDateCategoryTokenSupplyMap, selectedIndex]);

  const headerText = "Breakdown";
  const gOhmAddresses: string[] = Object.values(GOHM_TOKEN.addresses).map(address => address.toLowerCase());
  const totalColumnSpan = isBreakpointSmall ? 3 : 4;
  const styleOverflowEllipsis: React.CSSProperties = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "1px",
  };

  return (
    <ChartCard
      headerText={headerText}
      headerSubtext={headerSubtext}
      headerTooltip={`This table lists the details of how OHM supply is calculated`}
      isLoading={Object.keys(byDateCategoryTokenSupplyMap).length == 0}
    >
      <TableContainer>
        <Table
          sx={{
            "& .MuiTableCell-head": {
              fontSize: "16px",
              color: columnHeaderColor,
            },
            "& .MuiTableCell-body": {
              fontSize: "14px",
              height: "30px",
              paddingTop: "0px",
              paddingBottom: "0px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              {isBreakpointSmall ? <></> : <TableCell>Chain</TableCell>}
              <TableCell>Location</TableCell>
              <TableCell>Market / Pool</TableCell>
              <TableCell># OHM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // Iterate over all metrics, in order
              selectedDaySupplyMap &&
                selectedDaySupplyMap.metrics &&
                Object.keys(selectedDaySupplyMap.metrics).map(metricName => {
                  const currentIndex = selectedDaySupplyMap.currentIndex;
                  const metric = selectedDaySupplyMap.metrics[metricName];

                  return (
                    <Fragment key={metricName}>
                      {
                        // One row per record
                        metric.records.map(record => {
                          const isGOhm = gOhmAddresses.includes(record.tokenAddress.toLowerCase());
                          const ohmValue: number = (isGOhm ? currentIndex : 1) * +record.supplyBalance;

                          return (
                            <TableRow key={record.id}>
                              <TableCell style={{ width: "15%" }}>
                                {record.type == TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY ? "Supply" : record.type}
                              </TableCell>
                              {isBreakpointSmall ? (
                                <></>
                              ) : (
                                <TableCell style={{ width: "15%" }}>{record.blockchain}</TableCell>
                              )}
                              <TableCell
                                style={{
                                  width: "20%",
                                  ...styleOverflowEllipsis,
                                }}
                              >
                                {record.source}
                              </TableCell>
                              <TableCell
                                style={{
                                  width: "20%",
                                  ...styleOverflowEllipsis,
                                }}
                              >
                                {record.pool}
                              </TableCell>
                              <TableCell style={{ width: "15%" }} align="right">
                                {formatNumber(ohmValue, 0)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                      {/* Display total */}
                      <TableRow>
                        <TableCell colSpan={totalColumnSpan} align="left">
                          <strong>{metricName}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{formatNumber(metric.metric, 0)}</strong>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </ChartCard>
  );
};
