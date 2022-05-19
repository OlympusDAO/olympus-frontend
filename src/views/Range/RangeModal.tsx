import { Box, Typography } from "@mui/material";
import { Modal, TokenStack } from "@olympusdao/component-library";
import { FC } from "react";

/**
 * Component for Displaying RangeModal
 */
const RangeModal: FC = () => {
  return (
    <Modal
      topLeft={<></>}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={["DAI", "OHM"]} />
          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">Swap DAI for OHM</Typography>
          </Box>
        </Box>
      }
      open
      onClose={() => console.log("close")}
    >
      <p>Confirmation Modal</p>
    </Modal>
  );
};

export default RangeModal;
