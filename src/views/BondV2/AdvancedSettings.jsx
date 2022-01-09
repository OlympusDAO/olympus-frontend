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
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { t, Trans } from "@lingui/macro";
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
    <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
      <Paper className="ohm-card ohm-popover">
        <Box display="flex">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
          <Typography variant="h3">Hades</Typography>
        </Box>

        <Box className="card-content">
          <InputLabel htmlFor="slippage">
            <Trans>Slippage</Trans>
          </InputLabel>
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
                <Trans>Transaction may revert if price changes by more than slippage %</Trans>
              </Typography>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient">
            <Trans>Recipient Address</Trans>
          </InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                <Trans>Choose recipient address. By default, this is your currently connected address</Trans>
              </Typography>
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
