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
  OutstandingPrincipal,
  TreasuryCapacityRemaining,
  WeeklyCapacityRemaining,
} from "src/views/Lending/Cooler/dashboard/Metrics";
import {
  getClearinghouseCapacity,
  getReceivables,
  useCoolerSnapshot,
} from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

type CoolerSnapshotWithTotals = Snapshot & {
  capacity: number;
  receivables: number;
};

export const UtilisationGraph = ({ startDate }: { startDate?: Date }) => {
  const theme = useTheme();

  const { data } = useCoolerSnapshot(startDate);

  // Add calculated data
  const [coolerSnapshots, setCoolerSnapshots] = useState<CoolerSnapshotWithTotals[] | undefined>(undefined);
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    const _coolerSnapshotsWithTotals = data.map(snapshot => {
      const capacity = getClearinghouseCapacity(snapshot);
      const receivables = getReceivables(snapshot);

      return {
        ...snapshot,
        capacity,
        receivables,
      };
    });

    // Sort in descending order
    _coolerSnapshotsWithTotals.sort((a, b) => b.timestamp - a.timestamp);

    setCoolerSnapshots(_coolerSnapshotsWithTotals);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = ["receivables", "capacity"];
  const itemNames: string[] = ["Receivables", "Capacity Remaining"];

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
        <Grid item xs={4}>
          <OutstandingPrincipal />
        </Grid>
        <Grid item xs={4}>
          <WeeklyCapacityRemaining />
        </Grid>
        <Grid item xs={4}>
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
