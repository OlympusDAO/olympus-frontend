import { t } from "@lingui/macro";
import { CSSProperties } from "react";
import Chart, { DataFormat } from "src/components/Chart/Chart";
import { getSubgraphUrl } from "src/constants";
import {
  KeyMetricsDocument,
  MarketValueMetricsDocument,
  ProtocolOwnedLiquidityComponentsDocument,
  ProtocolOwnedLiquidityComponentsQuery,
  useKeyMetricsQuery,
  useMarketValueMetricsQuery,
  useProtocolOwnedLiquidityComponentsQuery,
} from "src/generated/graphql";
import { formatCurrency } from "src/helpers";

import { itemType, tooltipInfoMessages, tooltipItems } from "../../treasuryData";

// These constants are used by charts to have consistent colours
const defaultColors: string[] = ["#FFBF00", "#FF7F50", "#DE3163", "#9FE2BF", "#40E0D0", "#6495ED", "#CCCCFF"];
const defaultBulletpointColours: CSSProperties[] = defaultColors.map(value => {
  return {
    background: value,
  };
});

const getSubgraphQueryExplorerUrl = (queryDocument: string): string => {
  return `${getSubgraphUrl()}/graphql?query=${encodeURIComponent(queryDocument)}`;
};

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = () => {
  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() });
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

export const MarketValueGraph = () => {
  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() });
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

const getUniqueTokens = (metrics: ProtocolOwnedLiquidityComponentsQuery | undefined): string[] => {
  const tokenNames = new Set<string>();

  if (metrics) {
    metrics.protocolMetrics.forEach(metric => {
      metric.treasuryLPValueComponents.records.forEach(record => {
        if (!tokenNames.has(record.token)) tokenNames.add(record.token);
      });
    });
  }

  return Array.from(tokenNames);
};

type TokenValues = {
  [token: string]: number;
};

type FlatProtocolOwnedLiquidity = {
  timestamp: string;
  tokens: TokenValues;
};

/**
 * Flattens the component values in `treasuryLPValueComponents`.
 *
 * The data structure is as follows:
 * ```
 * metrics.protocolMetrics {
 *  timestamp
 *  treasuryLPValueComponents {
 *    records {
 *      token
 *      value
 *    }
 *  }
 * }
 * ```
 *
 * This is difficult for the charting library to handle, so the values are
 * summed and grouped under each token, as defined in {FlatProtocolOwnedLiquidity}.
 *
 * @param metrics The query result
 * @returns array of FlatProtocolOwnedLiquidity elements
 */
const getFlattenedData = (metrics: ProtocolOwnedLiquidityComponentsQuery | undefined): FlatProtocolOwnedLiquidity[] => {
  const flattenedData: FlatProtocolOwnedLiquidity[] = [];
  if (!metrics) return flattenedData;

  metrics.protocolMetrics.forEach(metric => {
    const tokenValues: TokenValues = {};

    // TODO extract this into a generalisable function, since we have many *components properties
    metric.treasuryLPValueComponents.records.forEach(record => {
      const currentValue: number = tokenValues[record.token];
      const recordValue: number = typeof record.value === "number" ? record.value : parseFloat(record.value);
      const newValue: number = currentValue ? currentValue + recordValue : recordValue;

      tokenValues[record.token] = newValue;
    });

    const flatData: FlatProtocolOwnedLiquidity = {
      timestamp: metric.timestamp,
      tokens: tokenValues,
    };
    flattenedData.push(flatData);
  });

  return flattenedData;
};

export const ProtocolOwnedLiquidityGraph = () => {
  const { data } = useProtocolOwnedLiquidityComponentsQuery({ endpoint: getSubgraphUrl() });
  const queryExplorerUrl = getSubgraphQueryExplorerUrl(ProtocolOwnedLiquidityComponentsDocument);

  // Extract out unique categories
  const tokenCategories = getUniqueTokens(data);
  // Data keys require a prefix
  const tokenDataKeys = tokenCategories.map(value => "tokens." + value);

  // Flatten the token values
  const flatData = getFlattenedData(data);

  return (
    <Chart
      type="stack"
      data={flatData}
      dataKey={tokenDataKeys}
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
