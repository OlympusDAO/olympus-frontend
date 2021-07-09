<<<<<<< HEAD
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
=======
import "./bondSettings.scss";

function AdvancedSettings({ slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }) {
  return (
    <div className="card ohm-popover-card">
      <div className="card-body">
        <h2 className="card-title mb-4">Hades</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="slippage" className="form-label">
              Slippage
            </label>

            <div className="input-group ohm-input-group flex-nowrap d-flex">
              <input
                value={slippage}
                onChange={onSlippageChange}
                type="number"
                max="100"
                min="100"
                className="form-control ohm-form-control"
                id="slippage"
              />
              <span className="input-group-text" id="basic-addon2">
                %
              </span>
            </div>
            <div id="emailHelp" className="form-text">
              Transaction may revert if price changes by more than slippage %
>>>>>>> Linting fixes
            </div>
          </FormControl>

<<<<<<< HEAD
          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                Choose recipient address. By default, this is your currently connected address
              </Typography>
=======
          <div className="mb-3">
            <label htmlFor="slippage" className="form-label">
              Recipient Address
            </label>

            <div className="ohm-input-group">
              <input
                value={recipientAddress}
                onChange={onRecipientAddressChange}
                type="text"
                className="form-control ohm-form-control"
              />
            </div>
            <div className="form-text">
              Choose recipient address. By default, this is your currently connected address
>>>>>>> Linting fixes
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
