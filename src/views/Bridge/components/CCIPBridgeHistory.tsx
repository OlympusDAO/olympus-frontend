import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import { Box, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataRow, OHMTokenProps, TextButton, Token } from "@olympusdao/component-library";
import { shorten } from "src/helpers";
import { useGetDateTimeFromBlockNumber } from "src/helpers/timeUtil";
import { ICCIPHistoryTx } from "src/hooks/useCCIPBridgeHistory";

const PREFIX = "CCIPBridgeHistory";

const classes = {
  bridgeHistoryHeaderText: `${PREFIX}-bridgeHistoryHeaderText`,
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

interface CCIPBridgeHistoryProps {
  txs: ICCIPHistoryTx[];
  isSmallScreen: boolean;
}

export const CCIPBridgeHistory = ({ txs, isSmallScreen }: CCIPBridgeHistoryProps) => {
  if (txs.length === 0) {
    return (
      <Typography style={{ lineHeight: 1.4, fontWeight: 300, fontSize: "12px", color: "#8A8B90" }}>
        You have not bridged any OHM via CCIP recently.
      </Typography>
    );
  }

  return (
    <>
      {isSmallScreen ? (
        <>
          {txs.map((tx, index) => (
            <MobileCCIPHistoryTx tx={tx} key={index} />
          ))}
        </>
      ) : (
        <Table>
          <StyledTableHeader className={classes.bridgeHistoryHeaderText}>
            <TableRow>
              <TableCell width="30px"></TableCell>
              <TableCell style={{ padding: "8px 24px 8px 0" }}>Timestamp</TableCell>
              <TableCell style={{ padding: "8px 0" }}>Message ID</TableCell>
              <TableCell style={{ padding: "8px 0" }}>Amount</TableCell>
              <TableCell style={{ padding: "8px 0" }}>Status</TableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {txs.map((tx, index) => (
              <CCIPHistoryTx tx={tx} key={index} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

const NetworkIcon = ({ chainName }: { chainName: string }) => {
  // Map chain names to appropriate tokens/avatars
  const getTokenName = (chain: string): OHMTokenProps["name"] => {
    switch (chain.toLowerCase()) {
      case "ethereum":
      case "mainnet":
        return "ETH";
      case "arbitrum":
        return "ARBITRUM";
      case "solana":
        return "OHM"; // Use OHM as fallback since SOLANA token type doesn't exist
      default:
        return "OHM";
    }
  };

  return <Token name={getTokenName(chainName)} />;
};

// Utility function to format OHM amounts for display
const formatOHMAmount = (amount: string): string => {
  console.log("amount", amount);
  try {
    const numAmount = parseFloat(amount);

    // Handle very small amounts (show more decimal places)
    if (numAmount < 0.001 && numAmount > 0) {
      return numAmount.toFixed(6);
    }

    // Handle normal amounts (show up to 3 decimal places, remove trailing zeros)
    if (numAmount < 1000) {
      return numAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      });
    }

    // Handle large amounts (show up to 2 decimal places with thousand separators)
    return numAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    // Fallback: return the original amount if parsing fails
    console.warn(`Error formatting amount: ${amount}`, error);
    return amount;
  }
};

const CCIPHistoryTx = ({ tx }: { tx: ICCIPHistoryTx }) => {
  const { data: dateTime } = useGetDateTimeFromBlockNumber({
    blockNumber: tx.timestamp,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#4CAF50";
      case "failed":
        return "#F44336";
      case "pending":
        return "#FF9800";
      default:
        return "#8A8B90";
    }
  };

  const isOutgoing = tx.fromAddress.toLowerCase() === tx.fromAddress.toLowerCase(); // This would need proper address comparison

  return (
    <TableRow>
      <TableCell align="right">
        <NetworkIcon chainName={tx.fromChain} />
      </TableCell>
      <TableCell style={{ padding: "8px 24px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {tx.isUnixTimestamp
            ? new Date(parseInt(tx.timestamp)).toLocaleDateString()
            : dateTime && dateTime.dateTime
              ? dateTime.dateTime.toFormat("LL.dd.yyyy")
              : tx.timestamp}
        </Typography>
        <Typography
          gutterBottom={false}
          style={{ lineHeight: 1.4, fontWeight: 300, fontSize: "12px", color: "#8A8B90" }}
        >
          {tx.isUnixTimestamp
            ? new Date(parseInt(tx.timestamp)).toLocaleTimeString()
            : dateTime && dateTime.dateTime && dateTime.dateTime.toFormat("HH:mm ZZZZ")}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center" gap="4px">
          <SvgIcon
            sx={{ marginBottom: "4px" }}
            fontSize="small"
            component={isOutgoing ? VerticalAlignTopIcon : VerticalAlignBottomIcon}
          />
          <StyledTextButton href={tx.ccipExplorerUrl} target="_blank" rel="noopener noreferrer">
            {shorten(tx.messageId)}
          </StyledTextButton>
        </Box>
        <Typography
          gutterBottom={false}
          style={{ lineHeight: 1.4, fontWeight: 300, fontSize: "10px", color: "#8A8B90" }}
        >
          {tx.fromChain} → {tx.toChain}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <Token key={"OHM"} name={"OHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{`${formatOHMAmount(tx.amount)} OHM`}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography
          gutterBottom={false}
          style={{ lineHeight: 1.4, color: getStatusColor(tx.status), textTransform: "capitalize" }}
        >
          {tx.status}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const MobileCCIPHistoryTx = ({ tx }: { tx: ICCIPHistoryTx }) => {
  const { data: dateTime } = useGetDateTimeFromBlockNumber({
    blockNumber: tx.timestamp,
  });
  const isOutgoing = tx.fromAddress.toLowerCase() === tx.fromAddress.toLowerCase(); // This would need proper address comparison

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#4CAF50";
      case "failed":
        return "#F44336";
      case "pending":
        return "#FF9800";
      default:
        return "#8A8B90";
    }
  };

  return (
    <Box mt="42px">
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
          <NetworkIcon chainName={tx.fromChain} />
          <SvgIcon
            sx={{ marginBottom: "4px" }}
            fontSize="small"
            component={isOutgoing ? VerticalAlignTopIcon : VerticalAlignBottomIcon}
          />
        </Box>
      </Box>
      <DataRow title={`Amount`} balance={`${formatOHMAmount(tx.amount)} OHM`} />
      <DataRow
        title={`Timestamp`}
        balance={
          tx.isUnixTimestamp
            ? new Date(parseInt(tx.timestamp)).toLocaleString()
            : dateTime && dateTime.dateTime
              ? dateTime.dateTime.toFormat("LL.dd.yyyy HH:mm ZZZZ")
              : tx.timestamp
        }
      />
      <DataRow
        title={`Message ID`}
        balance={
          <StyledTextButton
            sx={{ height: "24px !important" }}
            href={tx.ccipExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shorten(tx.messageId)}
          </StyledTextButton>
        }
      />
      <DataRow title={`Route`} balance={`${tx.fromChain} → ${tx.toChain}`} />
      <DataRow
        title={`Status`}
        balance={
          <Typography style={{ color: getStatusColor(tx.status), textTransform: "capitalize" }}>{tx.status}</Typography>
        }
      />
    </Box>
  );
};
