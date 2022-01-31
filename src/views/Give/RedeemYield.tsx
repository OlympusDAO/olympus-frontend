import { t } from "@lingui/macro";
import { Box, Button, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { getTotalDonated } from "src/helpers/GetTotalDonated";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { Project } from "../../components/GiveProject/project.type";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { DonationInfoState } from "./Interfaces";
import data from "./projects.json";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

export default function RedeemYield() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connected, networkId } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);

  const redeemableBalance = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
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

  const getRecipientGoal = (address: string): number => {
    const project = projectMap.get(address);
    if (project) return parseFloat(project.depositGoal.toFixed(2));

    return 0;
  };

  const getRecipientDonated = (address: string): number => {
    const project = projectMap.get(address);
    if (project) {
      getTotalDonated({
        networkID: networkId,
        provider: provider,
        address: address,
      })
        .then(donatedAmount => {
          return parseFloat(donatedAmount).toFixed(2);
        })
        .catch(e => console.log(e));
    }

    return 0;
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
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
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
    <div id="give-view">
      <div className="redeemable-container">
        <div className="redeemable-balance">
          <Typography variant="h3">
            {isRecipientInfoLoading ? <Skeleton /> : redeemableBalanceNumber.toFixed(2)} sOHM
          </Typography>
          <Typography variant="body1" className="subtext">
            Redeemable Yield
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          className="redeem-button"
          onClick={() => handleRedeemButtonClick()}
          disabled={!canRedeem()}
        >
          {txnButtonText(pendingTransactions, "redeeming", t`Redeem Yield`)}
        </Button>
      </div>
      {isProject ? (
        <div className="projects-redeemable-data">
          <Box className="projects-redeemable-box">
            <Typography variant="h5">{getRecipientGoal(address)}</Typography>
            <Typography variant="body1" className="subtext">
              sOHM Goal
            </Typography>
          </Box>
          <Box className="projects-redeemable-box">
            <Typography variant="h5">{getRecipientDonated(address)}</Typography>
            <Typography variant="body1" className="subtext">
              Total sOHM Donated
            </Typography>
          </Box>
          <Box className="projects-redeemable-box">
            <Typography variant="h5">{getRecipientDonated(address) / getRecipientGoal(address)}%</Typography>
            <Typography variant="body1" className="subtext">
              of sOHM Goal
            </Typography>
          </Box>
        </div>
      ) : (
        <></>
      )}
      <Box className="main-redeemable-box">
        <DataRow
          title={t`Deposited sOHM`}
          balance={`${getTrimmedBigNumber(totalDeposit)} ${t`sOHM`}`}
          isLoading={isRecipientInfoLoading}
        />
        <DataRow
          title={t`Redeemable Amount`}
          balance={`${getTrimmedBigNumber(redeemableBalanceNumber)} ${t`sOHM`}`}
          isLoading={isRecipientInfoLoading}
        />
        <DataRow
          title={t`Next Reward Amount`}
          balance={`${getTrimmedBigNumber(nextRewardValue)} ${t`sOHM`}`}
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
      <RedeemYieldModal
        isModalOpen={isRedeemYieldModalOpen}
        callbackFunc={handleRedeemYieldModalSubmit}
        cancelFunc={handleRedeemYieldModalCancel}
        deposit={totalDeposit}
        redeemableBalance={redeemableBalanceNumber}
      />
    </div>
  );
}
