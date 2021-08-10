import { useEffect, useState } from "react";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import Chart from "../../components/Chart/Chart.jsx";
import { trim } from "../../helpers";
import { treasuryDataQuery, rebasesDataQuery } from "./treasuryData.js";
import { useTheme } from "@material-ui/core/styles";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";

function TreasuryDashboard() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width: 744px)");

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

  const tvlBulletpointColors = useSelector(state => {
    return state.bulletpoints.tvl;
  });

  const coinBulletpointColors = useSelector(state => {
    return state.bulletpoints.coin;
  });

  const holderBulletpointColors = useSelector(state => {
    return state.bulletpoints.holder;
  });

  const apyBulletpointColors = useSelector(state => {
    return state.bulletpoints.apy;
  });

  const runawayBulletpointColors = useSelector(state => {
    return state.bulletpoints.runway;
  });

  const stakedBulletpointColors = useSelector(state => {
    return state.bulletpoints.staked;
  });

  const tvlItemNames = useSelector(state => {
    return state.tooltipItems.tvl;
  });

  const coinItemNames = useSelector(state => {
    return state.tooltipItems.coin;
  });

  const holderItemNames = useSelector(state => {
    return state.tooltipItems.holder;
  });

  const apyItemNames = useSelector(state => {
    return state.tooltipItems.apy;
  });

  const runwayItemNames = useSelector(state => {
    return state.tooltipItems.runway;
  });

  const tvlInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.tvl;
  });

  const mvtInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.mvt;
  });

  const rfvInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.rfv;
  });

  const polInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.pol;
  });

  const holderInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.holder;
  });

  const apyInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.apy;
  });

  const stakedInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.staked;
  });

  const runwayInfoTooltip = useSelector(state => {
    return state.infoTooltipMessages.runway;
  });

  const dollarItemType = "$";

  const percentageItemType = "%";

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
      let metrics = r.data.protocolMetrics.map(entry =>
        Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
      metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
      metrics = metrics.filter(pm => pm.totalValueLocked < 500000000);
      setData(metrics);

      let staked = r.data.protocolMetrics.map(entry => ({
        staked: (parseFloat(entry.sOhmCirculatingSupply) / parseFloat(entry.ohmCirculatingSupply)) * 100,
        timestamp: entry.timestamp,
      }));
      staked = staked.filter(pm => pm.staked < 100);
      setStaked(staked);

      let runway = metrics.filter(pm => pm.runway10k > 5);
      setRunway(runway);
    });

    apollo(rebasesDataQuery).then(r => {
      let apy = r.data.rebases.map(entry => ({
        apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
        timestamp: entry.timestamp,
      }));

      apy = apy.filter(pm => pm.apy < 300000);

      setApy(apy);
    });
  }, []);

  return (
    <div id="treasury-dashboard-view">
      <Container>
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <Box display="flex" justifyContent="space-evenly">
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h4">
                  {marketCap && formatCurrency(marketCap)}
                  {!marketCap && <Skeleton type="text" />}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="textSecondary">
                  OHM Price
                </Typography>
                <Typography variant="h4">
                  {marketPrice ? formatCurrency(marketPrice) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" color="textSecondary">
                  Circulating Supply (total)
                </Typography>
                <Typography variant="h4">
                  {circSupply ? (
                    parseInt(circSupply)
                  ) : (
                    <Skeleton type="text" width="40%" style={{ display: "inline-block" }} />
                  )}
                  &nbsp;(
                  {totalSupply ? (
                    parseInt(totalSupply)
                  ) : (
                    <Skeleton type="text" width="40%" style={{ display: "inline-block" }} />
                  )}
                  )
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" color="textSecondary">
                  Current Index
                </Typography>
                <Typography variant="h4">
                  {currentIndex ? (
                    trim(currentIndex, 2)
                  ) : (
                    <Skeleton type="text" width="40%" style={{ display: "inline-block" }} />
                  )}
                  &nbsp;sOHM
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card ohm-treasury-chart">
                <Chart
                  type="area"
                  data={data}
                  dataKey={["totalValueLocked"]}
                  stopColor={[["#768299", "#98B3E9"]]}
                  headerText="Total Value Locked"
                  headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
                  bulletpointColors={tvlBulletpointColors}
                  itemNames={tvlItemNames}
                  itemType={dollarItemType}
                  infoTooltipMessage={tvlInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  dataKey={["treasuryDaiMarketValue", "treasuryFraxMarketValue"]}
                  stopColor={[
                    ["#F5AC37", "#EA9276"],
                    ["#768299", "#98B3E9"],
                    ["#000", "#fff"],
                  ]}
                  headerText="Market Value of Treasury Assets"
                  headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                  bulletpointColors={coinBulletpointColors}
                  itemNames={coinItemNames}
                  itemType={dollarItemType}
                  infoTooltipMessage={mvtInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  format="currency"
                  dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue"]}
                  stopColor={[
                    ["#F5AC37", "#EA9276"],
                    ["#768299", "#98B3E9"],
                    ["#000", "#fff"],
                  ]}
                  headerText="Risk Free Value of Treasury Assets"
                  headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                  bulletpointColors={coinBulletpointColors}
                  itemNames={coinItemNames}
                  itemType={dollarItemType}
                  infoTooltipMessage={rfvInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="stack"
                  data={data}
                  dataKey={["treasuryOhmDaiPOL", "treasuryOhmFraxPOL", ""]}
                  stopColor={[
                    ["#F5AC37", "#EA9276"],
                    ["#768299", "#98B3E9"],
                    ["", ""],
                  ]}
                  headerText="Protocol-Owned Liquidity"
                  headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
                  dataFormat="percent"
                  bulletpointColors={coinBulletpointColors}
                  itemNames={coinItemNames}
                  itemType={percentageItemType}
                  infoTooltipMessage={polInfoTooltip}
                />
              </Paper>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data && data[0].holders}`}
                  bulletpointColors={holderBulletpointColors}
                  itemNames={holderItemNames}
                  itemType={""}
                  infoTooltipMessage={holderInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="area"
                  data={staked}
                  dataKey={["staked"]}
                  stopColor={[["#55EBC7", "#47ACEB"]]}
                  headerText="OHM Staked"
                  dataFormat="percent"
                  headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
                  bulletpointColors={stakedBulletpointColors}
                  isStaked={true}
                  infoTooltipMessage={stakedInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="line"
                  data={apy}
                  dataKey={["apy"]}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary]}
                  headerText="APY over time"
                  dataFormat="percent"
                  headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
                  bulletpointColors={apyBulletpointColors}
                  itemNames={apyItemNames}
                  itemType={percentageItemType}
                  infoTooltipMessage={apyInfoTooltip}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="multi"
                  data={runway}
                  dataKey={["runway10k", "runway20k", "runway50k"]}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary, "#2EC608", "#49A1F2"]}
                  headerText="Runway Available"
                  headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
                  dataFormat="days"
                  bulletpointColors={runawayBulletpointColors}
                  itemNames={runwayItemNames}
                  itemType={""}
                  infoTooltipMessage={runwayInfoTooltip}
                />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
