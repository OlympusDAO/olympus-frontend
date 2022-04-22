import { Trans } from "@lingui/macro";
import { Container, Grid, Link, SvgIcon, Typography } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import { Icon, Paper } from "@olympusdao/component-library";
import { Holders, MonthlyIncome, TreasuryBalance } from "src/views/TreasuryDashboard/components/Metric/Metric";

export const TransparencyDashboard: React.FC = () => {
  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h3">
            <Trans>Transparency Dashboard</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Treasury Reports</Typography>
                  </Grid>
                  <Grid item xs={12} />
                  <Grid item xs={11} />
                  <Grid item xs={1}>
                    <Icon color="primary" name="arrow-up" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Policy Reports</Typography>
                  </Grid>
                  <Grid item xs={12} />
                  <Grid item xs={11} />
                  <Grid item xs={1}>
                    <Icon color="primary" name="arrow-up" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper fullWidth childPaperBackground={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">Transparency Flows</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className="subtext">
                  Immerse yourself in the Olympus economy. Follow Olympus Treasury wallets, contract addresse and all
                  things connected to treasury governance and ongoing asset management strategies.
                </Typography>
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <Paper fullWidth>
                  <Link href="/transparency/contracts" variant="h5">
                    <Grid container>
                      <Grid item xs={7}>
                        Treasury Contracts List
                      </Grid>
                      <Grid item xs />
                      <Grid item xs={1}>
                        <SvgIcon color="primary" component={ArrowForward} />
                      </Grid>
                    </Grid>
                  </Link>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper fullWidth>
                  <Link href="/transparency/governance" variant="h5">
                    <Grid container>
                      <Grid item xs={7}>
                        Treasury Governance
                      </Grid>
                      <Grid item xs />
                      <Grid item xs={1}>
                        <SvgIcon color="primary" component={ArrowForward} />
                      </Grid>
                    </Grid>
                  </Link>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper fullWidth>
                  <Link href="/transparency/dao" variant="h5">
                    <Grid container>
                      <Grid item xs={7}>
                        DAO Governance
                      </Grid>
                      <Grid item xs />
                      <Grid item xs={1}>
                        <SvgIcon color="primary" component={ArrowForward} />
                      </Grid>
                    </Grid>
                  </Link>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper fullWidth>
                  <Link href="/transparency/policy" variant="h5">
                    <Grid container>
                      <Grid item xs={7}>
                        Policy Governance
                      </Grid>
                      <Grid item xs />
                      <Grid item xs={1}>
                        <SvgIcon color="primary" component={ArrowForward} />
                      </Grid>
                    </Grid>
                  </Link>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper fullWidth>
            <Typography variant="h4">Audits</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Related Links</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper fullWidth>
                <Link href="/dashboard/treasury" variant="h5">
                  Treasury Dashboard
                </Link>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper fullWidth>
                <Link href="/dashboard/treasury" variant="h5">
                  Olympus Grants
                </Link>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper fullWidth>
                <Link href="/dashboard/treasury" variant="h5">
                  Olympus Incubator
                </Link>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper fullWidth>
                <Link href="/dashboard/treasury" variant="h5">
                  Forum
                </Link>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
