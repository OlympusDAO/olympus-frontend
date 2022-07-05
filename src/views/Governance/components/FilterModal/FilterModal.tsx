import { Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { CancelCallback } from "src/views/Give/Interfaces";

type FilterModalProps = {
  isModalOpen: boolean;
  cancelFunc: CancelCallback;
};

export const FilterModal = ({ isModalOpen, cancelFunc }: FilterModalProps) => {
  return (
    <Modal open={isModalOpen} onClose={cancelFunc} headerText="Filter by" closePosition="right" minHeight="450px">
      <Typography variant="h4">Filter Modal</Typography>
    </Modal>
  );
};
