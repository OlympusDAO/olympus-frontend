import { Box, Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Metric, MetricCollection, Paper, TabBar } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { Outlet, Route, Routes, useSearchParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { SafariFooter } from "src/components/SafariFooter";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import DataWarning from "src/views/TreasuryDashboard/components/DataWarning";
import {
  DEFAULT_DAYS,
  PARAM_DAYS,
  PARAM_DAYS_OFFSET,
  PARAM_TOKEN,
  PARAM_TOKEN_GOHM,
  PARAM_TOKEN_OHM,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { LiquidBackingPerOhmComparisonGraph } from "src/views/TreasuryDashboard/components/Graph/LiquidBackingComparisonGraph";
import { OhmSupply } from "src/views/TreasuryDashboard/components/Graph/OhmSupply";
import { ProtocolOwnedLiquidityGraph } from "src/views/TreasuryDashboard/components/Graph/OwnedLiquidityGraph";
import { TreasuryAssets } from "src/views/TreasuryDashboard/components/Graph/TreasuryAssets";
import KnownIssues from "src/views/TreasuryDashboard/components/KnownIssues/KnownIssues";
import {
  AbstractedMetricProps,
  BackingPerGOHM,
  BackingPerOHM,
  CurrentIndex,
  GOhmCirculatingSupply,
  GOHMPriceFromSubgraph,
  MarketCap,
  MetricSubgraphProps,
  OhmCirculatingSupply,
  OHMPriceFromSubgraph,
} from "src/views/TreasuryDashboard/components/Metric/Metric";

const baseMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

/**
 * Renders the Treasury Dashboard, which includes metrics, a date filter and charts.
 *
 * @returns
 */
const MetricsDashboard = () => {
  // State variable for the number of days shown, which is passed to the respective charts
  const [daysPrior, setDaysPrior] = useState<string | null>(null);
  /**
   * daysPrior is set through the `useSearchParams` hook, which loads
   * asynchronously, so we set the initial value of daysPrior and earliestDate to null. Child components are designed to recognise this
   * and not load data until earliestDate is a valid value.
   */
  const earliestDate = !daysPrior ? null : getISO8601String(adjustDateByDays(new Date(), -1 * parseInt(daysPrior)));
  /**
   * State variable for the number of days to offset each subgraph query with.
   *
   * This should be a negative number.
   *
   * If the number is too large and the results of any query page are greater than 1000, clipping
   * will take place.
   */
  const [daysOffset, setDaysOffset] = useState<number | undefined>(undefined);

  // State variable for the current token
  const [token, setToken] = useState(PARAM_TOKEN_OHM);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Get the days from the URL query parameters, or use the default
    const queryDays = searchParams.get(PARAM_DAYS) || DEFAULT_DAYS.toString();
    setDaysPrior(queryDays);

    // Get the token or use the default
    const queryToken = searchParams.get(PARAM_TOKEN) || PARAM_TOKEN_OHM;
    setToken(queryToken);

    // Get the days offset
    const offset = searchParams.get(PARAM_DAYS_OFFSET);
    if (offset) {
      const offsetInt = parseInt(offset);
      console.info(`Setting days offset to ${offsetInt}`);
      setDaysOffset(offsetInt);
    }
  }, [searchParams]);

  // Used by the Metrics
  const sharedMetricProps: AbstractedMetricProps & MetricSubgraphProps = {
    ...baseMetricProps,
    earliestDate: earliestDate,
  };

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
    enableBackground: true,
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
          <Grid item xs={6} sm={4} md={3} lg={2} textAlign="center">
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
          </Grid>
          {hideToggleSidePadding ? <></> : <Grid item xs={3} sm={4} />}
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <LiquidBackingPerOhmComparisonGraph
              activeToken={token}
              earliestDate={earliestDate}
              subgraphDaysOffset={daysOffset}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <TreasuryAssets earliestDate={earliestDate} subgraphDaysOffset={daysOffset} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <ProtocolOwnedLiquidityGraph earliestDate={earliestDate} subgraphDaysOffset={daysOffset} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <OhmSupply earliestDate={earliestDate} subgraphDaysOffset={daysOffset} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <DataWarning />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <KnownIssues />
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
    <>
      <PageTitle name="Dashboard" />

      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Outlet />
      </Container>
    </>
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
