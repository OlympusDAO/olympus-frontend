import { Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { FormControl } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { useSelector } from "react-redux";

export function WithdrawDepositModal({ isModalOpen, callbackFunc, cancelFunc, walletAddress, depositAmount }) {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  console.log(pendingTransactions);
  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    callbackFunc(walletAddress, depositAmount);
  };

  return (
    <Modal open={isModalOpen}>
      <Paper className="ohm-card ohm-modal">
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">Withdraw Deposit?</Typography>
        </div>
        <Typography variant="body1">
          At any time, you have the option to withdraw your deposit ({depositAmount} sOHM) from the vault. The yield
          will still be redeemable by the recipient ({walletAddress}), but your deposit will not generate any further
          yield.
        </Typography>
        <FormControl className="ohm-modal-submit">
          <Button
            variant="contained"
            color="primary"
            disable={isPendingTxn(pendingTransactions, "editingGive")}
            onClick={() => handleSubmit()}
          >
            {txnButtonText(pendingTransactions, "editingGive", "Withdraw Give Amount")}
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
