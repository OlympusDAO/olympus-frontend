import { isAddress } from "@ethersproject/address";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Input, Modal, OHMModalProps, PrimaryButton } from "@olympusdao/component-library";
import { FC, useState } from "react";

type DelegateModalProps = {
  open: OHMModalProps["open"];
  handleClose: OHMModalProps["onClose"];
};

/*
TODO: Need to add address where votes are currently delegated and display in the input area.
TODO: Need to implement the hook when PrimaryButton is clicked. Should delegate votes.
If votes aren't delegated anywhere this input should either be empty or it should populate the current address
*/

/**
 * Component for Displaying DelegateModal
 */
const DelegateModal: FC<DelegateModalProps> = ({ open, handleClose }) => {
  const theme = useTheme();
  const [delegatedAddress, setDelegatedAddress] = useState("");
  const [isDelegatedAddressValid, setIsDelegatedAddressValid] = useState(true);

  const handleSetDelegatedAddress = (value: string) => {
    setDelegatedAddress(value);
    checkIsAddressValid(value);
  };

  const checkIsAddressValid = (value: string) => {
    if (!isAddress(value)) {
      setIsDelegatedAddressValid(false);
      return;
    }

    setIsDelegatedAddressValid(true);
  };

  return (
    <Modal
      topLeft={<></>}
      headerText="Delegate Vote"
      open={open}
      onClose={handleClose}
      maxWidth="465px"
      minHeight="278px"
    >
      <>
        <Typography color={theme.colors.gray[90]} textAlign="center" lineHeight="18px" mb="18px">
          Delegate all your voting power to this address.
          <br /> You can always re-delegate to yourself or someone else.
        </Typography>
        <Input
          placeholder="0x..."
          id="delegate"
          error={!isDelegatedAddressValid}
          onChange={(e: any) => handleSetDelegatedAddress(e.target.value)}
        />
        <Box mt="18px">
          <PrimaryButton disabled={!isDelegatedAddressValid} fullWidth>
            Delegate Votes
          </PrimaryButton>
        </Box>
      </>
    </Modal>
  );
};

export default DelegateModal;
