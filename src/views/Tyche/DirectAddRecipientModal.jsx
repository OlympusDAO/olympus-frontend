import { Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
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

  const [walletAddress, setWalletAddress] = useState("");

  const handleSetPercentage = value => {
    // TODO finalise this
    console.log(value);
    setPercentage(value);
  };

  const handleSetWallet = value => {
    // TODO finalise this
    console.log(value);
    setWalletAddress(value);
  };

  // TODO add amount
  // TODO add wallet
  // TODO add validation

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
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="percentage-input"></InputLabel>
          <OutlinedInput
            id="percentage-input"
            type="number"
            placeholder="Enter a percentage"
            className="stake-input"
            value={percentage}
            onChange={e => handleSetPercentage(e.target.value)}
            labelWidth={0}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
          <Typography variant="body2">Staked position does not include redirected yield positions</Typography>
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
          <Button variant="contained" color="primary">
            Add Recipient
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
