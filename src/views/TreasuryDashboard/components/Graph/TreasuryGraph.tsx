import { t } from "@lingui/macro";
import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Chart from "src/components/Chart/Chart";
import { getSubgraphUrl } from "src/constants";
import { useKeyMetricsQuery, useMarketValueMetricsQuery } from "src/generated/graphql";
import { formatCurrency } from "src/helpers";

import { bulletpoints, itemType, tooltipInfoMessages, tooltipItems } from "../../treasuryData";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = () => {
  const theme = useTheme();
  const { data } = useKeyMetricsQuery({ endpoint: getSubgraphUrl() });

  // These colours are temporary
  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);
  const itemNames = [t`OHM Price`, t`Liquid Backing per Floating OHM`];

  // TODO adjust typing to handle loading data
  if (!data) return <Skeleton />;

  return (
    <Chart
      type="multi"
      data={data.protocolMetrics}
      dataKey={["ohmPrice", "treasuryLiquidBackingPerOhmFloating"]}
      itemType={itemType.dollar}
      color={theme.palette.text.primary}
      stroke={colors}
      stopColor={[[]]}
      headerText={t`OHM Backing`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryLiquidBackingPerOhmFloating, 2)}`}
      dataFormat=""
      bulletpointColors={runwayBulletpoints}
      itemNames={itemNames}
      margin={{ left: 30 }}
      infoTooltipMessage={tooltipInfoMessages().backingPerOhm}
      expandedGraphStrokeColor={theme.palette.primary.contrastText}
      isPOL={false}
      isStaked={false}
      itemDecimals={2}
    />
  );
};

export const MarketValueGraph = () => {
  const theme = useTheme();
  const { data } = useMarketValueMetricsQuery({ endpoint: getSubgraphUrl() });

  // TODO adjust typing to handle loading data
  if (!data) return <Skeleton />;

  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);

  return (
    <Chart
      type="stack"
      data={data.protocolMetrics}
      dataKey={["treasuryStableValue", "treasuryVolatileValue", "treasuryLPValue"]}
      color={theme.palette.text.primary}
      stopColor={[
        ["#F5AC37", "#F5AC37"],
        ["#768299", "#768299"],
        ["#DC30EB", "#DC30EB"],
        ["#8BFF4D", "#8BFF4D"],
        ["#ff758f", "#ff758f"],
        ["#4E1F71", "#4E1F71"],
        ["#8AECCD", "#8AECCD"],
      ]}
      stroke={colors}
      dataFormat=""
      headerText={t`Market Value of Treasury Assets`}
      headerSubText={`${data && formatCurrency(data.protocolMetrics[0].treasuryMarketValue)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.marketValueComponents}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages().mvt}
      expandedGraphStrokeColor={theme.palette.primary.contrastText}
      isPOL={false}
      isStaked={false}
      itemDecimals={0}
    />
  );
};
