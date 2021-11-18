import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Button,
  Zoom,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import { redeemBalance } from "../../slices/RedeemThunk";
import { Skeleton } from "@material-ui/lab";
import { trim } from "src/helpers";

export default function RedeemYield() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const redeemableBalance = useSelector(state => {
    return state.account.redeeming && state.account.redeeming.sohmRedeemable;
  });

  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });

  const recipientInfo = useSelector(state => {
    return state.account.redeeming && state.account.redeeming.recipientInfo;
  });

  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });

  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });

  const trim4 = input => {
    return trim(input, 4);
  };

  const totalDeposit = recipientInfo && recipientInfo.totalDebt ? recipientInfo.totalDebt : 0;

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * totalDeposit, 4);

  const trimmedFiveDayRate = trim(fiveDayRate * 100, 4);

  const isRecipientInfoLoading = recipientInfo === undefined;

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

  const canRedeem = () => {
    if (!address) return false;

    // If the available amount is 0
    if (!redeemableBalance) return false;

    return true;
  };

  const handleRedeemButtonClick = async () => {
    await dispatch(redeemBalance({ address, provider, networkID: chainID }));
  };

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">Redeem Yield</Typography>
        </div>
        <TableContainer className="redeem-table">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Donated sOHM Generating Yield</TableCell>
                <TableCell>{isAppLoading ? <Skeleton /> : trim4(totalDeposit) + " sOHM"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Redeemable Amount</TableCell>
                <TableCell> {isAppLoading ? <Skeleton /> : trim4(redeemableBalance) + " sOHM"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Next Reward Amount</TableCell>
                <TableCell> {isAppLoading ? <Skeleton /> : trim4(nextRewardValue) + " sOHM"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Next Reward Yield</TableCell>
                <TableCell> {isAppLoading ? <Skeleton /> : stakingRebasePercentage + "%"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ROI (5-Day Rate)</TableCell>
                <TableCell> {isAppLoading ? <Skeleton /> : trimmedFiveDayRate + "%"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">
                  {" "}
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="redeem-button"
                    onClick={() => handleRedeemButtonClick()}
                    disabled={!canRedeem()}
                  >
                    Redeem
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Typography variant="body1">Press the redeem below to transfer the yield into your wallet.</Typography> */}
      </Paper>
    </Zoom>
  );
}
