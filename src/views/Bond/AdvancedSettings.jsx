<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import React from "react";
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
import { Typography, Box } from "@material-ui/core";
>>>>>>> removed unneeded rebase timer styles, replaced bond cancel with styled icon, began styling for bond settings. main things left are new icons and input fields
=======
import {
  Typography,
  Box,
  Modal,
  Paper,
  SvgIcon,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/v1.2/x.svg";
>>>>>>> refactored bond views
import "./bondSettings.scss";

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  return (
    <Modal id="hades" open={open} onClose={handleClose}>
      <Paper className="ohm-card ohm-popover">
        <Box display="flex">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
          <Typography variant="h3">Hades</Typography>
        </Box>

        <Box className="card-content">
          <InputLabel htmlFor="slippage">Slippage</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              id="slippage"
              value={slippage}
              onChange={onSlippageChange}
              type="number"
              max="100"
              min="100"
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                Transaction may revert if price changes by more than slippage %
              </Typography>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                Choose recipient address. By default, this is your currently connected address
              </Typography>
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
