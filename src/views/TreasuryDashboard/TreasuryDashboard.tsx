import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import { Metric, MetricCollection, Paper, TabBar } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { Outlet, Route, Routes, useSearchParams } from "react-router-dom";

import {
  DEFAULT_RECORDS_COUNT,
  LiquidBackingPerOhmComparisonGraph,
  MarketValueLiquidBackingGraphContainer,
  ProtocolOwnedLiquidityGraph,
} from "./components/Graph/TreasuryGraph";
import {
  BackingPerOHM,
  CircSupply,
  CurrentIndex,
  GOHMPriceFromSubgraph,
  MarketCap,
  OHMPriceFromSubgraph,
} from "./components/Metric/Metric";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };
const QUERY_RECORD_COUNT = "recordCount";

/**
 * Renders the Treasury Dashboard, which includes metrics, a date filter and charts.
 *
 * @returns
 */
const MetricsDashboard = () => {
  // State variable for the number of records shown, which is passed to the respective charts
  const [recordCount, setRecordCount] = useState("");

  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Get the record count from the URL query parameters, or use the default
    const queryRecordCount = searchParams.get(QUERY_RECORD_COUNT) || DEFAULT_RECORDS_COUNT.toString();
    setRecordCount(queryRecordCount);
  }, [searchParams]);

  const getSearchParamsWithUpdatedRecordCount = (recordCount: number): string => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set(QUERY_RECORD_COUNT, recordCount.toString());

    return updatedSearchParams.toString();
  };

  const paperProps = {
    fullWidth: true,
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <MetricCollection>
              <MarketCap {...sharedMetricProps} />
              <OHMPriceFromSubgraph {...sharedMetricProps} />
              <GOHMPriceFromSubgraph {...sharedMetricProps} className="wsoprice" />
              <CircSupply {...sharedMetricProps} />
              <BackingPerOHM {...sharedMetricProps} />
              <CurrentIndex {...sharedMetricProps} />
            </MetricCollection>
          </Paper>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={4} />
          <Grid item xs={4} textAlign="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: "7d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(7)}`,
                  isActive: recordCount === "7",
                },
                {
                  label: "30d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(30)}`,
                  isActive: recordCount === "30",
                },
                {
                  label: "90d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(90)}`,
                  isActive: recordCount === "90",
                },
                {
                  label: "Max",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(1000)}`,
                  isActive: recordCount === "1000",
                },
              ]}
            />
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <LiquidBackingPerOhmComparisonGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <MarketValueLiquidBackingGraphContainer count={parseInt(recordCount)} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <ProtocolOwnedLiquidityGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

const PageWrapper = () => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
      }}
    >
      <Outlet />
    </Container>
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
        </Route>
      </Routes>
    </>
  );
};

export default memo(TreasuryDashboard);
