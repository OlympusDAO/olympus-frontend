import { Box, Link } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { FC, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DelegateModal from "src/views/Governance/components/DelegateModal";

/**
 * Component for Displaying ActionButtons
 */
const ActionButtons: FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    // <Box display="flex" minWidth="310px">
    <Box display="flex">
      <Link to="/governance/create-proposal" component={RouterLink}>
        <SecondaryButton>Create new Proposal</SecondaryButton>
      </Link>
      {/* <PrimaryButton onClick={() => setOpen(true)}>Get Voting Power</PrimaryButton> */}
      {/* <WalletConnectedGuard> */}
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Link to="/governance/get-vohm" component={RouterLink}>
          <PrimaryButton sx={{ minWidth: "120px" }}>Get More Voting Power</PrimaryButton>
        </Link>
      </Box>
      {/* </WalletConnectedGuard> */}
      <DelegateModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default ActionButtons;
