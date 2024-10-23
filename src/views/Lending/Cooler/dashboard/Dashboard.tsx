import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Paper, TabBar } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetEarliestSnapshot } from "src/generated/coolerLoans";
import { adjustDateByDays } from "src/helpers/DateHelper";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { IncomeGraph } from "src/views/Lending/Cooler/dashboard/IncomeGraph";
import { MaturityGraph } from "src/views/Lending/Cooler/dashboard/MaturityGraph";
import { UtilisationGraph } from "src/views/Lending/Cooler/dashboard/UtilisationGraph";

const PARAM_DAYS = "days";
const DEFAULT_DAYS = 30;
// Needs to be different from other values, otherwise two tabs will be active
const MAX_DAYS_UNSET = 181;

export const CoolerDashboard = () => {
  const theme = useTheme();
  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch the date of the earliest snapshot
  const { data: earliestSnapshot } = useGetEarliestSnapshot();
  const [daysPriorMax, setDaysPriorMax] = useState<number>(MAX_DAYS_UNSET);
  useEffect(() => {
    if (!earliestSnapshot || !earliestSnapshot.record) {
      console.log(`No earliest snapshot found, setting max days prior to ${MAX_DAYS_UNSET}`);
      setDaysPriorMax(MAX_DAYS_UNSET);
      return;
    }

    const earliestDate = new Date(earliestSnapshot.record.snapshotDate);
    // Get the difference in days between the earliest date and today
    const diffInDays = Math.floor((Date.now() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
    setDaysPriorMax(diffInDays);
  }, [earliestSnapshot]);

  /**
   * Date selection
   */
  const [daysPrior, setDaysPrior] = useState<string | undefined>();
  /**
   * daysPrior is set through the `useSearchParams` hook, which loads
   * asynchronously, so we set the initial value of daysPrior and earliestDate to null. Child components are designed to recognise this
   * and not load data until earliestDate is a valid value.
   */
  const startDate: Date | undefined = !daysPrior ? undefined : adjustDateByDays(new Date(), -1 * parseInt(daysPrior));

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

  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Get the days from the URL query parameters, or use the default
    const queryDays = searchParams.get(PARAM_DAYS) || DEFAULT_DAYS.toString();
    setDaysPrior(queryDays);
  }, [searchParams]);

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

  const isActiveRecordCount = (input: number): boolean => {
    return daysPrior === input.toString();
  };

  return (
    <div id="cooler-metrics">
      <Grid container spacing={1} paddingTop={2}>
        {/* Line one */}
        <Grid item xs />
        <Grid item xs={12} sm={8} md={6} lg={6} textAlign="center" paddingBottom={2}>
          <TabBar
            disableRouting
            items={[
              {
                label: "7d",
                to: `/lending/cooler?${getSearchParamsWithUpdatedRecordCount(7)}`,
                isActive: isActiveRecordCount(7),
              },
              {
                label: "30d",
                to: `/lending/cooler?${getSearchParamsWithUpdatedRecordCount(30)}`,
                isActive: isActiveRecordCount(30),
              },
              {
                label: "90d",
                to: `/lending/cooler?${getSearchParamsWithUpdatedRecordCount(90)}`,
                isActive: isActiveRecordCount(90),
              },
              {
                label: "180d",
                to: `/lending/cooler?${getSearchParamsWithUpdatedRecordCount(180)}`,
                isActive: isActiveRecordCount(180),
              },
              {
                label: "Max",
                to: `/lending/cooler?${getSearchParamsWithUpdatedRecordCount(daysPriorMax)}`,
                isActive: isActiveRecordCount(daysPriorMax),
              },
            ]}
          />
        </Grid>
        <Grid item xs />
        {/* Each of the following is on lines of their own */}
        <Grid item xs={12} paddingBottom={5}>
          <Paper {...paperProps} style={paperStyles}>
            <UtilisationGraph startDate={startDate} />
          </Paper>
        </Grid>
        <Grid item xs={12} paddingBottom={5}>
          <Paper {...paperProps} style={paperStyles}>
            <IncomeGraph startDate={startDate} />
          </Paper>
        </Grid>
        <Grid item xs={12} paddingBottom={5}>
          <Paper {...paperProps} style={paperStyles}>
            <MaturityGraph />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
