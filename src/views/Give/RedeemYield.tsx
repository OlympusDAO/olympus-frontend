import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Box,
  Typography,
  Button,
  Zoom,
  Link,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Container,
  SvgIcon,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { Skeleton } from "@material-ui/lab";
import { IAccountSlice, loadAccountDetails } from "src/slices/AccountSlice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { IAppData } from "src/slices/AppSlice";
import { BigNumber } from "bignumber.js";
import { t, Trans } from "@lingui/macro";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import { VaultGraphic, ArrowGraphic, RedeemGraphic } from "../../components/EducationCard";
import { RedeemCancelCallback, RedeemYieldModal, RedeemSubmitCallback } from "./RedeemYieldModal";
import { useAppSelector } from "src/hooks";
import { ChevronLeft } from "@material-ui/icons";
import { EnvHelper } from "src/helpers/Environment";

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function RedeemYield() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // TODO fix typing of state.app.loading
  const isAppLoading = useSelector((state: any) => state.app.loading);

  const donationInfo = useSelector((state: State) => {
    return networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const redeemableBalance = useSelector((state: State) => {
    return networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.sohmRedeemable
      : state.account.redeeming && state.account.redeeming.sohmRedeemable;
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

  const pendingTransactions = useSelector((state: State) => {
    return state.pendingTransactions;
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

  const isRecipientInfoLoading = recipientInfo.totalDebt == "";

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
    if (connected) {
      loadAccountDetails({ networkID: networkId, provider, address });
    }
  }, [connected]);

  const getTableCellClass = (condition: boolean): string => {
    return condition ? "" : "cell-align-end";
  };

  const canRedeem = () => {
    if (!address) return false;

    if (isRecipientInfoLoading) return false;

    if (isPendingTxn(pendingTransactions, "redeeming")) return false;

    if (redeemableBalanceNumber.isEqualTo(0))
      // If the available amount is 0
      return false;

    return true;
  };

  const handleRedeemButtonClick = () => {
    setIsRedeemYieldModalOpen(true);
  };

  const handleRedeemYieldModalSubmit = async () => {
    if (networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(redeemMockBalance({ address, provider, networkID: networkId }));
    } else {
      await dispatch(redeemBalance({ address, provider, networkID: networkId }));
    }
    setIsRedeemYieldModalOpen(false);
  };

  const handleRedeemYieldModalCancel: RedeemCancelCallback = () => {
    setIsRedeemYieldModalOpen(false);
  };

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
      }}
    >
      <Box className={`give-subnav ${isSmallScreen && "smaller"}`}>
        <Link component={NavLink} id="give-sub-dash" to="/give" className="give-option">
          <SvgIcon component={ChevronLeft} />
          <Typography variant="h6">Back</Typography>
        </Link>
        {donationInfo && Object.keys(donationInfo).length > 0 ? (
          <Link component={NavLink} id="give-sub-donations" to="/give/donations" className="give-option">
            <Typography variant="h6">My Donations</Typography>
          </Link>
        ) : (
          <></>
        )}
        <Link component={NavLink} id="give-sub-redeem" to="/give/redeem" className="give-option">
          <Typography variant="h6">Redeem</Typography>
        </Link>
      </Box>
      <div id="give-view">
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="card-header">
              <div className="give-yield-title">
                <Typography variant="h5">
                  <Trans>Redeem Yield</Trans>
                </Typography>
                <InfoTooltip
                  message={t`If other wallets have directed their sOHM rebases to you, you can transfer that yield into your wallet.`}
                  children={null}
                />
              </div>
              <div className="give-education">
                <VaultGraphic
                  quantity={isRecipientInfoLoading ? "0" : totalDeposit.toFixed(2)}
                  verb={t`in deposits remains`}
                  isLoading={isRecipientInfoLoading}
                />
                <ArrowGraphic />
                <RedeemGraphic quantity={redeemableBalanceNumber.toFixed(2)} isLoading={isRecipientInfoLoading} />
              </div>
            </div>
            <TableContainer className="redeem-table">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Trans>Donated sOHM Generating Yield</Trans>
                    </TableCell>
                    <TableCell className={getTableCellClass(isRecipientInfoLoading)}>
                      {isRecipientInfoLoading ? <Skeleton /> : getTrimmedBigNumber(totalDeposit) + " " + t` sOHM`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Trans>Redeemable Amount</Trans>
                    </TableCell>
                    <TableCell className={getTableCellClass(isRecipientInfoLoading)}>
                      {" "}
                      {isRecipientInfoLoading ? (
                        <Skeleton />
                      ) : (
                        getTrimmedBigNumber(redeemableBalanceNumber) + " " + t` sOHM`
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Trans>Next Reward Amount</Trans>
                    </TableCell>
                    <TableCell className={getTableCellClass(isAppLoading)}>
                      {" "}
                      {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(nextRewardValue) + " " + t` sOHM`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Trans>Next Reward Yield</Trans>
                    </TableCell>
                    <TableCell className={getTableCellClass(isAppLoading)}>
                      {" "}
                      {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(stakingRebasePercentage) + "%"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Trans>ROI (5-Day Rate)</Trans>
                    </TableCell>
                    <TableCell className={getTableCellClass(isAppLoading)}>
                      {" "}
                      {isAppLoading ? <Skeleton /> : getTrimmedBigNumber(fiveDayRateValue) + "%"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left" className="cell-align-end">
                      {" "}
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="redeem-button"
                        onClick={() => handleRedeemButtonClick()}
                        disabled={!canRedeem()}
                      >
                        {txnButtonText(pendingTransactions, "redeeming", t`Redeem`)}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <RedeemYieldModal
              isModalOpen={isRedeemYieldModalOpen}
              callbackFunc={handleRedeemYieldModalSubmit}
              cancelFunc={handleRedeemYieldModalCancel}
              deposit={totalDeposit}
              redeemableBalance={redeemableBalanceNumber}
            />
          </Paper>
        </Zoom>
      </div>
    </Container>
  );
}
