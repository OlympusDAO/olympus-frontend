import "./TreasuryDashboard.scss";

import { t } from "@lingui/macro";
import { Box, Container, Grid, Link, ToggleButton, ToggleButtonGroup, useMediaQuery } from "@mui/material";
import { DashboardPro, Proteus, TotalIncome, TreasuryAllocation } from "@multifarm/widget";
import { Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { memo, useState } from "react";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Environment } from "src/helpers/environment/Environment/Environment";

import {
  defaultRecordsCount,
  LiquidBackingPerOhmComparisonGraph,
  MarketValueGraph,
  ProtocolOwnedLiquidityGraph,
} from "./components/Graph/TreasuryGraph";
import { BackingPerOHM, CircSupply, CurrentIndex, GOHMPrice, MarketCap, OHMPrice } from "./components/Metric/Metric";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

const MetricsDashboard = () => {
  // State variable for the number of records shown, which is passed to the respective charts
  const [recordCount, setRecordCount] = useState(defaultRecordsCount.toString());
  const handleButtonGroupOnClick = (_event: unknown, value: unknown) => {
    if (typeof value === "string") {
      setRecordCount(value);
    }
  };

  return (
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
        <Grid item xs={12} container>
          <Grid item xs={4} />
          <Grid item xs={4} textAlign="center">
            <ToggleButtonGroup
              className="date-filter"
              value={recordCount}
              color="warning" // TODO adjust this to theme
              exclusive
              onChange={handleButtonGroupOnClick}
              style={{ height: "40px" }}
            >
              <ToggleButton value="7">7d</ToggleButton>
              <ToggleButton value="30">30d</ToggleButton>
              <ToggleButton value="90">90d</ToggleButton>
              <ToggleButton value="1000">Max</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Grid item xs={12}>
          <Paper className="ohm-card ohm-chart-card">
            <LiquidBackingPerOhmComparisonGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className="ohm-card ohm-chart-card">
            <MarketValueGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className="ohm-card ohm-chart-card">
            <ProtocolOwnedLiquidityGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

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
            {/* <Link to="/dashboard/treasury" component={NavLink}>
              <Tab label={t`Treasury`} />
            </Link>
            <Link to="/dashboard/revenue" component={NavLink}>
              <Tab label={t`Revenue`} />
            </Link> */}
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
