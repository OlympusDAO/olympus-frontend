import { useTheme } from "@mui/material/styles";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { TokenRecord, TokenRecord_Filter, TokenRecordsDocument } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { CATEGORY_POL } from "src/helpers/subgraph/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
  getDataKeysFromTokens,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useTokenRecordsQueries } from "src/hooks/useSubgraphTokenRecords";
import {
  DEFAULT_BULLETPOINT_COLOURS,
  DEFAULT_COLORS,
  GraphProps,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";
import { getSubgraphQueryExplorerUrl } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";
import {
  DateTokenSummary,
  getDateTokenSummary,
  TokenRow,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

/**
 * Stacked area chart that displays protocol-owned liquidity.
 */
export const ProtocolOwnedLiquidityGraph = ({ subgraphUrls, earliestDate, subgraphDaysOffset }: GraphProps) => {
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(TokenRecordsDocument, subgraphUrls.Ethereum);
  const theme = useTheme();
  const chartName = "ProtocolOwnedLiquidityGraph";
  const [baseFilter] = useState<TokenRecord_Filter>({
    category: CATEGORY_POL,
  });

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
    if (!tokenRecordResults) {
      return;
    }

    // We need to flatten the tokenRecords from all of the pages arrays
    console.debug(`${chartName}: rebuilding by date metrics`);
    const flatRecords = Array.from(tokenRecordResults.values()).flat();
    /**
     * latestOnly is false as the "latest" block is different on each blockchain.
     * They are already filtered by latest block per chain in the useTokenRecordsQueries hook.
     */
    const newDateTokenSummary = getDateTokenSummary(flatRecords, false);
    setByDateTokenSummary(newDateTokenSummary);

    const getTokenId = (record: TokenRecord): string => {
      return `${record.token}/${record.blockchain}`;
    };

    // Sort the source records array, so that anything generated from this doesn't need to be sorted again, and is consistent.
    const sortedRecords = flatRecords.sort((a: TokenRecord, b: TokenRecord) => {
      if (getTokenId(a) < getTokenId(b)) return -1;
      if (getTokenId(a) > getTokenId(b)) return 1;

      return 0;
    });

    const tokenCategories = Array.from(new Set(sortedRecords.map(tokenRecord => tokenRecord.token)));
    // Replicates the format of the keys returned by getDateTokenSummary
    const tokenIds = Array.from(new Set(sortedRecords.map(tokenRecord => getTokenId(tokenRecord))));

    const tempDataKeys = getDataKeysFromTokens(tokenIds);
    setDataKeys(tempDataKeys);

    const tempCategoriesMap = getCategoriesMap(tokenCategories, tempDataKeys);
    setCategoryDataKeyMap(tempCategoriesMap);

    const tempBulletpointStylesMap = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, tempDataKeys);
    setDataKeyBulletpointStylesMap(tempBulletpointStylesMap);

    const tempColorsMap = getDataKeyColorsMap(DEFAULT_COLORS, tempDataKeys);
    setDataKeyColorsMap(tempColorsMap);
  }, [tokenRecordResults]);

  // Handle parameter changes
  useEffect(() => {
    // useSubgraphTokenRecords will handle the re-fetching
    console.info(`${chartName}: earliestDate or subgraphDaysOffset was changed. Removing cached data.`);
    setByDateTokenSummary([]);
  }, [earliestDate, subgraphDaysOffset]);

  /**
   * Set total
   */
  useMemo(() => {
    if (!byDateTokenSummary.length) {
      setTotal("");
      return;
    }

    console.info(`${chartName}: Data loading is done. Re-calculating total.`);

    const tempTotal =
      byDateTokenSummary.length > 0
        ? Object.values(byDateTokenSummary[0].tokens).reduce((previousValue: number, token: TokenRow) => {
            return +previousValue + parseFloat(token.value);
          }, 0)
        : 0;
    setTotal(formatCurrency(tempTotal, 0));
  }, [byDateTokenSummary]);

  return (
    <Chart
      type={ChartType.StackedArea}
      data={byDateTokenSummary}
      dataKeys={dataKeys}
      dataKeyColors={dataKeyColorsMap}
      dataFormat={DataFormat.Currency}
      headerText={`Protocol-Owned Liquidity`}
      headerSubText={total}
      dataKeyBulletpointStyles={dataKeyBulletpointStylesMap}
      dataKeyLabels={categoryDataKeyMap}
      infoTooltipMessage={`Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`}
      isLoading={byDateTokenSummary.length == 0}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
      displayTooltipTotal={true}
      tickStyle={getTickStyle(theme)}
      margin={{ left: -5 }}
    />
  );
};
