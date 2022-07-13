import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import Chart from "src/components/Chart/Chart";
import { formatCurrency, trim } from "src/helpers";
import { useProtocolMetrics } from "src/hooks/useProtocolMetrics";

import { bulletpoints, itemType, tooltipInfoMessages, tooltipItems } from "../../treasuryData";

export const Graph = ({ children }) => <>{children}</>;

/**
 * @deprecated
 */
export const TotalValueDepositedGraph = () => {
  const theme = useTheme();
  const { data } = useProtocolMetrics();

  return (
    <Chart
      type="area"
      data={data}
      itemType={itemType.dollar}
      categories={tooltipItems.tvl}
      dataKey={["totalValueLocked"]}
      headerText={t`Total Value Deposited`}
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages().tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
    />
  );
};

/**
 * @deprecated
 */
export const LiquidBackingGraph = () => {
  const theme = useTheme();
  const { data } = useProtocolMetrics();

  return (
    <Chart
      type="area"
      data={data}
      itemType={itemType.dollar}
      categories={tooltipItems.liqb}
      dataKey={["treasuryLiquidBacking"]}
      headerText={t`Liquid Treasury`}
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages().liqb}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].treasuryLiquidBacking)}`}
    />
  );
};

/**
 * @deprecated
 */
export const RiskFreeValueGraph = () => {
  const theme = useTheme();
  const { data } = useProtocolMetrics();

  return (
    <Chart
      type="stack"
      data={data}
      format="currency"
      dataKey={[
        "treasuryDaiRiskFreeValue",
        "treasuryFraxRiskFreeValue",
        "treasuryLusdRiskFreeValue",
        "treasuryUstMarketValue",
      ]}
      stopColor={[
        ["#F5AC37", "#F5AC37"],
        ["#768299", "#768299"],
        ["#ff758f", "#ff758f"],
        ["#4E1F71", "#4E1F71"],
        ["#000", "#fff"],
        ["#000", "#fff"],
        ["#000", "#fff"],
      ]}
      headerText={t`Risk Free Value of Treasury Assets`}
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      bulletpointColors={bulletpoints.rfv}
      categories={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

/**
 * @deprecated
 */
export const OHMStakedGraph = () => {
  const theme = useTheme();
  const { data } = useProtocolMetrics();

  const staked =
    data &&
    data
      .map(metric => ({
        staked: (metric.sOhmCirculatingSupply / metric.ohmCirculatingSupply) * 100,
        timestamp: metric.timestamp,
      }))
      .filter(metric => metric.staked < 100);

  return (
    <Chart
      isStaked
      type="area"
      data={staked}
      dataKey={["staked"]}
      dataFormat="percent"
      headerText={t`OHM Staked`}
      stopColor={[["#55EBC7", "#47ACEB"]]}
      margin={{ left: 30 }}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages().staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
    />
  );
};

/**
 * @deprecated
 */
export const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const { data } = useProtocolMetrics();

  const runway = data && data.filter(metric => metric.runway10k > 5);

  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);

  return (
    <Chart
      type="multi"
      data={runway}
      dataKey={["runwayCurrent", "runway7dot5k", "runway5k", "runway2dot5k"]}
      color={theme.palette.text.primary}
      stroke={colors}
      headerText={t`Runway Available`}
      headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
      dataFormat="days"
      bulletpointColors={runwayBulletpoints}
      categories={tooltipItems.runway}
      itemType={""}
      margin={{ left: 30 }}
      infoTooltipMessage={tooltipInfoMessages().runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};
