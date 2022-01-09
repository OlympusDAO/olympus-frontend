import { Typography, Box, FormControl, OutlinedInput, InputLabel, InputAdornment } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import "./bondSettings.scss";
import { Modal } from "@olympusdao/component-library";

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  return (
    <Modal
      id="hades"
      open={open}
      headerText={"Hades"}
      minHeight={"400px"}
      closePosition={"left"}
      onClose={handleClose}
      hideBackdrop
      maxWidth={"500px"}
    >
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
    </Modal>
  );
}

export default AdvancedSettings;
