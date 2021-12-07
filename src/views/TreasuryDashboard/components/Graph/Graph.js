import Chart from "src/components/Chart/Chart.jsx";
import { useTheme } from "@material-ui/core/styles";
import { trim, formatCurrency } from "../../../../helpers";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { useTreasuryRebases } from "../../hooks/useTreasuryRebases";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";

export const Graph = ({ children }) => <>{children}</>;

export const TotalValueDepositedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      type="area"
      data={data}
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      dataKey={["totalValueLocked"]}
      headerText="Total Value Deposited"
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
    />
  );
};

export const MarketValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      type="stack"
      data={data}
      dataKey={[
        "treasuryDaiMarketValue",
        "treasuryFraxMarketValue",
        "treasuryWETHMarketValue",
        "treasuryXsushiMarketValue",
        "treasuryLusdMarketValue",
      ]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#DC30EB", "#EA98F1"],
        ["#8BFF4D", "#4C8C2A"],
        ["#ff758f", "#c9184a"],
      ]}
      headerText="Market Value of Treasury Assets"
      headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.mvt}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const RiskFreeValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      type="stack"
      data={data}
      format="currency"
      dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue", "treasuryLusdRiskFreeValue"]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#ff758f", "#c9184a"],
        ["#000", "#fff"],
        ["#000", "#fff"],
      ]}
      headerText="Risk Free Value of Treasury Assets"
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      bulletpointColors={bulletpoints.rfv}
      itemNames={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      isPOL
      type="area"
      data={data}
      dataFormat="percent"
      itemNames={tooltipItems.pol}
      itemType={itemType.percentage}
      dataKey={["treasuryOhmDaiPOL"]}
      bulletpointColors={bulletpoints.pol}
      infoTooltipMessage={tooltipInfoMessages.pol}
      headerText="Protocol Owned Liquidity OHM-DAI"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
      stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0)"]]}
    />
  );
};

export const OHMStakedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

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
      headerText="OHM Staked"
      stopColor={[["#55EBC7", "#47ACEB"]]}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
    />
  );
};

export const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

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
      headerText="Runway Available"
      headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
      dataFormat="days"
      bulletpointColors={runwayBulletpoints}
      itemNames={tooltipItems.runway}
      itemType={""}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};
