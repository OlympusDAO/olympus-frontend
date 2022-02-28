import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks/web3Context";

import { ArrowGraphic } from "../../components/EducationCard";
import { txnButtonText } from "../../slices/PendingTxnsSlice";
import { isPendingTxn } from "../../slices/PendingTxnsSlice";
import { DonationInfoState } from "./Interfaces";

export interface RedeemSubmitCallback {
  (): void;
}

export interface RedeemCancelCallback {
  (): void;
}

type RedeemModalProps = {
  isModalOpen: boolean;
  callbackFunc: RedeemSubmitCallback;
  cancelFunc: RedeemCancelCallback;
  deposit: BigNumber;
  redeemableBalance: BigNumber;
};

export function RedeemYieldModal({ isModalOpen, callbackFunc, cancelFunc, redeemableBalance }: RedeemModalProps) {
  const { address } = useWeb3Context();
  const pendingTransactions = useSelector((state: DonationInfoState) => {
    return state.pendingTransactions;
  });
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const canSubmit = () => {
    if (!address) return false;
    if (isPendingTxn(pendingTransactions, "redeeming")) return false;

    return true;
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    callbackFunc();
  };

  const smallClass = isSmallScreen ? "smaller" : "";

  return (
    <Modal
      className="modal-container redeem-container"
      open={isModalOpen}
      closePosition="right"
      onClose={cancelFunc}
      hideBackdrop={true}
    >
      <div className={`redeem-modal ${smallClass}`}>
        <div className="yield-header">
          <Typography variant="h4">
            <strong>
              <Trans>Redeem Yield</Trans>
            </strong>
          </Typography>
        </div>
        <Box className="redeemable-details">
          <div className={`redeem-info ${smallClass}`}>
            <div className="redeemable-yield-text">
              <Typography variant="body1" className="subtext">
                Redeemable Yield
              </Typography>
              <Typography variant="h6">{redeemableBalance.toFixed(2)} sOHM</Typography>
            </div>
            {!isSmallScreen && <ArrowGraphic />}
            <div className="wallet-text">
              <Typography variant="body1" className="subtext">
                My Wallet Address
              </Typography>
              <Typography variant="h6">{shorten(address)}</Typography>
            </div>
          </div>
        </Box>
        <FormControl className="ohm-modal-submit">
          <PrimaryButton disabled={!canSubmit()} onClick={() => handleSubmit()}>
            {txnButtonText(pendingTransactions, "redeeming", t`Confirm ${redeemableBalance.toFixed(2)} sOHM`)}
          </PrimaryButton>
        </FormControl>
      </div>
    </Modal>
  );
}
