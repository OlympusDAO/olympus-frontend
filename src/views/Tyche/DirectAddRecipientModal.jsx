import { Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { FormControl, FormHelperText } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { useState } from "react";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

export function DirectAddRecipientModal({ isModalHidden, setIsModalHidden }) {
  const showHideClassName = "ohm-card ohm-modal";

  // Percentage as an integer
  // e.g. 5% = 5
  const [percentage, setPercentage] = useState(0);
  const [isPercentageValid, setIsPercentageValid] = useState(false);
  const [isPercentageValidError, setIsPercentageValidError] = useState("");

  const [walletAddress, setWalletAddress] = useState("");

  const handleSetPercentage = value => {
    checkIsPercentageValid(value);
    setPercentage(value);
  };

  const handleSetWallet = value => {
    // TODO finalise this
    console.log(value);
    setWalletAddress(value);
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

    setIsPercentageValid(true);
    setIsPercentageValidError("");
  };

  // TODO add validation
  // TODO stop modal from moving when validation messages are shown

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
        <Typography variant="h5">Recipient Address</Typography>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="wallet-input"></InputLabel>
          <OutlinedInput
            id="wallet-input"
            type="text"
            placeholder="Enter a wallet address in the form of 0x ..."
            className="stake-input"
            value={walletAddress}
            onChange={e => handleSetWallet(e.target.value)}
            labelWidth={0}
          />
        </FormControl>
        <FormControl className="ohm-modal-submit">
          <Button variant="contained" color="primary" disabled={!isPercentageValid}>
            Add Recipient
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
