import { Box, Container, Grid, ToggleButton as MuiToggleButton, ToggleButtonGroup, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { Outlet, Route, Routes, useSearchParams } from "react-router-dom";

import {
  AssetsTable,
  DEFAULT_RECORDS_COUNT,
  LiquidBackingPerOhmComparisonGraph,
  MarketValueGraph,
  ProtocolOwnedLiquidityGraph,
} from "./components/Graph/TreasuryGraph";
import { BackingPerOHM, CircSupply, CurrentIndex, GOHMPrice, MarketCap, OHMPrice } from "./components/Metric/Metric";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };
const QUERY_RECORD_COUNT = "recordCount";

/**
 * Renders the Treasury Dashboard, which includes metrics, a date filter and charts.
 *
 * @returns
 */
const MetricsDashboard = () => {
  const theme = useTheme();

  const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected": {
      color: theme.colors.primary[300],
    },
  });

  // State variable for the number of records shown, which is passed to the respective charts
  const [recordCount, setRecordCount] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    // Get the record count from the URL query parameters, or use the default
    const queryRecordCount = searchParams.get(QUERY_RECORD_COUNT) || DEFAULT_RECORDS_COUNT.toString();
    setRecordCount(queryRecordCount);
  }, [searchParams]);

  /**
   * Adds the record count filter to the search parameters, which in turn updates the state variable
   * and triggers an update to the charts.
   *
   * @param _event unused
   * @param value string value representing the number of records to fetch
   */
  const handleRecordCountButtonGroupClick = (_event: unknown, value: unknown) => {
    if (typeof value === "string") {
      // Load the existing search params and update the value, so that other params are not overwritten
      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      updatedSearchParams.set(QUERY_RECORD_COUNT, value);
      setSearchParams(updatedSearchParams.toString());
    } else {
      throw new Error(
        `handleRecordCountButtonGroupClick: expected string value as input, but received type ${typeof value} and value ${value}`,
      );
    }
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
              <OHMPrice {...sharedMetricProps} />
              <GOHMPrice {...sharedMetricProps} className="wsoprice" />
              <CircSupply {...sharedMetricProps} />
              <BackingPerOHM {...sharedMetricProps} />
              <CurrentIndex {...sharedMetricProps} />
            </MetricCollection>
          </Paper>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={4} />
          <Grid item xs={4} textAlign="center">
            <ToggleButtonGroup
              value={recordCount}
              exclusive
              onChange={handleRecordCountButtonGroupClick}
              sx={{
                "&.MuiToggleButtonGroup-root": {
                  height: "40px",
                },
                "& .MuiToggleButton-root": {
                  margin: "2px",
                },
              }}
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
          <Paper {...paperProps}>
            <LiquidBackingPerOhmComparisonGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <MarketValueGraph count={parseInt(recordCount)} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <AssetsTable />
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
