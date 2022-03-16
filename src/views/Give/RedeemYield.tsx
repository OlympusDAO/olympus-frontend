import { t, Trans } from "@lingui/macro";
import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { Project } from "../../components/GiveProject/project.type";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { DonationInfoState } from "./Interfaces";
import data from "./projects.json";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

// Consistent with staking page
const DECIMAL_PLACES = 4;

export default function RedeemYield() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connected, networkId } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);

  const redeemableBalance = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.sohmRedeemable
      : state.account.redeeming && state.account.redeeming.sohmRedeemable;
  });

  const recipientInfo = useSelector((state: DonationInfoState) => {
    return state.account.redeeming && state.account.redeeming.recipientInfo;
  });

  const stakingRebase = useSelector((state: DonationInfoState) => {
    return state.app.stakingRebase;
  });

  const fiveDayRate = useSelector((state: DonationInfoState) => {
    return state.app.fiveDayRate;
  });

  const pendingTransactions = useSelector((state: DonationInfoState) => {
    return state.pendingTransactions;
  });

  const redeemableBalanceNumber: BigNumber = new BigNumber(redeemableBalance);

  const totalDeposit = new BigNumber(recipientInfo && recipientInfo.totalDebt ? recipientInfo.totalDebt : 0);

  const stakingRebasePercentage = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(100);
  const nextRewardValue = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(totalDeposit);

  const fiveDayRateValue = new BigNumber(fiveDayRate ? fiveDayRate : 0).multipliedBy(100);

  const isProject = projectMap.get(address);

  const isRecipientInfoLoading = recipientInfo.totalDebt == "";

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (connected) {
      loadAccountDetails({ networkID: networkId, provider, address });
    }
  }, [connected]);

  /**
   * Get project sOHM yield goal and return as a BigNumber
   *
   * @param address
   * @returns
   */
  const getRecipientGoal = (address: string): BigNumber => {
    const project = projectMap.get(address);
    if (project) return new BigNumber(project.depositGoal);

    return new BigNumber(0);
  };

  /**
   * Checks that the current user can redeem some quantity of sOHM
   *
   * @returns
   */
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
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(redeemMockBalance({ address, provider, networkID: networkId, eventSource: "Redeem" }));
    } else {
      await dispatch(redeemBalance({ address, provider, networkID: networkId, eventSource: "Redeem" }));
    }
    setIsRedeemYieldModalOpen(false);
  };

  const handleRedeemYieldModalCancel: RedeemCancelCallback = () => {
    setIsRedeemYieldModalOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          {isRecipientInfoLoading ? <Skeleton /> : redeemableBalanceNumber.toFormat(DECIMAL_PLACES)} sOHM
        </Typography>
        <Typography variant="body1" align="center" className="subtext">
          Redeemable Yield
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs />
          <Grid item xs={12} sm={6}>
            <PrimaryButton onClick={() => handleRedeemButtonClick()} disabled={!canRedeem()} fullWidth>
              {txnButtonText(pendingTransactions, "redeeming", t`Redeem Yield`)}
            </PrimaryButton>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
      {isProject ? (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientGoal(address).toFormat(DECIMAL_PLACES)}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  <Trans>sOHM Goal</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {totalDeposit.toFormat(DECIMAL_PLACES)}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  {isSmallScreen ? t`Total Donated` : t`Total sOHM Donated`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {totalDeposit.multipliedBy(100).div(getRecipientGoal(address)).toFormat(DECIMAL_PLACES)}%
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  <Trans>of sOHM Goal</Trans>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <Box>
          <DataRow
            title={t`Deposited sOHM`}
            // Exact number
            balance={`${totalDeposit.toFormat()} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Redeemable Amount`}
            // Exact number
            balance={`${redeemableBalanceNumber.toFormat()} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Next Reward Amount`}
            // Exact number
            balance={`${nextRewardValue.toFormat(DECIMAL_PLACES)} ${t`sOHM`}`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`Next Reward Yield`}
            balance={`${stakingRebasePercentage.toFormat(DECIMAL_PLACES)}%`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`ROI (5-Day Rate)`}
            balance={`${fiveDayRateValue.toFormat(DECIMAL_PLACES)}%`}
            isLoading={isAppLoading}
          />
        </Box>
      </Grid>
      <Grid item>
        <RedeemYieldModal
          isModalOpen={isRedeemYieldModalOpen}
          callbackFunc={handleRedeemYieldModalSubmit}
          cancelFunc={handleRedeemYieldModalCancel}
          deposit={totalDeposit}
          redeemableBalance={redeemableBalanceNumber}
        />
      </Grid>
    </Grid>
  );
}
