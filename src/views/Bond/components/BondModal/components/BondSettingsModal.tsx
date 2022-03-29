import { Trans } from "@lingui/macro";
import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from "@material-ui/core";
import { Modal } from "@olympusdao/component-library";
import { ChangeEvent } from "react";

export const BondSettingsModal: React.VFC<{
  open: boolean;
  slippage: number;
  handleClose: () => void;
  recipientAddress: string;
  onSlippageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRecipientAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = props => {
  return (
    <Modal
      id="hades"
      maxWidth="300"
      minHeight="350"
      open={props.open}
      headerText="Settings"
      onClose={props.handleClose}
    >
      <Box className="card-content">
        <InputLabel htmlFor="slippage">
          <Trans>Slippage</Trans>
        </InputLabel>

        <FormControl variant="outlined" color="primary" fullWidth>
          <OutlinedInput
            id="slippage"
            type="number"
            value={props.slippage}
            onChange={props.onSlippageChange}
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
            type="text"
            id="recipient"
            value={props.recipientAddress}
            onChange={props.onRecipientAddressChange}
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
};
