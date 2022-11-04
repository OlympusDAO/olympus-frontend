import { Box, Link } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
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
      {/* <PrimaryButton onClick={() => setOpen(true)}>Delegate Vote</PrimaryButton> */}

      <DelegateModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default ActionButtons;
