import { Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { FormControl, FormHelperText } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { isAddress } from "@ethersproject/address";
import { useWeb3Context } from "src/hooks/web3Context";

export function DirectAddRecipientModal({ isModalHidden, setIsModalHidden }) {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const showHideClassName = "ohm-card ohm-modal";

  const [depositAmount, setDepositAmount] = useState(0.0);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(false);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState("");

  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState("");

  /**
   * Returns the user's sOHM balance
   *
   * Copied from Stake.jsx
   *
   * TODO consider extracting this into a helper file
   */
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const handleSetDepositAmount = value => {
    checkIsDepositAmountValid(value);
    setDepositAmount(value);
  };

  const checkIsDepositAmountValid = value => {
    const valueFloat = parseFloat(value);
    const sohmBalanceFloat = parseFloat(sohmBalance);

    if (!value || value == "" || valueFloat == 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Please enter a value");
      return;
    }

    if (valueFloat < 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value must be positive");
      return;
    }

    if (sohmBalanceFloat == 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("You must have a balance of sOHM (staked OHM) to continue");
    }

    if (valueFloat > sohmBalanceFloat) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value cannot be more than your sOHM balance of " + sohmBalance);
      return;
    }

    setIsDepositAmountValid(true);
    setIsDepositAmountValidError("");
  };

  const handleSetWallet = value => {
    checkIsWalletAddressValid(value);
    setWalletAddress(value);
  };

  const checkIsWalletAddressValid = value => {
    if (!isAddress(value)) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError("Please enter a valid Ethereum address");
      return;
    }

    if (value == address) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError("Please enter a different address: cannot direct to the same wallet");
      return;
    }

    setIsWalletAddressValid(true);
    setIsWalletAddressValidError("");
  };

  // TODO stop modal from moving when validation messages are shown
  // TODO handle button press
  // TODO add segment user event

  return (
    <Modal open={!isModalHidden}>
      <Paper className={showHideClassName}>
        <div className="yield-header">
          <Link onClick={() => setIsModalHidden(true)}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">Add Recipient</Typography>
        </div>
        <Typography variant="body1">
          The rebase rewards from the sOHM that you deposit will be redirected to the wallet address that you specify.
        </Typography>
        <Typography variant="body1">
          Please note that your sOHM will be transferred into the vault when you click "Add Recipient". You will need to
          approve the transaction and pay for gas fees.
        </Typography>
        <Typography variant="h5">Amount of sOHM</Typography>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="amount-input"></InputLabel>
          <OutlinedInput
            id="amount-input"
            type="number"
            placeholder="Enter an amount"
            className="stake-input"
            value={depositAmount}
            error={!isDepositAmountValid}
            onChange={e => handleSetDepositAmount(e.target.value)}
            labelWidth={0}
          />
          <FormHelperText>{isDepositAmountValidError}</FormHelperText>
        </FormControl>
        <Typography variant="h5">Recipient Address</Typography>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="wallet-input"></InputLabel>
          <OutlinedInput
            id="wallet-input"
            type="text"
            placeholder="Enter a wallet address in the form of 0x ..."
            className="stake-input"
            value={walletAddress}
            error={!isWalletAddressValid}
            onChange={e => handleSetWallet(e.target.value)}
            labelWidth={0}
          />
          <FormHelperText>{isWalletAddressValidError}</FormHelperText>
        </FormControl>
        <FormControl className="ohm-modal-submit">
          <Button
            variant="contained"
            color="primary"
            disabled={!isDepositAmountValid || !isWalletAddressValid || !address}
          >
            Add Recipient
          </Button>
        </FormControl>
        {!address ? (
          <>
            <FormHelperText>
              You must be logged into your wallet to use this feature. Click on the "Connect Wallet" button and try
              again.
            </FormHelperText>
          </>
        ) : (
          <></>
        )}
      </Paper>
    </Modal>
  );
}
