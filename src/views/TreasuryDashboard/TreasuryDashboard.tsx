import { Box, Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Metric, Paper, TabBar } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { Outlet, Route, Routes, useSearchParams } from "react-router-dom";
import { SafariFooter } from "src/components/SafariFooter";
import { getSubgraphUrl } from "src/constants";
import { adjustDateByDays } from "src/helpers/DateHelper";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import {
  PARAM_DAYS,
  PARAM_SUBGRAPH,
  PARAM_TOKEN,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { DEFAULT_DAYS, ProtocolOwnedLiquidityGraph } from "src/views/TreasuryDashboard/components/Graph/TreasuryGraph";

const baseMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

/**
 * Obtains the value of the subgraphId parameter using window.location
 *
 * useSearchParams was previously used, but it was asynchronous and led to
 * data being fetched from the standard subgraph URL before the subgraphId
 * parameter was resolved.
 */
const getSubgraphIdParameter = (): string | undefined => {
  const source = window.location.hash.split(`${PARAM_SUBGRAPH}=`);
  return source.length > 1 && source[1] ? source[1].split("&")[0] : undefined;
};

/**
 * Renders the Treasury Dashboard, which includes metrics, a date filter and charts.
 *
 * @returns
 */
const MetricsDashboard = () => {
  // State variable for the number of days shown, which is passed to the respective charts
  const [daysPrior, setDaysPrior] = useState(DEFAULT_DAYS.toString());
  // State variable for the current token
  const [token, setToken] = useState(PARAM_TOKEN_OHM);

  const startDateString = adjustDateByDays(new Date(), -1 * parseInt(daysPrior))
    .toISOString()
    .split("T")[0];

  // Determine the subgraph URL
  // Originally, this was performed at the component level, but it ended up with a lot of redundant
  // calls to useSearchParams that could have led to wonky behaviour.
  const subgraphUrl = getSubgraphUrl(getSubgraphIdParameter());
  console.debug("Subgraph URL set to " + subgraphUrl);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Get the days from the URL query parameters, or use the default
    const queryDays = searchParams.get(PARAM_DAYS) || DEFAULT_DAYS.toString();
    setDaysPrior(queryDays);

    // Get the token or use the default
    const queryToken = searchParams.get(PARAM_TOKEN) || PARAM_TOKEN_OHM;
    setToken(queryToken);
  }, [searchParams]);

  const sharedMetricProps = { ...baseMetricProps, subgraphUrl: subgraphUrl };

  /**
   * After changing the value for the record count, returns the search parameters as a
   * string (excluding the "?" prefix) that is suitable for appending to a URL.
   *
   * @param recordCount
   * @returns
   */
  const getSearchParamsWithUpdatedRecordCount = (recordCount: number): string => {
    return updateSearchParams(searchParams, PARAM_DAYS, recordCount.toString()).toString();
  };

  /**
   * After changing the value for the token, returns the search parameters as a
   * string (excluding the "?" prefix) that is suitable for appending to a URL.
   *
   * @param recordCount
   * @returns
   */
  const getSearchParamsWithUpdatedToken = (token: string): string => {
    return updateSearchParams(searchParams, PARAM_TOKEN, token).toString();
  };

  const isTokenOHM = (): boolean => {
    return token === PARAM_TOKEN_OHM;
  };

  const isActiveRecordCount = (input: number): boolean => {
    return daysPrior === input.toString();
  };

  const theme = useTheme();
  const hideToggleSidePadding = useMediaQuery(theme.breakpoints.up("md"));
  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));

  const paperProps = {
    fullWidth: true,
  };

  /**
   * We minimise padding on the left and right at smaller screen sizes, in order
   * to maximise space for the graph.
   */
  const paperStyles = {
    ...(hidePaperSidePadding && { paddingLeft: "10px", paddingRight: "10px" }),
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper {...paperProps}>
            {/* <MetricCollection>
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
            </MetricCollection> */}
          </Paper>
        </Grid>
        {/* Custom paddingBottom to make the filter row(s) equidistant from the metrics (above) and
        treasury assets (below). */}
        <Grid item xs={12} container spacing={1} paddingBottom={"29px"}>
          {hideToggleSidePadding ? <></> : <Grid item xs={2} sm={3} />}
          <Grid item xs={8} sm={6} md={5} lg={4} textAlign="center">
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
                  to: `/dashboard?${getSearchParamsWithUpdatedRecordCount(180)}`,
                  isActive: isActiveRecordCount(180),
                },
              ]}
            />
          </Grid>
          <Grid item xs={2} sm={3} md={1} />
          {/* From here onwards will break onto a new line at the "sm" breakpoint or smaller. */}
          <Grid item xs={3} sm={4} md={3} lg={5} />
          {/* <Grid item xs={6} sm={4} md={3} lg={2} textAlign="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: PARAM_TOKEN_OHM,
                  to: `/dashboard?${getSearchParamsWithUpdatedToken(PARAM_TOKEN_OHM)}`,
                  isActive: isTokenOHM(),
                },
                {
                  label: PARAM_TOKEN_GOHM,
                  to: `/dashboard?${getSearchParamsWithUpdatedToken(PARAM_TOKEN_GOHM)}`,
                  isActive: !isTokenOHM(),
                },
              ]}
            />
          </Grid> */}
          {hideToggleSidePadding ? <></> : <Grid item xs={3} sm={4} />}
        </Grid>
        {/* <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <LiquidBackingPerOhmComparisonGraph
              subgraphUrl={subgraphUrl}
              activeToken={token}
              count={parseInt(recordCount)}
            />
          </Paper>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <TreasuryAssets subgraphUrl={subgraphUrl} count={parseInt(recordCount)} />
          </Paper>
        </Grid> */}
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <ProtocolOwnedLiquidityGraph subgraphUrl={subgraphUrl} earliestDate={startDateString} />
          </Paper>
        </Grid>
      </Grid>
      <SafariFooter />
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
