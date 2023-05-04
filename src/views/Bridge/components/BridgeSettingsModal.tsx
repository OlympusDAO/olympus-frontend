import { Box, FormControl, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { ChangeEvent } from "react";

export const BridgeSettingsModal: React.FC<{
  open: boolean;
  handleClose: () => void;
  recipientAddress: string;
  setRecipientAddress: React.Dispatch<React.SetStateAction<string>>;
}> = props => {
  const handleRecipientChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.currentTarget.value;
    props.setRecipientAddress(newAddress);
  };
  return (
    <Modal
      id="bridge-settings"
      maxWidth="468px"
      minHeight="350px"
      open={props.open}
      headerText="Settings"
      onClose={props.handleClose}
    >
      <>
        <Box mt="32px">
          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth>
              <OutlinedInput
                inputProps={{ "data-testid": "recipient" }}
                type="text"
                id="recipient"
                value={props.recipientAddress}
                onChange={handleRecipientChange}
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
