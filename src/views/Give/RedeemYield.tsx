import { t, Trans } from "@lingui/macro";
import { Box, Button, Container, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { InfoTooltip } from "@olympusdao/component-library";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import { IAccountSlice, loadAccountDetails } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { ArrowGraphic, RedeemGraphic, VaultGraphic } from "../../components/EducationCard";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { DonationInfoState } from "./Interfaces";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function RedeemYield() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, networkId } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);

  const redeemableBalance = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.sohmRedeemable
      : state.account.redeeming && state.account.redeeming.sohmRedeemable;
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

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (connected) {
      loadAccountDetails({ networkID: networkId, provider, address });
    }
  }, [connected]);

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
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div id="give-view">
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
            {!isSmallScreen && <ArrowGraphic />}
            <RedeemGraphic quantity={redeemableBalanceNumber.toFixed(2)} isLoading={isRecipientInfoLoading} />
          </div>
        </div>
        <Box>
          <DataRow
            title={t`Donated sOHM Generating Yield`}
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
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              className="redeem-button"
              onClick={() => handleRedeemButtonClick()}
              disabled={!canRedeem()}
            >
              {txnButtonText(pendingTransactions, "redeeming", t`Redeem`)}
            </Button>
          </Box>
        </Box>
        <RedeemYieldModal
          isModalOpen={isRedeemYieldModalOpen}
          callbackFunc={handleRedeemYieldModalSubmit}
          cancelFunc={handleRedeemYieldModalCancel}
          deposit={totalDeposit}
          redeemableBalance={redeemableBalanceNumber}
        />
      </div>
    </Container>
  );
}
