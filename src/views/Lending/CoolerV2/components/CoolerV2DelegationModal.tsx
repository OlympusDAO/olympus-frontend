import { Box, SvgIcon } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { DelegationManagement } from "src/views/Lending/CoolerV2/components/DelegationManagement";

interface CoolerV2DelegationModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CoolerV2DelegationModal = ({ open, setOpen }: CoolerV2DelegationModalProps) => {
  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={open}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Manage Delegations</Box>
        </Box>
      }
      onClose={() => setOpen(false)}
    >
      <DelegationManagement />
    </Modal>
  );
};
