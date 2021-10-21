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

  // Percentage as an integer
  // e.g. 5% = 5
  const [percentage, setPercentage] = useState(0);
  const [isPercentageValid, setIsPercentageValid] = useState(false);
  const [isPercentageValidError, setIsPercentageValidError] = useState("");
  const [amount, setAmount] = useState(0);

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

  const handleSetPercentage = value => {
    checkIsPercentageValid(value);
    setPercentage(value);
    setAmount((value * sohmBalance) / 100);
  };

  const checkIsPercentageValid = value => {
    if (!value || value == "" || value == 0) {
      setIsPercentageValid(false);
      setIsPercentageValidError("Please enter a value between 1-100");
      return;
    }

    if (value < 0) {
      setIsPercentageValid(false);
      setIsPercentageValidError("Value must be positive");
      return;
    }

    if (value > 100) {
      setIsPercentageValid(false);
      setIsPercentageValidError("Value cannot be more than 100%");
      return;
    }

    if (sohmBalance == 0) {
      setIsPercentageValid(false);
      setIsPercentageValidError("You must have a balance of sOHM (staked OHM) to continue");
    }

    setIsPercentageValid(true);
    setIsPercentageValidError("");
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
  // TODO shift to absolute amount of sOHM
  // TODO add warning that add recipient will ask for approval in the client

  return (
    <Modal open={!isModalHidden}>
      <Paper className={showHideClassName}>
        <div className="yield-header">
          <Link onClick={() => setIsModalHidden(true)}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">Add Yield Recipient</Typography>
        </div>
        <Typography variant="h5">% of Staked Position</Typography>
        <Typography variant="body2">Staked position does not include redirected yield positions</Typography>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="percentage-input"></InputLabel>
          <OutlinedInput
            id="percentage-input"
            type="number"
            placeholder="Enter a percentage"
            className="stake-input"
            value={percentage}
            error={!isPercentageValid}
            onChange={e => handleSetPercentage(e.target.value)}
            labelWidth={0}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
          <FormHelperText>{isPercentageValidError}</FormHelperText>
        </FormControl>
        {isPercentageValid ? (
          <>
            <Typography variant="body2">sOHM Amount: {amount}</Typography>{" "}
          </>
        ) : (
          <></>
        )}
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
            disabled={!isPercentageValid || !isWalletAddressValid || !address}
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
