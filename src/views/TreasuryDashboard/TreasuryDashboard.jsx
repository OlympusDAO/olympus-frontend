import { Paper, Grid, Typography, Box, Zoom, Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "../../components/Chart/Chart.jsx";
import { trim } from "../../helpers";
import { treasuryDataQuery } from "./treasuryData.js";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";

function TreasuryDashboard() {
  const [data, setData] = useState();
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

  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  useEffect(() => {
    apollo(treasuryDataQuery).then(r => {
      let metrics = r.data.protocolMetrics;
      setData(metrics);
    });
  }, []);

  return (
    <div id="treasury-dashboard-view">
      <Container>
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <Grid container>
              <Grid item lg={3} md={2} sm={2} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="h4">${marketPrice ? trim(marketPrice, 2) : " loading"}</Typography>
              </Grid>

              <Grid item lg={3} md={3} sm={4} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h4">
                  {marketCap &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(marketCap)}
                  {!marketCap && "$ loading"}
                </Typography>
              </Grid>

              <Grid item lg={3} md={4} sm={4} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Supply (circulating/total)
                </Typography>
                <Typography variant="h4">
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
              </Grid>

              <Grid item lg={3} md={3} sm={2} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Current Index
                </Typography>
                <Typography variant="h4">{trim(currentIndex, 2)}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Grid container spacing={2} className="data-grid">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-treasury-chart">
              <Chart
                type="area"
                data={data}
                dataKey={["totalValueLocked"]}
                dataFormat="currency"
                color="#333420"
                stopColor={["#768299", "#98B3E9"]}
                stroke={["#333420", "#98B3E9"]}
                headerText="Total Value Locked"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <Chart
                type="area"
                data={data}
                dataKey={["treasuryMarketValue"]}
                dataFormat="currency"
                color="#333420"
                stopColor={["#F5AC37", "#EA9276"]}
                stroke={["#333420"]}
                headerText="Market Value of Treasury Assets"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <Chart
                type="area"
                data={data}
                format="currency"
                dataKey={["treasuryRiskFreeValue"]}
                dataFormat="currency"
                color="#333420"
                stopColor={["#F5AC37", "#EA9276", "#768299", "#98B3E9"]}
                stroke={["#333420"]}
                headerText="Risk Free Value of Treasury Assets"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={data}
                dataKey={["marketCap"]}
                color="#333420"
                stopColor={["#80CC83", "#80CC8322"]}
                stroke={["#333420"]}
                headerText="Protocol-Owned Liquidity of OHM-DAI"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={data}
                dataKey={["sOhmCirculatingSupply"]}
                color="#333420"
                stopColor={["#333420", "#333420"]}
                stroke={["#333420"]}
                headerText="Holders"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={data}
                dataKey={["totalOHMstaked"]}
                color="#333420"
                stopColor={["#55EBC7", "#47ACEB"]}
                stroke={["#333420"]}
                headerText="OHM Staked"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="line"
                data={data}
                dataKey={["currentAPY"]}
                color="#333420"
                stopColor={["#333420"]}
                stroke={["#333420"]}
                headerText="APY over time"
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="line"
                data={data}
                dataKey={["runway10k", "runway20k", "runway50k"]}
                color="#333420"
                stopColor={["#333420"]}
                stroke={["#FFF", "#2EC608", "#49A1F2"]}
                headerText="Runway Available"
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
