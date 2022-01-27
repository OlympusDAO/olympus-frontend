import "./BondSettings.scss";

import { Trans } from "@lingui/macro";
import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from "@material-ui/core";
import { Modal } from "@olympusdao/component-library";
import { ChangeEvent } from "react";

interface IAdvancedSettingsProps {
  readonly open: boolean;
  readonly recipientAddress: string;
  readonly slippage: number;
  readonly handleClose: () => void;
  readonly onRecipientAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onSlippageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function AdvancedSettings(props: IAdvancedSettingsProps) {
  return (
    <Modal
      id="hades"
      open={props.open}
      onClose={props.handleClose}
      maxWidth="300"
      minHeight="350"
      headerText={"Settings"}
    >
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
          <div className="helper-text">
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
          <div className="helper-text">
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
