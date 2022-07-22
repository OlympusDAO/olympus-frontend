import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import { Metric, MetricCollection, Paper, TabBar } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { Outlet, Route, Routes, useSearchParams } from "react-router-dom";

import { QUERY_RECORD_COUNT, QUERY_TOKEN, QUERY_TOKEN_GOHM, QUERY_TOKEN_OHM } from "./components/Graph/Constants";
import {
  DEFAULT_RECORDS_COUNT,
  LiquidBackingPerOhmComparisonGraph,
  MarketValueLiquidBackingGraphContainer,
  ProtocolOwnedLiquidityGraph,
} from "./components/Graph/TreasuryGraph";
import {
  BackingPerGOHM,
  BackingPerOHM,
  CurrentIndex,
  GOhmCirculatingSupply,
  GOHMPriceFromSubgraph,
  MarketCap,
  OhmCirculatingSupply,
  OHMPriceFromSubgraph,
} from "./components/Metric/Metric";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

/**
 * Renders the Treasury Dashboard, which includes metrics, a date filter and charts.
 *
 * @returns
 */
const MetricsDashboard = () => {
  // State variable for the number of records shown, which is passed to the respective charts
  const [recordCount, setRecordCount] = useState("");
  // State variable for the current token
  const [token, setToken] = useState(QUERY_TOKEN_OHM);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Get the record count from the URL query parameters, or use the default
    const queryRecordCount = searchParams.get(QUERY_RECORD_COUNT) || DEFAULT_RECORDS_COUNT.toString();
    setRecordCount(queryRecordCount);

    // Get the token or use the default
    const queryToken = searchParams.get(QUERY_TOKEN) || QUERY_TOKEN_OHM;
    setToken(queryToken);
  }, [searchParams]);

  /**
   * After changing the value for the record count, returns the search parameters as a
   * string (excluding the "?" prefix) that is suitable for appending to a URL.
   *
   * @param recordCount
   * @returns
   */
  const getSearchParamsWithUpdatedRecordCount = (recordCount: number): string => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set(QUERY_RECORD_COUNT, recordCount.toString());

    return updatedSearchParams.toString();
  };

  /**
   * After changing the value for the token, returns the search parameters as a
   * string (excluding the "?" prefix) that is suitable for appending to a URL.
   *
   * @param recordCount
   * @returns
   */
  const getSearchParamsWithUpdatedToken = (token: string): string => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set(QUERY_TOKEN, token);

    return updatedSearchParams.toString();
  };

  const isTokenOHM = (): boolean => {
    return token === QUERY_TOKEN_OHM;
  };

  const isActiveRecordCount = (input: number): boolean => {
    return recordCount === input.toString();
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
              {isTokenOHM() ? (
                <OhmCirculatingSupply {...sharedMetricProps} />
              ) : (
                <GOhmCirculatingSupply {...sharedMetricProps} />
              )}
              {isTokenOHM() ? <BackingPerOHM {...sharedMetricProps} /> : <BackingPerGOHM {...sharedMetricProps} />}
              <CurrentIndex {...sharedMetricProps} />
            </MetricCollection>
          </Paper>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={1} />
          <Grid item xs={4} textAlign="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: "7d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(7)}`,
                  isActive: isActiveRecordCount(7),
                },
                {
                  label: "30d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(30)}`,
                  isActive: isActiveRecordCount(30),
                },
                {
                  label: "90d",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(90)}`,
                  isActive: isActiveRecordCount(90),
                },
                {
                  label: "Max",
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(1000)}`,
                  isActive: isActiveRecordCount(1000),
                },
              ]}
            />
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={2} textAlign="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: QUERY_TOKEN_OHM,
                  to: `/dashboard?${getSearchParamsWithUpdatedToken(QUERY_TOKEN_OHM)}`,
                  isActive: isTokenOHM(),
                },
                {
                  label: QUERY_TOKEN_GOHM,
                  to: `/dashboard?${getSearchParamsWithUpdatedToken(QUERY_TOKEN_GOHM)}`,
                  isActive: !isTokenOHM(),
                },
              ]}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            <LiquidBackingPerOhmComparisonGraph activeToken={token} count={parseInt(recordCount)} />
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
