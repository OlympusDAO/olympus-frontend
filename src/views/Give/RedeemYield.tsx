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
import { IAccountSlice } from "src/slices/AccountSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { IAppData } from "src/slices/AppSlice";
import { BigNumber } from "bignumber.js";

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function RedeemYield() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  // TODO fix typing of state.app.loading
  const isAppLoading = useSelector((state: any) => state.app.loading);
  const redeemableBalance = useSelector((state: State) => {
    return state.account.redeeming && state.account.redeeming.sohmRedeemable;
  });

  const stakingAPY = useSelector((state: State) => {
    return state.app.stakingAPY;
  });

  const recipientInfo = useSelector((state: State) => {
    return state.account.redeeming && state.account.redeeming.recipientInfo;
  });

  const stakingRebase = useSelector((state: State) => {
    return state.app.stakingRebase;
  });

  const fiveDayRate = useSelector((state: State) => {
    return state.app.fiveDayRate;
  });

  const redeemableBalanceNumber: BigNumber = new BigNumber(redeemableBalance);

  const totalDeposit = new BigNumber(recipientInfo && recipientInfo.totalDebt ? recipientInfo.totalDebt : 0);

  const stakingRebasePercentage = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(100);
  const nextRewardValue = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(totalDeposit);

  const fiveDayRateValue = new BigNumber(fiveDayRate ? fiveDayRate : 0).multipliedBy(100);

  /**
   * This ensures that the formatted string has a maximum of 4
   * decimal places, while trimming trailing zeroes.
   *
   * @param number
   * @returns string
   */
  const getTrimmedBigNumber = (number: BigNumber) => {
    return number.decimalPlaces(4).toString();
  };

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
    <div className="give-view">
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
                  <TableCell>{isAppLoading ? <Skeleton /> : getTrimmedBigNumber(totalDeposit) + " sOHM"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Redeemable Amount</TableCell>
                  <TableCell>
                    {" "}
                    {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(redeemableBalanceNumber) + " sOHM"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Next Reward Amount</TableCell>
                  {/* TODO correct? */}
                  <TableCell> {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(nextRewardValue) + " sOHM"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Next Reward Yield</TableCell>
                  <TableCell>
                    {" "}
                    {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(stakingRebasePercentage) + "%"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROI (5-Day Rate)</TableCell>
                  <TableCell> {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(fiveDayRateValue) + "%"}</TableCell>
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
    </div>
  );
}
