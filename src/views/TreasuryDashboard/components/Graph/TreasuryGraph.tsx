import { t } from "@lingui/macro";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { CSSProperties } from "react";
import Chart, { DataFormat } from "src/components/Chart/Chart";
import { getSubgraphUrl } from "src/constants";
import {
  KeyMetricsDocument,
  MarketValueMetricsDocument,
  ProtocolOwnedLiquidityComponentsDocument,
  useKeyMetricsQuery,
  useMarketValueMetricsQuery,
  useProtocolOwnedLiquidityComponentsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";
import { getDataKeysFromTokens, getKeysTokenSummary, getTokensFromKey } from "src/helpers/ProtocolMetricsHelper";

import { itemType, tooltipInfoMessages, tooltipItems } from "../../treasuryData";

// These constants are used by charts to have consistent colours
const defaultColors: string[] = ["#FFBF00", "#FF7F50", "#DE3163", "#9FE2BF", "#40E0D0", "#6495ED", "#CCCCFF"];
const defaultBulletpointColours: CSSProperties[] = defaultColors.map(value => {
  return {
    background: value,
  };
});
export const defaultRecordsCount = 90;

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
  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(KeyMetricsDocument);

  const itemNames = [t`OHM Price`, t`Liquid Backing per Floating OHM`];

  return (
    <Chart
      type="composed"
      data={data ? data.protocolMetrics : []}
      dataKey={["ohmPrice", "treasuryLiquidBackingPerOhmFloating"]}
      itemType={itemType.dollar}
      color={""}
      stopColor={[[]]}
      stroke={defaultColors}
      headerText={t`OHM Backing`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating, 2)}`}
      dataFormat={DataFormat.Currency}
      bulletpointColors={defaultBulletpointColours}
      itemNames={itemNames}
      margin={{ left: 30 }}
      infoTooltipMessage={tooltipInfoMessages().backingPerOhm}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isStaked={false}
      itemDecimals={2}
      subgraphQueryUrl={queryExplorerUrl}
    />
  );
};

export const MarketValueGraph = ({ count = defaultRecordsCount }: GraphProps) => {
  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(MarketValueMetricsDocument);

  return (
    <Chart
      type="stack"
      data={data ? data.protocolMetrics : []}
      dataKey={["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue"]}
      color={""}
      stopColor={[[]]}
      stroke={defaultColors}
      dataFormat={DataFormat.Currency}
      headerText={t`Market Value of Treasury Assets`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryMarketValue)}`}
      bulletpointColors={defaultBulletpointColours}
      itemNames={tooltipItems.marketValueComponents}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().mvt}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isStaked={false}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = ({ count = defaultRecordsCount }: GraphProps) => {
  const { data } = useProtocolOwnedLiquidityComponentsQuery({ endpoint: getSubgraphUrl() }, { records: count });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolOwnedLiquidityComponentsDocument);

  const tokenSummary = getKeysTokenSummary(
    data?.protocolMetrics,
    ["treasuryLPValueComponents"],
    ["Protocol-Owned Liquidity"],
  );

  const tokenCategories = getTokensFromKey(tokenSummary, "treasuryLPValueComponents");
  const dataKeys = getDataKeysFromTokens(tokenCategories, "treasuryLPValueComponents");

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
      bulletpointColors={defaultBulletpointColours}
      itemNames={tokenCategories}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().mvt}
      expandedGraphStrokeColor={""}
      isPOL={false}
      isStaked={false}
      itemDecimals={0}
      subgraphQueryUrl={queryExplorerUrl}
    />
  );
};

export const AssetsTable = () => {
  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() });
  // TODO look at caching
  const rows = [{ token: "foo", value: "1000.01", category: "Stablecoins", blockchain: "Ethereum" }];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Blockchain</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.token}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.blockchain}</TableCell>
              <TableCell>{formatCurrency(parseFloat(row.value))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
