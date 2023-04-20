import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import {
  Box,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataRow, Paper, TextButton, Token } from "@olympusdao/component-library";
import PageTitle from "src/components/PageTitle";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { useGetDateTimeFromBlockNumber } from "src/helpers/timeUtil";
import { IHistoryTx, useGetBridgeTransferredEvents } from "src/hooks/useBridging";
import { BridgeInputArea } from "src/views/Bridge/components/BridgeInputArea";
import { useNetwork } from "wagmi";

const PREFIX = "Bridge";

const classes = {
  dismiss: `${PREFIX}-dismiss`,
  bridgeHistoryHeaderText: `${PREFIX}-bridgeHistoryHeaderText`,
  root: `${PREFIX}-root`,
};

const StyledTextButton = styled(TextButton)(({ theme }) => ({
  [`&.custom-root`]: {
    fontWeight: 400,
    padding: "0px !important",
    margin: "0px !important",
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
  const { data: transferEvents } = useGetBridgeTransferredEvents(5);

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
  return (
    <>
      {isSmallScreen ? (
        <>
          {txs.map((tx, index) => (
            <MobileHistoryTx tx={tx} key={index} />
          ))}
        </>
      ) : (
        <Table>
          <StyledTableHeader className={classes.bridgeHistoryHeaderText}>
            <TableRow>
              <TableCell width="30px"></TableCell>
              <TableCell style={{ padding: "8px 24px 8px 0" }}>Timestamp</TableCell>

              <TableCell style={{ padding: "8px 0" }}>Transactions</TableCell>
              <TableCell style={{ padding: "8px 0" }}>Amount</TableCell>

              <TableCell style={{ padding: "8px 0" }}>Confirmations</TableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {txs.map((tx, index) => (
              <HistoryTx tx={tx} key={index} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

const NetworkIcon = ({ chainId }: { chainId: keyof typeof BRIDGE_CHAINS }) => {
  const bridgeChain = BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS];
  return (
    <div
      style={{
        background: bridgeChain.iconBackground,
        width: 24,
        height: 24,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      {bridgeChain.iconUrl && (
        <img alt={bridgeChain.name ?? "chain icon"} src={bridgeChain.iconUrl} style={{ width: 24, height: 24 }} />
      )}
    </div>
  );
};

const HistoryTx = ({ tx }: { tx: IHistoryTx }) => {
  console.log("claim Info", tx);
  const { chain } = useNetwork();
  const { data: dateTime } = useGetDateTimeFromBlockNumber({ blockNumber: tx.timestamp });
  console.log("dateTime", dateTime);
  return (
    <TableRow>
      <TableCell align="right">
        <NetworkIcon chainId={tx.chainId} />
      </TableCell>
      <TableCell style={{ padding: "8px 24px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {dateTime && dateTime.dateTime ? dateTime.dateTime.toFormat("LL.dd.yyyy") : tx.timestamp}
        </Typography>
        <Typography
          gutterBottom={false}
          style={{ lineHeight: 1.4, fontWeight: 300, fontSize: "12px", color: "#8A8B90" }}
        >
          {dateTime && dateTime.dateTime && dateTime.dateTime.toFormat("HH:mm ZZZZ")}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        {chain && chain.blockExplorers ? (
          <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center" gap="4px">
            <SvgIcon
              sx={{ marginBottom: "4px" }}
              fontSize="small"
              component={tx.send ? VerticalAlignTopIcon : VerticalAlignBottomIcon}
            />
            <StyledTextButton
              href={`${chain.blockExplorers.default.url}/tx/${tx.transactions.sendingChain}`}
              target="_blank"
            >
              {shorten(tx.transactions.sendingChain)}
            </StyledTextButton>
          </Box>
        ) : (
          <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
            {shorten(tx.transactions.sendingChain)}
          </Typography>
        )}
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {tx.transactions.receivingChain && shorten(tx.transactions.receivingChain)}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <Token key={"OHM"} name={"OHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{`${tx.amount} OHM`}</Typography>
          </Box>
        </Box>
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
  const { chain } = useNetwork();
  const { data: dateTime } = useGetDateTimeFromBlockNumber({ blockNumber: tx.timestamp });

  return (
    <Box mt="42px">
      {/* StyledPoolInfo */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ whiteSpace: "nowrap" }}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Token key={"OHM"} name={"OHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{`OHM`}</Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap="4px">
          <NetworkIcon chainId={tx.chainId} />
          <SvgIcon
            sx={{ marginBottom: "4px" }}
            fontSize="small"
            component={tx.send ? VerticalAlignTopIcon : VerticalAlignBottomIcon}
          />
        </Box>
      </Box>
      <DataRow
        title={`Amount`}
        // isLoading={!claim?.gohm}
        balance={`${tx.amount} OHM`}
      />
      <DataRow
        title={`Timestamp`}
        // isLoading={!warmupDate}
        balance={dateTime && dateTime.dateTime ? dateTime.dateTime.toFormat("LL.dd.yyyy HH:mm ZZZZ") : tx.timestamp}
      />
      <DataRow
        title={`Transaction`}
        // isLoading={!warmupDate}
        balance={
          <>
            {chain && chain.blockExplorers ? (
              <StyledTextButton
                sx={{ height: "24px !important" }}
                href={`${chain.blockExplorers.default.url}/tx/${tx.transactions.sendingChain}`}
                target="_blank"
              >
                {shorten(tx.transactions.sendingChain)}
              </StyledTextButton>
            ) : (
              <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
                {shorten(tx.transactions.sendingChain)}
              </Typography>
            )}
          </>
        }
      />
      <DataRow
        title={`Confirmations`}
        // isLoading={!warmupDate}
        balance={tx.confirmations}
      />
    </Box>
  );
};
