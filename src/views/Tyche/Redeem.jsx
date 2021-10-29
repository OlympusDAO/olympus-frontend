import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Paper,
  Typography,
  Button,
  Zoom,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";

export default function Redeem() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const [redeemableAmount, setRedeemableAmount] = useState(20);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      //   loadLusdData();
    }
  }, [walletChecked]);

  // TODO fetch available amount and set redeemable amount variable

  // TODO fetch list of donations and senders for the current wallet address
  const donations = [
    { sender: "0x1", depositAmount: 2.0 },
    { sender: "0x2", depositAmount: 1.0 },
  ];

  const canRedeem = () => {
    if (!address) return false;

    // If the available amount is 0
    if (!redeemableAmount) return false;

    return true;
  };

  const handleRedeemButtonClick = () => {
    // TODO smart contract integration
  };

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">Redeem Yield</Typography>
        </div>
        <Typography variant="body1">
          The listed wallets have deposited staked OHM that is generating yield for you.
        </Typography>
        <Typography variant="body1">Press the redeem button below to transfer the yield into your wallet.</Typography>
        <TableContainer className="stake-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sender</TableCell>
                <TableCell align="left">
                  Deposit
                  <InfoTooltip message="The amount of sOHM deposited" />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations.map(item => {
                return (
                  <TableRow>
                    <TableCell>{item.sender}</TableCell>
                    <TableCell>{item.depositAmount}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h5">
          Available to Redeem: {redeemableAmount ? redeemableAmount + " sOHM" : "N/A"}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          className="redeem-button"
          onClick={() => handleRedeemButtonClick()}
          disabled={!canRedeem()}
        >
          Redeem
        </Button>
      </Paper>
    </Zoom>
  );
}
