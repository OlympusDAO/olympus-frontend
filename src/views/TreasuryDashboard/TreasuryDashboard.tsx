import "./TreasuryDashboard.scss";

import { t } from "@lingui/macro";
import { Box, Container, Grid, Link, useMediaQuery } from "@mui/material";
import { DashboardPro, Proteus, TotalIncome, TreasuryAllocation } from "@multifarm/widget";
import { Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { memo } from "react";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Environment } from "src/helpers/environment/Environment/Environment";

import {
  MarketValueGraph,
  OHMStakedGraph,
  ProtocolOwnedLiquidityGraph,
  RiskFreeValueGraph,
  RunwayAvailableGraph,
  TotalValueDepositedGraph,
} from "./components/Graph/Graph";
import { BackingPerOHM, CircSupply, CurrentIndex, GOHMPrice, MarketCap, OHMPrice } from "./components/Metric/Metric";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

const MetricsDashboard = () => (
  <>
    <Box className="hero-metrics">
      <Paper className="ohm-card">
        <MetricCollection>
          <MarketCap {...sharedMetricProps} />
          <OHMPrice {...sharedMetricProps} />
          <GOHMPrice {...sharedMetricProps} className="wsoprice" />
          <CircSupply {...sharedMetricProps} />
          <BackingPerOHM {...sharedMetricProps} />
          <CurrentIndex {...sharedMetricProps} />
        </MetricCollection>
      </Paper>
    </Box>
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
        <Paper className="ohm-card ohm-chart-card">
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
                headerSubText={`${data.length > 0 && data[0].holders}`}
                bulletpointColors={bulletpoints.holder}
                itemNames={tooltipItems.holder}
                itemType={undefined}
                infoTooltipMessage={tooltipInfoMessages().holder}
                expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                scale={undefined}
                color={undefined}
                stroke={undefined}
                dataFormat={undefined}
                isPOL={undefined}
                isStaked={undefined}
              />
            </Paper>
          </Grid> */}

      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Paper className="ohm-card ohm-chart-card">
          <OHMStakedGraph />
        </Paper>
      </Grid>

      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Paper className="ohm-card ohm-chart-card">
          <RunwayAvailableGraph />
        </Paper>
      </Grid>
    </Grid>
  </>
);

const PageWrapper = () => {
  //const [view, setView] = useState(activeView);
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      {!Environment.isMultifarmDashboardEnabled() ? (
        <Container
          style={{
            paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
            paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          }}
        >
          <Outlet />
        </Container>
      ) : (
        <>
          <Tabs
            value={false}
            variant={!(isSmallScreen || isVerySmallScreen) ? "standard" : "scrollable"}
            centered={!(isSmallScreen || isVerySmallScreen)}
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            aria-label="dashboard-tabs"
          >
            <Link to="/dashboard" end component={NavLink}>
              <Tab label={t`Dashboard`} />
            </Link>
            <Link to="/dashboard/treasury" component={NavLink}>
              <Tab label={t`Treasury`} />
            </Link>
            <Link to="/dashboard/revenue" component={NavLink}>
              <Tab label={t`Revenue`} />
            </Link>
            <Link to="/dashboard/olympuspro" component={NavLink}>
              <Tab label={t`Olympus Pro`} style={{ whiteSpace: "nowrap" }} />
            </Link>
            <Link to="/dashboard/proteus" component={NavLink}>
              <Tab label={t`Proteus`} />
            </Link>
          </Tabs>
          <Container
            style={{
              paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
              paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
            }}
          >
            <Outlet />
          </Container>
        </>
      )}
    </div>
  );
};
const TreasuryDashboard = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PageWrapper />}>
          <Route
            index
            element={
              <Box sx={{ mt: "15px" }}>
                <MetricsDashboard />
              </Box>
            }
          />
          <Route
            path="treasury"
            element={
              <Box sx={{ mt: "15px" }}>
                <TreasuryAllocation />
              </Box>
            }
          />
          <Route
            path="revenue"
            element={
              <Box className="treasury">
                <TotalIncome />
              </Box>
            }
          />
          <Route
            path="olympuspro"
            element={
              <Box className="dashboard-pro">
                <DashboardPro />
              </Box>
            }
          />
          <Route
            path="proteus"
            element={
              <Box className="proteus">
                <Proteus />
              </Box>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default memo(TreasuryDashboard);
