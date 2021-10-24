import "./treasury-dashboard.scss";
import { useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import apollo from "../../lib/apolloClient";
import { useTheme } from "@material-ui/core/styles";
import Chart from "../../components/Chart/Chart.jsx";
import { trim, formatCurrency } from "../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";

import {
  treasuryDataQuery,
  rebasesDataQuery,
  bulletpoints,
  tooltipItems,
  tooltipInfoMessages,
  itemType,
} from "./treasuryData.js";
import { memo } from "react";

const Metric = props => <Box className={`metric ${props.className}`}>{props.children}</Box>;
Metric.Value = props => <Typography variant="h5">{props.children || <Skeleton type="text" />}</Typography>;
Metric.Title = props => (
  <Typography variant="h6" text="colorSecondary">
    {props.children}
  </Typography>
);

const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap);

  return (
    <Metric className="market">
      <Metric.Title>Market Cap</Metric.Title>
      <Metric.Value>{marketCap && formatCurrency(marketCap, 0)}</Metric.Value>
    </Metric>
  );
};

const OHMPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);

  return (
    <Metric className="price">
      <Metric.Title>OHM Price</Metric.Title>
      <Metric.Value>{marketPrice && formatCurrency(marketPrice, 2)}</Metric.Value>
    </Metric>
  );
};

const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);

  const isDataLoaded = circSupply && totalSupply;

  return (
    <Metric className="circ">
      <Metric.Title>Circulating Supply (total)</Metric.Title>
      <Metric.Value>{isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}</Metric.Value>
    </Metric>
  );
};

const BackingPerOHM = () => {
  const backingPerOhm = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);

  return (
    <Metric className="bpo">
      <Metric.Title>Backing per OHM</Metric.Title>
      <Metric.Value>{!isNaN(backingPerOhm) && formatCurrency(backingPerOhm, 2)}</Metric.Value>
    </Metric>
  );
};

const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);

  return (
    <Metric className="index">
      <Metric.Title>
        Current Index
        <InfoTooltip message="The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held a single OHM from day 1." />
      </Metric.Title>
      <Metric.Value>{currentIndex && trim(currentIndex, 2) + " sOHM"}</Metric.Value>
    </Metric>
  );
};

const WSOHMPrice = () => {
  const wsOhmPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);

  return (
    <Metric className="wsoprice">
      <Metric.Title>
        wsOHM Price
        <InfoTooltip message="wsOHM = sOHM * index\n\nThe price of wsOHM is equal to the price of OHM multiplied by the current index" />
      </Metric.Title>
      <Metric.Value>{wsOhmPrice && formatCurrency(wsOhmPrice, 2)}</Metric.Value>
    </Metric>
  );
};

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <MarketCap />
              <OHMPrice />
              <WSOHMPrice />
              <CircSupply />
              <BackingPerOHM />
              <CurrentIndex />
            </Box>
          </Paper>
        </Box>

        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <TotalValueDepositedGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <MarketValueGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <RiskFreeValueGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <ProtocolOwnedLiquidityGraph />
              </Paper>
            </Grid>

            {/*  Temporarily removed until correct data is in the graph */}
            {/* <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={""}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid> */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <OHMStakedGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <APYOverTimeGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <RunwayAvailableGraph />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
});

const useTreasuryMetrics = () => {
  return useQuery("treasury_metrics", async () => {
    const response = await apollo(treasuryDataQuery);

    console.log("metrics");

    // Transform string values to floats
    return response.data.protocolMetrics.map(metric =>
      Object.entries(metric).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
    );
  });
};

const useTreasuryRebases = () => {
  return useQuery("treasury_rebases", async () => {
    const response = await apollo(rebasesDataQuery);

    console.log("rebases");

    // Transform string values to floats
    return response.data.rebases;
  });
};

const TotalValueDepositedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  return (
    <Chart
      type="area"
      data={data}
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      dataKey={["totalValueLocked"]}
      headerText="Total Value Deposited"
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
    />
  );
};

const MarketValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  return (
    <Chart
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#DC30EB", "#EA98F1"],
        ["#8BFF4D", "#4C8C2A"],
      ]}
      dataKey={[
        "treasuryDaiMarketValue",
        "treasuryFraxMarketValue",
        "treasuryWETHMarketValue",
        "treasuryXsushiMarketValue",
      ]}
      data={data}
      type="stack"
      itemType={itemType.dollar}
      itemNames={tooltipItems.coin}
      bulletpointColors={bulletpoints.coin}
      headerText="Market Value of Treasury Assets"
      infoTooltipMessage={tooltipInfoMessages.mvt}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
    />
  );
};

const RiskFreeValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  return (
    <Chart
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#000", "#fff"],
        ["#000", "#fff"],
      ]}
      data={data}
      type="stack"
      format="currency"
      itemType={itemType.dollar}
      itemNames={tooltipItems.coin}
      bulletpointColors={bulletpoints.coin}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      headerText="Risk Free Value of Treasury Assets"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue"]}
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
    />
  );
};

const ProtocolOwnedLiquidityGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  return (
    <Chart
      isPOL
      type="area"
      data={data}
      dataFormat="percent"
      itemNames={tooltipItems.pol}
      itemType={itemType.percentage}
      dataKey={["treasuryOhmDaiPOL"]}
      bulletpointColors={bulletpoints.pol}
      infoTooltipMessage={tooltipInfoMessages.pol}
      headerText="Protocol Owned Liquidity OHM-DAI"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
      stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0)"]]}
    />
  );
};

const OHMStakedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  const staked =
    data &&
    data
      .map(metric => ({
        staked: (metric.sOhmCirculatingSupply / metric.ohmCirculatingSupply) * 100,
        timestamp: metric.timestamp,
      }))
      .filter(metric => metric.staked < 100);

  return (
    <Chart
      isStaked
      type="area"
      data={staked}
      dataKey={["staked"]}
      dataFormat="percent"
      headerText="OHM Staked"
      stopColor={[["#55EBC7", "#47ACEB"]]}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
    />
  );
};

const APYOverTimeGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryRebases();

  let apy =
    data &&
    data
      .map(entry => ({
        timestamp: entry.timestamp,
        apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
      }))
      .filter(pm => pm.apy < 300000);

  return (
    <Chart
      type="line"
      scale="log"
      data={apy}
      dataKey={["apy"]}
      dataFormat="percent"
      headerText="APY over time"
      itemNames={tooltipItems.apy}
      itemType={itemType.percentage}
      color={theme.palette.text.primary}
      bulletpointColors={bulletpoints.apy}
      stroke={[theme.palette.text.primary]}
      infoTooltipMessage={tooltipInfoMessages.apy}
      headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics();

  const runway = data && data.filter(metric => metric.runway10k > 5);

  return (
    <Chart
      type="line"
      data={runway}
      itemType={""}
      dataFormat="days"
      dataKey={["runwayCurrent"]}
      headerText="Runway Available"
      itemNames={tooltipItems.runway}
      color={theme.palette.text.primary}
      stroke={[theme.palette.text.primary]}
      bulletpointColors={bulletpoints.runway}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
    />
  );
};

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App so that
export default () => (
  <QueryClientProvider client={queryClient}>
    <TreasuryDashboard />
  </QueryClientProvider>
);
