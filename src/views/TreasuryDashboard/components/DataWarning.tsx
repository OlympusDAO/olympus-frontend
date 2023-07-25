import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getISO8601String } from "src/helpers/DateHelper";
import { TokenRecord, useTokenRecordsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

const getDateFromTimestamp = (timestamp: string): Date => {
  return new Date(+timestamp * 1000);
};

/**
 * React Component that displays the latest date for each chain's data.
 */
const DataWarning = (): JSX.Element => {
  const theme = useTheme();
  const columnHeaderColor = theme.palette.text.primary;

  const isBreakpointSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Query hooks
  // This will get the absolute latest records from each blockchain, without any filtering
  const { data: latestRecordsQuery } = useTokenRecordsLatestQuery();

  // State variables
  const [isWarningEnabled, setIsWarningEnabled] = useState(false);
  const [latestCompleteDate, setLatestCompleteDate] = useState<string>();
  const [latestRecords, setLatestRecords] = useState<TokenRecord[]>([]);

  const laggingColorStyle = { background: "orange" };

  useEffect(() => {
    // Still loading
    if (!latestRecordsQuery || !latestRecordsQuery.length) {
      return;
    }

    // If the date field on each record is the same, then we can assume that the data is up-to-date
    const latestDate = latestRecordsQuery[0].date;
    const isUpToDate = latestRecordsQuery.every(record => record.date === latestDate);
    setIsWarningEnabled(!isUpToDate);

    // Get the earliest date from the latest records
    setLatestCompleteDate(
      latestRecordsQuery.reduce((earliest, record) => {
        if (record.date < earliest) {
          return record.date;
        }
        return earliest;
      }, latestRecordsQuery[0].date),
    );

    // Sort by the blockchain name
    setLatestRecords(latestRecordsQuery.sort((a, b) => a.blockchain.localeCompare(b.blockchain)));
  }, [latestRecordsQuery]);

  return (
    <Grid container>
      <Grid item xs={12} textAlign="center">
        {/* Consistent with heading titles of the other components in the TreasuryDashboard. See ChartCard. */}
        <Typography variant="h6" color="textSecondary" display="inline">
          Data Accuracy
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          // Consistent with the fontSize of TreasuryAssetsTable
          fontSize: "14px",
          lineHeight: "20px",
        }}
        style={{
          maxWidth: "80ch", // Limit width and improve readability
          margin: "0 auto", // Centers
        }}
      >
        The data on this dashboard is sourced from subgraphs on each blockchain that are periodically updated.
        <br />
        <br />
        The latest date for which data is complete is: {latestCompleteDate || <Skeleton width="20px" />}
        {isWarningEnabled && (
          <>
            One or more of the subgraphs is currently out of date, which is affecting the accuracy of the data shown
            here.
          </>
        )}
      </Grid>
      <Grid item xs={12} container wrap={"nowrap"}>
        {isBreakpointSmall ? <></> : <Grid item m={2} />}
        <Grid item sm={12} m={8} style={{ margin: "0px" }}>
          <Table
            sx={{
              "& .MuiTableCell-head": {
                fontSize: "16px",
                color: columnHeaderColor,
              },
              "& .MuiTableCell-body": {
                fontSize: "14px",
                height: "30px",
                paddingTop: "0px",
                paddingBottom: "0px",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Blockchain</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Block</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestRecords.length ? (
                latestRecords.map(record => (
                  <TableRow
                    style={{
                      // If the current timestamp is equal to the value of latestCompleteDate, then it is the lagging blockchain and should be highlighted
                      ...(isWarningEnabled &&
                      getISO8601String(getDateFromTimestamp(record.timestamp)) == latestCompleteDate
                        ? laggingColorStyle
                        : {}),
                    }}
                    key={record.id}
                  >
                    <TableCell>{record.blockchain}</TableCell>
                    <TableCell>{getDateFromTimestamp(record.timestamp).toUTCString()}</TableCell>
                    <TableCell>{record.block}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
        {isBreakpointSmall ? <></> : <Grid item m={2} />}
      </Grid>
    </Grid>
  );
};

export default DataWarning;
