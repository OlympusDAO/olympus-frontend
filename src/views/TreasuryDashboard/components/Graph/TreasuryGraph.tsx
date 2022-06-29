import { t } from "@lingui/macro";
import { useTheme } from "@mui/material/styles";
import Chart from "src/components/Chart/Chart";
import { formatCurrency } from "src/helpers";
import { ProtocolMetricsNumbers, useLiquidBackingPerOhm } from "src/hooks/useProtocolMetrics";

import { bulletpoints, itemType, tooltipInfoMessages } from "../../treasuryData";

/**
 * React Component that displays a line graph comparing the
 * OHM price and liquid backing per floating OHM.
 *
 * @returns
 */
export const LiquidBackingPerOhmComparisonGraph = () => {
  const theme = useTheme();
  const hook = useLiquidBackingPerOhm();
  const data = hook.data as ProtocolMetricsNumbers[];
  // These colours are temporary
  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);
  const itemNames = [t`OHM Price`, t`Liquid Backing per Floating OHM`];

  return (
    <Chart
      type="multi"
      data={data}
      dataKey={["ohmPrice", "treasuryLiquidBackingPerOhmFloating"]}
      itemType={itemType.dollar}
      color={theme.palette.text.primary}
      stroke={colors}
      stopColor={[[]]}
      headerText={t`OHM Backing`}
      headerSubText={`${data && formatCurrency(data[0].treasuryLiquidBackingPerOhmFloating, 2)}`}
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
