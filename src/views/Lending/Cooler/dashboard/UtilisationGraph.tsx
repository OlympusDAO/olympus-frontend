import { Grid, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { Snapshot } from "src/generated/coolerLoans";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import {
  CollateralDeposited,
  OutstandingPrincipal,
  TreasuryCapacityRemaining,
} from "src/views/Lending/Cooler/dashboard/Metrics";
import { useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

export const UtilisationGraph = ({ startDate }: { startDate?: Date }) => {
  const theme = useTheme();

  const { data } = useCoolerSnapshot(startDate);

  // Add calculated data
  const [coolerSnapshots, setCoolerSnapshots] = useState<Snapshot[] | undefined>(undefined);
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    const _coolerSnapshotsWithTotals = data.slice();

    // Sort in descending order
    _coolerSnapshotsWithTotals.sort((a, b) => b.timestamp - a.timestamp);

    setCoolerSnapshots(_coolerSnapshotsWithTotals);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = ["principalReceivables", "interestReceivables"];
  const itemNames: string[] = ["Principal Receivables", "Interest Receivables"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" display="inline">
          Utilisation
        </Typography>
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs>
          <OutstandingPrincipal />
        </Grid>
        <Grid item xs>
          <CollateralDeposited />
        </Grid>
        <Grid item xs>
          <TreasuryCapacityRemaining />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Chart
          type={ChartType.MultiLine}
          data={coolerSnapshots || []}
          dataFormat={DataFormat.Currency}
          headerText=""
          headerSubText={""}
          dataKeys={dataKeys}
          dataKeyColors={colorsMap}
          dataKeyBulletpointStyles={bulletpointStyles}
          dataKeyLabels={dataKeyLabels}
          infoTooltipMessage={""}
          isLoading={!coolerSnapshots}
          tickStyle={getTickStyle(theme)}
          itemDecimals={0}
          margin={{ left: 30 }}
        />
      </Grid>
    </Grid>
  );
};
