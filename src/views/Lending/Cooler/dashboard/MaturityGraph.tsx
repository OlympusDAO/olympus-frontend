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
import { PrincipalMaturingInUnder } from "src/views/Lending/Cooler/dashboard/Metrics";
import { useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

const EXPIRY_BUCKET_30 = 30;
const EXPIRY_BUCKET_121 = 121;

export const MaturityGraph = () => {
  const theme = useTheme();

  // For the maturity chart, we want to show the data for 121 days from now
  const startDate = new Date();
  const beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() + 121);

  const { data } = useCoolerSnapshot(startDate, beforeDate);

  const [coolerSnapshots, setCoolerSnapshots] = useState<Snapshot[] | undefined>();
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    // Cache. Already sorted in descending order.
    setCoolerSnapshots(data);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = [
    "expiryBuckets.expired",
    "expiryBuckets.days30",
    "expiryBuckets.days121",
    "expiryBuckets.active",
  ];
  const itemNames: string[] = ["Expired", "< 30 Days", "< 121 Days", ">= 121 Days"];

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
          Projected Maturity
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm>
          <PrincipalMaturingInUnder days={EXPIRY_BUCKET_30} previousBucket={0} />
        </Grid>
        <Grid item xs={12} sm>
          <PrincipalMaturingInUnder days={EXPIRY_BUCKET_121} previousBucket={EXPIRY_BUCKET_30} />
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
          tickStyle={tickStyle}
          itemDecimals={0}
          margin={{ left: 30 }}
          displayTooltipTotal={true}
        />
      </Grid>
    </Grid>
  );
};
