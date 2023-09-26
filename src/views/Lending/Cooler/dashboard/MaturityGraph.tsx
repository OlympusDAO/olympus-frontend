import { Grid, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { Snapshot, SnapshotLoansStatus } from "src/generated/coolerLoans";
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

type SnapshotWithExpiryBuckets = Snapshot & {
  /**
   * Values are mutually-exclusive
   */
  expiryBuckets: {
    active: number;
    "30Days": number;
    "121Days": number;
    expired: number;
  };
};

export const MaturityGraph = () => {
  const theme = useTheme();

  // For the maturity chart, we want to show the data for 121 days from now
  const startDate = new Date();
  const beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() + 121);

  const { data } = useCoolerSnapshot(startDate, beforeDate);

  const [coolerSnapshots, setCoolerSnapshots] = useState<SnapshotWithExpiryBuckets[] | undefined>();
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    const _coolerSnapshots = data.map(snapshot => {
      const _snapshot: SnapshotWithExpiryBuckets = {
        ...snapshot,
        expiryBuckets: {
          active: 0,
          "30Days": 0,
          "121Days": 0,
          expired: 0,
        },
      };

      // Iterate over the loans and set the expiry values
      Object.values(_snapshot.loans).forEach(loan => {
        const principalDue = Math.max(loan.principal - loan.principalPaid, 0); // If the loan is somehow overpaid, don't count the overpaid amount

        switch (loan.status) {
          case SnapshotLoansStatus.Expired:
            _snapshot.expiryBuckets.expired += principalDue;
            break;
          case SnapshotLoansStatus.Active:
            const daysToExpiry = loan.secondsToExpiry / 86400;

            if (daysToExpiry < EXPIRY_BUCKET_30) {
              _snapshot.expiryBuckets["30Days"] += principalDue;
            } else if (daysToExpiry < EXPIRY_BUCKET_121) {
              _snapshot.expiryBuckets["121Days"] += principalDue;
            } else {
              _snapshot.expiryBuckets.active += principalDue;
            }
            break;
          default:
            break;
        }
      });

      return _snapshot;
    });

    // Sort in descending order
    _coolerSnapshots.sort((a, b) => b.timestamp - a.timestamp);
    setCoolerSnapshots(_coolerSnapshots);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = [
    "expiryBuckets.expired",
    "expiryBuckets.30Days",
    "expiryBuckets.121Days",
    "expiryBuckets.active",
  ];
  const itemNames: string[] = ["Expired", "< 30 Days", "< 121 Days", ">= 121 Days"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" display="inline">
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
          tickStyle={getTickStyle(theme)}
          itemDecimals={0}
          margin={{ left: 30 }}
          displayTooltipTotal={true}
        />
      </Grid>
    </Grid>
  );
};
