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
      maxWidth="468px"
      minHeight="350px"
      open={props.open}
      headerText="Settings"
      onClose={props.handleClose}
    >
      <>
        <Box>
          <InputLabel htmlFor="slippage">Slippage</InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth>
              <OutlinedInput
                inputProps={{ "data-testid": "slippage" }}
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
              Transaction may revert if price changes by more than slippage %
            </Typography>
          </Box>
        </Box>

        <Box mt="32px">
          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth>
              <OutlinedInput
                inputProps={{ "data-testid": "recipient" }}
                type="text"
                id="recipient"
                value={props.recipientAddress}
                onChange={props.onRecipientAddressChange}
              />
            </FormControl>
          </Box>
          <Box mt="8px">
            <Typography variant="body2" color="textSecondary">
              Choose recipient address. By default, this is your currently connected address
            </Typography>
          </Box>
        </Box>
      </>
    </Modal>
  );
};
