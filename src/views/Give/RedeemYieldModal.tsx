import { t, Trans } from "@lingui/macro";
import { Button, Link, Modal, Paper, SvgIcon, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import { IAccountSlice } from "src/slices/AccountSlice";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ArrowGraphic, RedeemGraphic, VaultGraphic } from "../../components/EducationCard";
import { txnButtonText } from "../../slices/PendingTxnsSlice";
import { IPendingTxn, isPendingTxn } from "../../slices/PendingTxnsSlice";

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

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
};

export function RedeemYieldModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  deposit,
  redeemableBalance,
}: RedeemModalProps) {
  const { address } = useWeb3Context();
  const pendingTransactions = useSelector((state: State) => {
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

  const handleModalInsideClick = (e: any): void => {
    // When the user clicks within the modal window, we do not want to pass the event up the tree
    e.stopPropagation();
  };

  return (
    /* modal-container displays a background behind the ohm-card container, which means that if modal-container receives a click, we can close the modal */
    <Modal className="modal-container" open={isModalOpen} onClose={cancelFunc} onClick={cancelFunc} hideBackdrop={true}>
      <Paper className={`ohm-card ohm-modal ${isSmallScreen && "smaller"}`} onClick={handleModalInsideClick}>
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">
            <strong>
              <Trans>Redeem Yield?</Trans>
            </strong>
          </Typography>
        </div>
        <div className={`give-education-graphics ${isSmallScreen && "smaller"}`}>
          <VaultGraphic quantity={deposit.toFixed(2)} verb={t`in deposits remains`} />
          {!isSmallScreen && <ArrowGraphic />}
          <RedeemGraphic quantity={redeemableBalance.toFixed(2)} />
        </div>
        <Typography variant="body1" align="center">
          <Trans>Any sOHM directed towards you will continue to rebase and earn additional yield on your behalf.</Trans>
        </Typography>
        <FormControl className="ohm-modal-submit">
          <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={() => handleSubmit()}>
            {txnButtonText(pendingTransactions, "redeeming", t`Redeem`)}
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
