import { Modal, Paper, Typography, SvgIcon, Link } from "@material-ui/core";
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

  const handleSetPercentage = value => {
    console.log(value);
    setPercentage(value);
  };

  // TODO styling
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
          <Typography variant="h5">Add Yield Recipient</Typography>
        </div>
        % of Staked Position
        <FormControl className="ohm-input" variant="outlined" color="primary">
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
        </FormControl>
        Staked position does not include redirected yield positions Recipient Address
      </Paper>
    </Modal>
  );
}
