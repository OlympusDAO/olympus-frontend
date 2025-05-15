import { Box, FormControl, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { utils as ethersUtils } from "ethers";
import { ChangeEvent, useState } from "react";

export const BridgeSettingsModal: React.FC<{
  open: boolean;
  handleClose: () => void;
  recipientAddress: string;
  setRecipientAddress: React.Dispatch<React.SetStateAction<string>>;
}> = props => {
  const [error, setError] = useState<string>("");

  const validateAddress = (address: string) => {
    if (!address) return "Address is required";
    try {
      // This will throw if the address is invalid
      ethersUtils.getAddress(address.toLowerCase());
      return "";
    } catch {
      return "Invalid Ethereum address";
    }
  };

  const handleRecipientChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.currentTarget.value;
    props.setRecipientAddress(newAddress);
    setError(validateAddress(newAddress));
  };

  // Only allow close if valid
  const handleAttemptClose = () => {
    const validationError = validateAddress(props.recipientAddress);
    if (!validationError) {
      setError("");
      props.handleClose();
    } else {
      setError(validationError);
    }
  };

  return (
    <Modal
      id="bridge-settings"
      maxWidth="468px"
      minHeight="350px"
      open={props.open}
      headerText="Settings"
      onClose={handleAttemptClose}
    >
      <>
        <Box mt="32px">
          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <Box mt="8px">
            <FormControl variant="outlined" color="primary" fullWidth error={!!error}>
              <OutlinedInput
                inputProps={{ "data-testid": "recipient" }}
                type="text"
                id="recipient"
                value={props.recipientAddress}
                onChange={handleRecipientChange}
              />
            </FormControl>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
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
