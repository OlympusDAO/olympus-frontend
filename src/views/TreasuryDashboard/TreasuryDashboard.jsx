import { Paper, Grid, Typography, Box, Zoom, Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "../../components/Chart/Chart.jsx";
import { trim } from "../../helpers";
import { treasuryDataQuery } from "./treasuryData.js";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";

function TreasuryDashboard() {
  const [data, setData] = useState(null);
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

  const formatCurrency = c => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(c);
  };

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
                  {marketCap && formatCurrency(marketCap)}
                  {!marketCap && "$ loading"}
                </Typography>
              </Grid>

              <Grid item lg={3} md={4} sm={4} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Supply (circulating/total)
                </Typography>
                <Typography variant="h4">
                  {circSupply && formatCurrency(circSupply)}/{totalSupply && formatCurrency(totalSupply)}
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
                stopColor={[["#768299", "#98B3E9"]]}
                stroke={["#333420"]}
                headerText="Total Value Locked"
                headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <Chart
                type="stack"
                data={data}
                dataKey={["treasuryDaiMarketValue", "treasuryFraxRiskFreeValue"]}
                stopColor={[
                  ["#F5AC37", "#EA9276"],
                  ["#768299", "#98B3E9"],
                ]}
                stroke={["#333420"]}
                headerText="Market Value of Treasury Assets"
                headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <Chart
                type="stack"
                data={data}
                format="currency"
                dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue"]}
                stopColor={[
                  ["#F5AC37", "#EA9276"],
                  ["#768299", "#98B3E9"],
                ]}
                stroke={["#333420"]}
                headerText="Risk Free Value of Treasury Assets"
                headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={data}
                dataKey={["treasuryXsushiMarketValue"]}
                stopColor={[["#80CC83", "#80CC8322"]]}
                stroke={["#333420"]}
                headerText="Protocol-Owned Liquidity of OHM-DAI"
                headerSubText={`${data && formatCurrency(data[0].treasuryXsushiMarketValue)}%`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="bar"
                data={data}
                dataKey={["holders"]}
                stroke={["#333420"]}
                headerText="Holders"
                headerSubText={`${data && data[0].holders}`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={data}
                dataKey={["totalOHMstaked"]}
                stopColor={[["#55EBC7", "#47ACEB"]]}
                stroke={["#333420"]}
                headerText="OHM Staked"
                headerSubText={`${data && trim(data[0].totalOHMstaked, 1)}% `}
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
                stroke={["#333420"]}
                headerText="APY over time"
                headerSubText={`${data && trim(data[0].currentAPY, 1)}%`}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="multi"
                data={data}
                dataKey={["runway10k", "runway20k", "runway50k"]}
                color="#333420"
                stroke={["#FFF", "#2EC608", "#49A1F2"]}
                headerText="Runway Available"
                headerSubText={`10K ${data && trim(data[0].runway10k, 1)} Days, 20K ${
                  data && trim(data[0].runway20k, 1)
                } Days, 50K ${data && trim(data[0].runway50k, 1)} Days`}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
