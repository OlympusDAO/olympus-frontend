import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";

function Dashboard() {
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
        <Grid item lg={4} md={4} sm={4} xs={5} className="olympus-card">
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Price</Typography>
              <Typography variant="h5">${marketPrice ? trim(marketPrice, 2) : " loading"}</Typography>
            </Paper>
          </Zoom>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <Grid item lg={4} md={7} sm={7} xs={7}>
<<<<<<< HEAD
          <div className="ohm-dashboard-card">
            <div className="card-body">
              <h4 className="title">Market Cap</h4>
              <h3 className="content">
<<<<<<< HEAD
                {marketCap &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(marketCap)}
=======
                {marketCap && new Intl.NumberFormat("en-US", {
=======
          <Paper>
<<<<<<< HEAD
            <Typography variant="h5">Market Cap</Typography>
            <Typography variant="h4">
                ${marketCap && new Intl.NumberFormat("en-US", {
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
            <Typography variant="h6">Market Cap</Typography>
            <Typography variant="h5">
                {marketCap && new Intl.NumberFormat("en-US", {
>>>>>>> dashboard top card header cards adjusted and mobile tile view centered
=======
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
        <Grid item lg={4} md={4} sm={7} xs={6}>
=======
        <Grid item lg={4} md={4} sm={4} xs={7}>
<<<<<<< HEAD
>>>>>>> rebased from develop. everything appears to work except rebase timer
          <Paper className="ohm-card">
            <Typography variant="h6">Market Cap</Typography>
            <Typography variant="h5">
              {marketCap &&
                new Intl.NumberFormat("en-US", {
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(marketCap)}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> started testing paper and typography on dashboard card
              </h3>
            </div>
          </div>
        </Grid>

        <Grid item lg={4} md={12} sm={12} xs={12}>
          <div className="ohm-dashboard-card">
            <div className="card-body">
              <h4 className="title">Supply (circulating/total)</h4>
              <h3 className="content">
<<<<<<< HEAD
                {circSupply &&
                  new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(circSupply)}
                /
                {totalSupply &&
                  new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(totalSupply)}
=======
                {circSupply && new Intl.NumberFormat("en-US", { 
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                }).format(circSupply)}/ 
                {totalSupply && new Intl.NumberFormat("en-US", { 
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                }).format(totalSupply)}
>>>>>>> started testing paper and typography on dashboard card
              </h3>
            </div>
          </div>
        </Grid>
      </Grid>

      <Flex className="main-data-area">
        <div className="olympus-card">
          <div className="card-body">
=======
             </Typography>
          </Paper> 
=======
=======
              {!marketCap && "$ loading"}
>>>>>>> added fix for mobile topbar button styles, updated light themes to be closer to spec
            </Typography>
          </Paper>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
=======
=======
        <Grid item lg={4} md={7} sm={7} xs={7}>
          <div className="ohm-dashboard-card">
            <div className="card-body">
              <h4 className="title">Market Cap</h4>
              <h3 className="content">
=======
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Market Cap</Typography>
              <Typography variant="h5">
>>>>>>> added basic card animations
                {marketCap &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(marketCap)}
<<<<<<< HEAD
              </h3>
            </div>
          </div>
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
=======
                {!marketCap && "$ loading"}
              </Typography>
            </Paper>
          </Zoom>
>>>>>>> added basic card animations
        </Grid>

        <Grid item lg={4} md={4} sm={4} xs={12}>
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">Supply (circulating/total)</Typography>
              <Typography variant="h5">
                {circSupply &&
                  new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(circSupply)}
                /
                {totalSupply &&
                  new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(totalSupply)}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
      <Grid container spacing={2} className="main-data-area">
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
=======
      <Flex className="main-data-area">
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
              title="Total Value Staking"
            />
          </div>
<<<<<<< HEAD
        </div>

        <div className="olympus-card">
          <div className="card-body">
=======
        </Grid>

<<<<<<< HEAD
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
              title="Market value of Treasury"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/29153/58862/b6d18145-763a-48b6-ac4c-a8e43ec1c1f6"
              title="Risk Free Value of Treasury"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
              title="Total Value Staking"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/27661/55859/fd0e3db2-d033-4000-9f70-c65de52ef9a9"
              title="Holders"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={4} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/34202/69216/17e353f6-ccb4-42ff-b6cb-150f69543f4d"
              title="APY Over Time"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={6} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={6} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/28756/58813/c7893c75-d8f1-421e-85c3-556a22cd7885"
              title="OHM Stakers"
            />
          </div>
        </Grid>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="olympus-card">
          <div className="card-body">
=======
        <Grid item lg={6} sm={12}>
          <div className="dune-card">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        <Grid item lg={6} sm={12}>
          <div className="dune-card">
=======
        <div className="olympus-card">
          <div className="card-body">
>>>>>>> Linting fixes
>>>>>>> Linting fixes
            <iframe
              frameBorder="0"
              loading="lazy"
              src="https://duneanalytics.com/embeds/37326/74014/f0ad674a-2787-4314-b534-86dc1b910922"
              title="Runway Available"
            />
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
        </div>
      </Flex>
=======
        </Grid>
      </Grid>
<<<<<<< HEAD
      
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
=======
        </Grid>
      </Grid>
=======
        </div>
      </Flex>
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
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
>>>>>>> rebased from develop. everything appears to work except rebase timer
    </div>
  );
}

export default Dashboard;
