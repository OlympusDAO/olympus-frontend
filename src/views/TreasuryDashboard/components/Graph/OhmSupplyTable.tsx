import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { GOHM_TOKEN } from "src/constants/tokens";
import { formatNumber } from "src/helpers";
import { TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY } from "src/helpers/subgraph/Constants";
import {
  getOhmBackedSupply,
  getOhmCirculatingSupply,
  getOhmFloatingSupply,
  getOhmTotalSupply,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { TokenSupply, useProtocolMetricsQuery, useTokenSuppliesQuery } from "src/hooks/useFederatedSubgraphQuery";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";
import { AssetsTableProps, GraphProps } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getDateProtocolMetricMap } from "src/views/TreasuryDashboard/components/Graph/helpers/ProtocolMetricsQueryHelper";
import { getDateTokenSupplyMap } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenSupplyQueryHelper";

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
  const chartName = "OhmSupplyTable";

  const { data: tokenSupplyResults } = useTokenSuppliesQuery(earliestDate);
  const { data: protocolMetricResults } = useProtocolMetricsQuery(earliestDate);

  /**
   * Chart population:
   *
   * When data loading is finished, the token records are processed into a compatible structure.
   */
  const [byDateCategoryTokenSupplyMap, setByDateCategoryTokenSupplyMap] = useState<OhmSupplyDateMap>({});
  const [selectedDaySupplyMap, setSelectedDaySupplyMap] = useState<OhmSupplyMetricMap>();
  useMemo(() => {
    if (!tokenSupplyResults || !protocolMetricResults) {
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date token summary`);

    // Group by date
    const tempDateTokenSupplyMap = getDateTokenSupplyMap(tokenSupplyResults);
    const tempDateProtocolMetricMap = getDateProtocolMetricMap(protocolMetricResults);

    const removeElementsFromArray = (array: TokenSupply[], elements: TokenSupply[]): TokenSupply[] => {
      return array.filter(item => !elements.includes(item));
    };

    // Group by date by category
    const tempDateCategoryTokenSupplyMap: OhmSupplyDateMap = {};
    for (const [date, tokenSupplyRecords] of tempDateTokenSupplyMap) {
      const dateProtocolMetrics = tempDateProtocolMetricMap.get(date);
      if (!dateProtocolMetrics || !dateProtocolMetrics.length) {
        continue;
      }
      const dateLatestIndex: number = +dateProtocolMetrics[0].currentIndex;

      const categoryTokenSupplyMap: OhmSupplyMetricMap = {
        currentIndex: dateLatestIndex,
        metrics: {},
      };
      const processedRecords: TokenSupply[] = [];

      /**
       * For each metric:
       * - Get the metric value and records
       * - Assign the metric value
       * - Assign the array of records incremental to the metric
       */

      const [totalSupply, totalSupplyRecords] = getOhmTotalSupply(tokenSupplyRecords, dateLatestIndex);
      categoryTokenSupplyMap.metrics[SupplyMetric.TotalSupply] = {
        metric: totalSupply,
        records: removeElementsFromArray(totalSupplyRecords, processedRecords),
      };
      processedRecords.push(...totalSupplyRecords);

      const [circulatingSupply, circulatingSupplyRecords] = getOhmCirculatingSupply(
        tokenSupplyRecords,
        dateLatestIndex,
      );
      categoryTokenSupplyMap.metrics[SupplyMetric.CirculatingSupply] = {
        metric: circulatingSupply,
        records: removeElementsFromArray(circulatingSupplyRecords, processedRecords),
      };
      processedRecords.push(...circulatingSupplyRecords);

      const [floatingSupply, floatingSupplyRecords] = getOhmFloatingSupply(tokenSupplyRecords, dateLatestIndex);
      categoryTokenSupplyMap.metrics[SupplyMetric.FloatingSupply] = {
        metric: floatingSupply,
        records: removeElementsFromArray(floatingSupplyRecords, processedRecords),
      };
      processedRecords.push(...floatingSupplyRecords);

      const [backedSupply, backedSupplyRecords] = getOhmBackedSupply(tokenSupplyRecords, dateLatestIndex);
      categoryTokenSupplyMap.metrics[SupplyMetric.BackedSupply] = {
        metric: backedSupply,
        records: removeElementsFromArray(backedSupplyRecords, processedRecords),
      };
      processedRecords.push(...backedSupplyRecords);

      tempDateCategoryTokenSupplyMap[date] = categoryTokenSupplyMap;
    }

    setByDateCategoryTokenSupplyMap(tempDateCategoryTokenSupplyMap);
  }, [tokenSupplyResults, protocolMetricResults]);

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

  return (
    <ChartCard
      headerText={headerText}
      headerSubtext={headerSubtext}
      headerTooltip={`This table lists the details of how OHM supply is calculated`}
      isLoading={Object.keys(byDateCategoryTokenSupplyMap).length == 0}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Chain</TableCell>
            <TableCell>Location</TableCell>
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
                  <>
                    {
                      // One row per record
                      metric.records.map(record => {
                        const isGOhm = gOhmAddresses.includes(record.tokenAddress.toLowerCase());
                        const ohmValue: number = (isGOhm ? currentIndex : 1) * +record.supplyBalance;

                        return (
                          <TableRow key={record.id}>
                            <TableCell>
                              {record.type == TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY ? "Supply" : record.type}
                            </TableCell>
                            <TableCell>{record.blockchain}</TableCell>
                            <TableCell>{record.source}</TableCell>
                            <TableCell align="right">{formatNumber(ohmValue, 0)}</TableCell>
                          </TableRow>
                        );
                      })
                    }
                    {/* Display total */}
                    <TableRow key={metricName}>
                      <TableCell colSpan={3} align="left">
                        <strong>{metricName}</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatNumber(metric.metric, 0)}</strong>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
          }
        </TableBody>
      </Table>
    </ChartCard>
  );
};
