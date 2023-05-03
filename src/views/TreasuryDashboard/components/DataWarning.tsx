import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaginatedTokenRecord, useTokenRecordsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

/**
 * React Component that renders the contents of a Markdown file
 * and displays them in a notification banner.
 */
const DataWarning = (): JSX.Element => {
  // Query hooks
  const { data: latestRecordsQuery } = useTokenRecordsLatestQuery();

  // State variables
  const [isWarningEnabled, setIsWarningEnabled] = useState(false);
  const [latestCompleteDate, setLatestCompleteDate] = useState<string>();
  const [latestRecords, setLatestRecords] = useState<PaginatedTokenRecord[]>([]);

  useEffect(() => {
    // Still loading
    if (!latestRecordsQuery) {
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

  if (!isWarningEnabled) {
    return <></>;
  }

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
        <p>
          The data on this dashboard is sourced from subgraphs on each blockchain that are periodically updated. One or
          more of the subgraphs is currently out of date, which is affecting the accuracy of the data shown here.
        </p>
        <p>The latest date for which data is complete is: {latestCompleteDate || <Skeleton width="20px" />}</p>
      </Grid>
      <Grid item xs={8} alignItems="center">
        {/* Center-align */}
        <TableContainer>
          <Table>
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
                  <TableRow>
                    <TableCell>{record.blockchain}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.block}</TableCell>
                  </TableRow>
                ))
              ) : (
                <Skeleton />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default DataWarning;
