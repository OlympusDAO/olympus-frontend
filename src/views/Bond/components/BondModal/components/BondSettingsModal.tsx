import { Trans } from "@lingui/macro";
import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { ChangeEvent } from "react";

export const BondSettingsModal: React.VFC<{
  open: boolean;
  slippage: string;
  handleClose: () => void;
  recipientAddress: string;
  onSlippageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRecipientAddressChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
      <>
        <Box>
          <InputLabel htmlFor="slippage">
            <Trans>Slippage</Trans>
          </InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth>
              <OutlinedInput
                type="text"
                id="slippage"
                value={props.slippage}
                onChange={props.onSlippageChange}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
              />
            </FormControl>
          </Box>
          <Box mt="8px">
            <Typography variant="body2" color="textSecondary">
              <Trans>Transaction may revert if price changes by more than slippage %</Trans>
            </Typography>
          </Box>
        </Box>

        <Box mt="32px">
          <InputLabel htmlFor="recipient">
            <Trans>Recipient Address</Trans>
          </InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth>
              <OutlinedInput
                type="text"
                id="recipient"
                value={props.recipientAddress}
                onChange={props.onRecipientAddressChange}
              />
            </FormControl>
          </Box>
          <Box mt="8px">
            <Typography variant="body2" color="textSecondary">
              <Trans>Choose recipient address. By default, this is your currently connected address</Trans>
            </Typography>
          </Box>
        </Box>
      </>
    </Modal>
  );
};
