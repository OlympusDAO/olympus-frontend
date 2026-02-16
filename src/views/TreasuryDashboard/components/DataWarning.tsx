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
import { ChainValues } from "@olympusdao/treasury-subgraph-client";
import { useEffect, useState } from "react";
import { TokenRecord, useTokenRecordsLatestQuery } from "src/hooks/useFederatedSubgraphQuery";

// Expected blockchains for the treasury dashboard - derived from ChainValues type keys
const EXPECTED_BLOCKCHAINS: (keyof ChainValues)[] = ["Arbitrum", "Base", "Berachain", "Ethereum", "Fantom", "Polygon"];

const getDateFromTimestamp = (timestamp: string | number): Date => {
  return new Date(+timestamp * 1000);
};

/**
 * React Component that displays the latest date for each chain's data.
 */
const DataWarning = ({ ignoreCache }: { ignoreCache?: boolean }): JSX.Element => {
  const theme = useTheme();
  const columnHeaderColor = theme.palette.text.primary;

  const isBreakpointSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Query hooks
  // This will get the absolute latest records from each blockchain, without any filtering
  const { data: latestRecordsQuery } = useTokenRecordsLatestQuery({ ignoreCache });

  // State variables
  const [isWarningEnabled, setIsWarningEnabled] = useState(false);
  const [latestCompleteDate, setLatestCompleteDate] = useState<string>();
  const [latestDate, setLatestDate] = useState<string>();
  const [latestRecords, setLatestRecords] = useState<TokenRecord[]>([]);

  const laggingColorStyle = { background: "orange" };

  useEffect(() => {
    // Still loading
    if (!latestRecordsQuery) {
      return;
    }

    // Create a map of existing blockchain data for easy lookup
    const recordsMap = new Map<string, TokenRecord>();
    latestRecordsQuery.forEach(record => {
      recordsMap.set(record.blockchain, record);
    });

    // Build complete list of expected blockchains, using actual data or creating placeholders
    const completeRecords: TokenRecord[] = EXPECTED_BLOCKCHAINS.map(blockchain => {
      const existingRecord = recordsMap.get(blockchain);
      if (existingRecord) {
        return existingRecord;
      }
      // Create placeholder record for missing blockchain data
      return {
        id: `placeholder-${blockchain}`,
        blockchain,
        timestamp: "",
        block: "",
        date: "",
      } as TokenRecord;
    });

    // Determine if all chains have data (non-empty timestamps)
    const chainsWithData = completeRecords.filter(record => record.timestamp !== "");
    const isAllDataComplete = chainsWithData.length === EXPECTED_BLOCKCHAINS.length;

    // If we have data but not all chains are complete, enable warning
    if (chainsWithData.length > 0) {
      const maxDate = chainsWithData.reduce((latest, record) => {
        if (record.date > latest) {
          return record.date;
        }
        return latest;
      }, chainsWithData[0].date);

      const minDate = chainsWithData.reduce((earliest, record) => {
        if (record.date < earliest) {
          return record.date;
        }
        return earliest;
      }, chainsWithData[0].date);

      const isUpToDate = chainsWithData.every(record => record.date === maxDate);
      setIsWarningEnabled(!isUpToDate || !isAllDataComplete);

      setLatestDate(maxDate);
      setLatestCompleteDate(minDate);
    }

    // Sort by the blockchain name
    setLatestRecords(completeRecords.sort((a, b) => a.blockchain.localeCompare(b.blockchain)));
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
                latestRecords.map(record => {
                  const hasData = record.timestamp !== "";
                  const isLagging = hasData && isWarningEnabled && record.date !== latestDate;

                  return (
                    <TableRow
                      style={{
                        // Highlight lagging chains (with data but outdated) or missing data chains
                        ...(isLagging || !hasData ? laggingColorStyle : {}),
                      }}
                      key={record.id}
                    >
                      <TableCell>{record.blockchain}</TableCell>
                      <TableCell>
                        {hasData ? getDateFromTimestamp(record.timestamp).toUTCString() : "No data"}
                      </TableCell>
                      <TableCell>{hasData ? record.block : "No data"}</TableCell>
                    </TableRow>
                  );
                })
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
