import { t, Trans } from "@lingui/macro";
import { Box, Button, Link, Modal, Paper, SvgIcon, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks/web3Context";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
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

export function RedeemYieldModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  deposit,
  redeemableBalance,
}: RedeemModalProps) {
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

  const handleModalInsideClick = (e: React.MouseEvent): void => {
    // When the user clicks within the modal window, we do not want to pass the event up the tree
    e.stopPropagation();
  };

  return (
    /* modal-container displays a background behind the ohm-card container, which means that if modal-container receives a click, we can close the modal */
    <Modal className="modal-container" open={isModalOpen} onClose={cancelFunc} onClick={cancelFunc} hideBackdrop={true}>
      <Paper
        className={`ohm-card ohm-modal ${isSmallScreen ? "smaller" : ""}`}
        onClick={handleModalInsideClick}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">
            <strong>
              <Trans>Redeem Yield</Trans>
            </strong>
          </Typography>
        </div>
        <Box className="redeemable-details">
          <div className="redeem-info">
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
          <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={() => handleSubmit()}>
            {txnButtonText(pendingTransactions, "redeeming", t`Confirm ${redeemableBalance.toFixed(2)} sOHM`)}
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
