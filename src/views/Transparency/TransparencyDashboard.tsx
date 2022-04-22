import { Trans } from "@lingui/macro";
import { Container, Grid, Typography } from "@material-ui/core";
import { Holders, MonthlyIncome, TreasuryBalance } from "src/views/TreasuryDashboard/components/Metric/Metric";

export const TransparencyDashboard: React.FC = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3">
            <Trans>Transparency Dashboard</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={4}>
              <TreasuryBalance />
            </Grid>
            <Grid item xs={4}>
              <Holders />
            </Grid>
            <Grid item xs={4}>
              <MonthlyIncome />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
