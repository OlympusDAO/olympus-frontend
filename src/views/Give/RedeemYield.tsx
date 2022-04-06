import { t } from "@lingui/macro";
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
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { GetCorrectContractUnits } from "src/helpers/GetCorrectUnits";
import { getTotalDonated } from "src/helpers/GetTotalDonated";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { Project } from "../../components/GiveProject/project.type";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { DonationInfoState } from "./Interfaces";
import data from "./projects.json";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

const ZERO_DBN = new DecimalBigNumber("0");

export default function RedeemYield() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connected, networkId } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const { data: currentIndex } = useCurrentIndex();

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);

  const redeemableBalance = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && new DecimalBigNumber(state.account.mockRedeeming.sohmRedeemable, 9)
      : state.account.redeeming &&
          GetCorrectContractUnits(state.account.redeeming.gohmRedeemable, "sOHM", currentIndex);
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

  const totalDeposit = new DecimalBigNumber(
    recipientInfo && recipientInfo.totalDebt ? recipientInfo.totalDebt : "0",
    9,
  );

  const stakingRebasePercentage = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(100);
  const nextRewardValue = totalDeposit
    .mul(new DecimalBigNumber(stakingRebase ? stakingRebase.toString() : "0", 2))
    .div(new DecimalBigNumber("100"));

  const fiveDayRateValue = new BigNumber(fiveDayRate ? fiveDayRate : 0).multipliedBy(100);

  const isProject = projectMap.get(address);

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

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (connected) {
      loadAccountDetails({ networkID: networkId, provider, address });
    }
  }, [connected]);

  // Get project sOHM yield goal and return as a number
  const getRecipientGoal = (address: string): DecimalBigNumber => {
    const project = projectMap.get(address);
    if (project) return new DecimalBigNumber(project.depositGoal.toString(), 9);

    return ZERO_DBN;
  };

  // Get the amount of sOHM yield donated by the current user and return as a number
  const getRecipientDonated = (address: string): DecimalBigNumber => {
    const project = projectMap.get(address);
    if (project) {
      getTotalDonated({
        networkID: networkId,
        provider: provider,
        address: address,
      })
        .then(donatedAmount => {
          const correctUnitDonated = GetCorrectContractUnits(donatedAmount, "sOHM", currentIndex);

          return correctUnitDonated;
        })
        .catch(e => console.log(e));
    }

    return ZERO_DBN;
  };

  // Checks that the current user can redeem some quantity of sOHM
  const canRedeem = () => {
    if (!address) return false;

    if (isRecipientInfoLoading) return false;

    if (isPendingTxn(pendingTransactions, "redeeming")) return false;

    if (redeemableBalance.eq(ZERO_DBN))
      // If the available amount is 0
      return false;

    return true;
  };

  const handleRedeemButtonClick = () => {
    setIsRedeemYieldModalOpen(true);
  };

  const handleRedeemYieldModalSubmit = async () => {
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        redeemMockBalance({ address, provider, networkID: networkId, token: "sOHM", eventSource: "Redeem" }),
      );
    } else {
      await dispatch(redeemBalance({ address, provider, networkID: networkId, token: "sOHM", eventSource: "Redeem" }));
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
          {isRecipientInfoLoading ? <Skeleton /> : redeemableBalance.toString({ decimals: 2 })} sOHM
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
                  {getRecipientGoal(address).toString({ decimals: 2 })}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  sOHM Goal
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientDonated(address).toString({ decimals: 2 })}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  {isSmallScreen ? "Total Donated" : `Total sOHM Donated`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientDonated(address).div(getRecipientGoal(address)).toString({ decimals: 2 })}%
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  of sOHM Goal
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
            balance={`${totalDeposit.toString({ decimals: 4 })} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Redeemable Amount`}
            balance={`${redeemableBalance.toString({ decimals: 4 })} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Next Reward Amount`}
            balance={`${nextRewardValue.toString({ decimals: 4 })} ${t`sOHM`}`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`Next Reward Yield`}
            balance={`${getTrimmedBigNumber(stakingRebasePercentage)}%`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`ROI (5-Day Rate)`}
            balance={`${getTrimmedBigNumber(fiveDayRateValue)}%`}
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
          redeemableBalance={redeemableBalance}
        />
      </Grid>
    </Grid>
  );
}
