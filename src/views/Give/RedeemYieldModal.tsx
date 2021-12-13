import { Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { FormControl } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { txnButtonText } from "../../slices/PendingTxnsSlice";
import { useSelector } from "react-redux";
import { VaultGraphic, ArrowGraphic, RedeemGraphic } from "../../components/EducationCard";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IPendingTxn, isPendingTxn } from "../../slices/PendingTxnsSlice";
import { BigNumber } from "bignumber.js";
import { t, Trans } from "@lingui/macro";

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

  return (
    <Modal className="modal-container" open={isModalOpen}>
      <Paper className="ohm-card ohm-modal">
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
        <div className="give-education-graphics">
          <VaultGraphic quantity={deposit.toFixed(2)} verb={t`in deposits remains`} />
          <ArrowGraphic />
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
