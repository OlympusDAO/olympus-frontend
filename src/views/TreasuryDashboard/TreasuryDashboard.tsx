import "./TreasuryDashboard.scss";

import { Box, Container, Grid, useMediaQuery, Zoom } from "@material-ui/core";
import { DashboardPro, Proteus, TotalIncome, TreasuryAllocation } from "@multifarm/widget";
import { Metric, MetricCollection, Paper, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, memo, useState } from "react";
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
    </Zoom>
  </>
);

const TreasuryDashboard = memo(() => {
  const [view, setView] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      {!Environment.isMultifarmDashboardEnabled() ? (
        <Container
          style={{
            paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
            paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          }}
        >
          <MetricsDashboard />
        </Container>
      ) : (
        <>
          <Tabs
            centered
            value={view}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="dashboard-tabs"
          >
            <Tab aria-label="key-metrics" label="Overview" />
            <Tab aria-label="treasury-allocation" label="Treasury" />
            <Tab aria-label="revenue" label="Revenue" />
            <Tab aria-label="olympus-pro" label="Olympus Pro" />
            <Tab aria-label="proteus" label="Proteus" />
          </Tabs>
          <Container
            style={{
              paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
              paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
            }}
          >
            <TabPanel value={view} index={0}>
              <Box sx={{ mt: "15px" }}>
                <MetricsDashboard />
              </Box>
            </TabPanel>
            <TabPanel value={view} index={1}>
              <Box className="treasury">
                <TreasuryAllocation />
              </Box>
            </TabPanel>
            <TabPanel value={view} index={2}>
              <Box className="income">
                <TotalIncome />
              </Box>
            </TabPanel>
            <TabPanel value={view} index={3}>
              <Box className="dashboard-pro">
                <DashboardPro />
              </Box>
            </TabPanel>
            <TabPanel value={view} index={4}>
              <Box className="proteus">
                <Proteus />
              </Box>
            </TabPanel>
          </Container>
        </>
      )}
    </div>
  );
});

export default TreasuryDashboard;
