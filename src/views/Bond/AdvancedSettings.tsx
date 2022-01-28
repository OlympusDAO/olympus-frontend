import "../BondV2/BondSettings.scss";

import { Trans } from "@lingui/macro";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { ChangeEvent } from "react";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

interface IAdvancedSettingsProps {
  readonly open: boolean;
  readonly recipientAddress: string;
  readonly slippage: string;
  readonly handleClose: () => void;
  readonly onRecipientAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onSlippageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function AdvancedSettings(props: IAdvancedSettingsProps) {
  return (
    <Modal id="hades" open={props.open} onClose={props.handleClose} hideBackdrop>
      <Paper className="ohm-card ohm-popover">
        <Box display="flex">
          <IconButton onClick={props.handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
          <Typography variant="h3">Settings</Typography>
        </Box>
        <Box className="card-content">
          <InputLabel htmlFor="slippage">
            <Trans>Slippage</Trans>
          </InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              id="slippage"
              value={props.slippage}
              onChange={props.onSlippageChange}
              type="number"
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
            <OutlinedInput
              id="recipient"
              value={props.recipientAddress}
              onChange={props.onRecipientAddressChange}
              type="text"
            />
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
