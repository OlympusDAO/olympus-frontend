import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";

function Dashboard() {
  // Use marketPrice as indicator of loading.
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  return (
    <div id="dashboard-view">
      <Grid container spacing={1} className="top-row-data">
        <Grid item lg={4} md={4} sm={3} xs={5} className="olympus-card">
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Price</Typography>
              <Typography variant="h5">
                {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={4} xs={7}>
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Market Cap</Typography>
              <Typography variant="h5">
                {isAppLoading ? (
                  <Skeleton width="160px" />
                ) : (
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(marketCap)
                )}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={5} xs={12}>
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Supply (circulating/total)</Typography>
              <Typography variant="h5">
                {isAppLoading ? (
                  <Skeleton width="250px" />
                ) : (
                  `${new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(circSupply)}
                    /
                    ${new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(totalSupply)}`
                )}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>

      <Box className="main-data-area">
        <Grid container spacing={2} className="data-grid">
          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
                title="Total Value Staking"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
                title="Market value of Treasury"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29153/58862/b6d18145-763a-48b6-ac4c-a8e43ec1c1f6"
                title="Risk Free Value of Treasury"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
                title="Total Value Staking"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/27661/55859/fd0e3db2-d033-4000-9f70-c65de52ef9a9"
                title="Holders"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/34202/69216/17e353f6-ccb4-42ff-b6cb-150f69543f4d"
                title="APY Over Time"
              />
            </div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/28756/58813/c7893c75-d8f1-421e-85c3-556a22cd7885"
                title="OHM Stakers"
              />
            </div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/37326/74014/f0ad674a-2787-4314-b534-86dc1b910922"
                title="Runway Available"
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Dashboard;
