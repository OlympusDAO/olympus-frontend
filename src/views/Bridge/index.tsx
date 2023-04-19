import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataRow, Paper, Token } from "@olympusdao/component-library";
import PageTitle from "src/components/PageTitle";
import { shorten } from "src/helpers";
import { IHistoryTx, useGetBridgeHistory } from "src/hooks/useBridging";
import { BridgeInputArea } from "src/views/Bridge/components/BridgeInputArea";
import { useGetBridgeTransferredEvents } from "src/views/Bridge/helpers";

const PREFIX = "Bridge";

const classes = {
  dismiss: `${PREFIX}-dismiss`,
  bridgeHistoryHeaderText: `${PREFIX}-bridgeHistoryHeaderText`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.dismiss}`]: {
    fill: theme.colors.primary[300],
  },
}));

const StyledTableHeader = styled(TableHead)(({ theme }) => ({
  [`&.${classes.bridgeHistoryHeaderText}`]: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
}));

/**
 * Component for Displaying BridgeLinks
 */
const Bridge = () => {
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const { data: bridgeHistory } = useGetBridgeHistory();
  console.log("bridge", bridgeHistory);

  const { data: transferEvents } = useGetBridgeTransferredEvents();

  console.log("transferEvents", transferEvents);
  return (
    <>
      <PageTitle name="Bridge" />
      <Box id="bridge-view" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box width="100%" mt="24px">
          <BridgeInputArea />
        </Box>
        <Paper headerText={`Bridging History`}>
          {transferEvents && transferEvents.length > 0 && (
            <BridgeHistory isSmallScreen={isSmallScreen} txs={transferEvents} />
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Bridge;

const BridgeHistory = ({ isSmallScreen, txs }: { isSmallScreen: boolean; txs: IHistoryTx[] }) => {
  console.log("in history", txs);
  return (
    <>
      {txs.map((tx, index) =>
        isSmallScreen ? (
          <MobileHistoryTx tx={tx} key={index} />
        ) : (
          <Table>
            <StyledTableHeader className={classes.bridgeHistoryHeaderText}>
              <TableRow>
                <TableCell style={{ width: "200px", padding: "8px 0" }}>Block Number</TableCell>
                <TableCell style={{ width: "200px", padding: "8px 0" }}>Amount</TableCell>
                <TableCell style={{ width: "150px", padding: "8px 0" }}>Transactions</TableCell>
                <TableCell style={{ width: "150px", padding: "8px 0" }}>Confirmations</TableCell>
              </TableRow>
            </StyledTableHeader>
            <TableBody>
              <HistoryTx tx={tx} key={index} />
            </TableBody>
          </Table>
        ),
      )}
    </>
  );
};

const HistoryTx = ({ tx }: { tx: IHistoryTx }) => {
  console.log("claim Info", tx);
  return (
    <TableRow>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {tx.timestamp}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <Token key={"OHM"} name={"OHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{tx.amount}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {shorten(tx.transactions.sendingChain)}
        </Typography>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {tx.transactions.receivingChain && shorten(tx.transactions.receivingChain)}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {tx.confirmations}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const MobileHistoryTx = ({ tx }: { tx: IHistoryTx }) => {
  // const userBalances = useStakePoolBalance(props.pool);
  // const userBalance = userBalances[props.pool.networkID].data;
  console.log("mobile claim Info", tx);
  return (
    <Box mt="42px">
      {/* StyledPoolInfo */}
      <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
        <Token key={"OHM"} name={"OHM"} />
        <Box marginLeft="14px" marginRight="10px">
          <Typography>{`OHM`}</Typography>
        </Box>
        {/* <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} /> */}
      </Box>
      <DataRow
        title={`Amount`}
        // isLoading={!claim?.gohm}
        balance={tx.amount}
      />
      <DataRow
        title={`Block Number`}
        // isLoading={!warmupDate}
        balance={tx.timestamp}
      />
      <DataRow
        title={`Transaction`}
        // isLoading={!warmupDate}
        balance={shorten(tx.transactions.sendingChain)}
      />
      <DataRow
        title={`Confirmations`}
        // isLoading={!warmupDate}
        balance={tx.confirmations}
      />
    </Box>
  );
};
