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
import { CumulativeCollateralIncome, CumulativeInterestIncome } from "src/views/Lending/Cooler/dashboard/Metrics";
import { useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

export const IncomeGraph = ({ startDate }: { startDate?: Date }) => {
  const theme = useTheme();

  const { data } = useCoolerSnapshot(startDate);

  const [coolerSnapshots, setCoolerSnapshots] = useState<Snapshot[] | undefined>();
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    // Sort in descending order
    data.sort((a, b) => b.timestamp - a.timestamp);
    setCoolerSnapshots(data);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = ["interestIncome", "collateralIncome"];
  const itemNames: string[] = ["Interest", "Reclaimed Collateral"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" display="inline">
          Protocol Income
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm>
          <CumulativeInterestIncome startDate={startDate} />
        </Grid>
        <Grid item xs={12} sm>
          <CumulativeCollateralIncome startDate={startDate} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Chart
          type={ChartType.Bar}
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
