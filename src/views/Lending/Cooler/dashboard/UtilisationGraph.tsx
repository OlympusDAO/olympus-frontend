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
import { OutstandingPrincipal, TotalCapacityRemaining } from "src/views/Lending/Cooler/dashboard/Metrics";
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
  const itemNames: string[] = ["Amount Borrowed", "Interest Due"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);
  const tickStyle = getTickStyle(theme);
  tickStyle.stroke = "#8A8B90";
  tickStyle.fill = "#8A8B90";

  return (
    <Grid container>
      <Grid item xs={12} paddingBottom={1}>
        <Typography variant="h6" color="rgb(238, 233, 226)" display="inline">
          Utilisation
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm>
          <OutstandingPrincipal />
        </Grid>
        <Grid item xs={12} sm>
          <TotalCapacityRemaining />
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
          tickStyle={tickStyle}
          itemDecimals={0}
          margin={{ left: 30 }}
        />
      </Grid>
    </Grid>
  );
};
