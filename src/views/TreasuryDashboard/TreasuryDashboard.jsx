import { Paper, Grid, Typography, Box, Zoom, Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "../../components/Chart/Chart.jsx";
import { trim } from "../../helpers";
import { treasuryDataQuery, rebasesDataQuery } from "./treasuryData.js";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";

function TreasuryDashboard() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);

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
            <Grid container>
              <Grid item lg={3} md={2} sm={3} xs={6}>
                <Typography variant="h6" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="h4">{marketPrice ? formatCurrency(marketPrice) : " loading"}</Typography>
              </Grid>

              <Grid item lg={3} md={3} sm={3} xs={6}>
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
                  Circulating Supply (total)
                </Typography>
                <Typography variant="h4">
                  {circSupply && parseInt(circSupply)} ({totalSupply && parseInt(totalSupply)})
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
                bulletpointColors={tvlBulletpointColors}
                itemNames={tvlItemNames}
                itemType={dollarItemType}
                infoTooltipMessage={tvlInfoTooltip}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
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
                stroke={["#333420"]}
                headerText="Market Value of Treasury Assets"
                headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                bulletpointColors={coinBulletpointColors}
                itemNames={coinItemNames}
                itemType={dollarItemType}
                infoTooltipMessage={mvtInfoTooltip}
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
                  ["#000", "#fff"],
                ]}
                stroke={["#333420"]}
                headerText="Risk Free Value of Treasury Assets"
                headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                bulletpointColors={coinBulletpointColors}
                itemNames={coinItemNames}
                itemType={dollarItemType}
                infoTooltipMessage={rfvInfoTooltip}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="stack"
                data={data}
                format="percentage"
                dataKey={["treasuryOhmDaiPOL", "treasuryOhmFraxPOL", ""]}
                stopColor={[
                  ["#F5AC37", "#EA9276"],
                  ["#768299", "#98B3E9"],
                  ["", ""],
                ]}
                stroke={["#333420"]}
                headerText="Protocol-Owned Liquidity OHM-DAI"
                headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
                dataFormat="k"
                bulletpointColors={coinBulletpointColors}
                itemNames={coinItemNames}
                itemType={percentageItemType}
                infoTooltipMessage={polInfoTooltip}
              />
            </Paper>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="bar"
                data={data}
                dataKey={["holders"]}
                stroke={["#A3A3A3"]}
                headerText="Holders"
                headerSubText={`${data && data[0].holders}`}
                bulletpointColors={holderBulletpointColors}
                itemNames={holderItemNames}
                itemType={""}
                infoTooltipMessage={holderInfoTooltip}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="area"
                data={staked}
                dataKey={["staked"]}
                stopColor={[["#55EBC7", "#47ACEB"]]}
                stroke={["#333420"]}
                headerText="OHM Staked"
                dataFormat="percent"
                headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
                bulletpointColors={stakedBulletpointColors}
                isStaked={true}
                infoTooltipMessage={stakedInfoTooltip}
              />
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="line"
                data={apy}
                dataKey={["apy"]}
                color="#333420"
                stroke={["#333420"]}
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

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card">
              <Chart
                type="multi"
                data={runway}
                dataKey={["runway10k", "runway20k", "runway50k"]}
                color="#333420"
                stroke={["#000000", "#2EC608", "#49A1F2"]}
                headerText="Runway Available"
                headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
                bulletpointColors={runawayBulletpointColors}
                itemNames={runwayItemNames}
                itemType={""}
                infoTooltipMessage={runwayInfoTooltip}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
