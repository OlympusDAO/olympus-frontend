import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { DataRow, Icon, Metric, Modal, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { FC } from "react";

export interface OHMBondConfirmModalProps {
  name?: string;
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== "template",
})<OHMBondConfirmModalProps>(({ theme }) => {
  return {
    root: {},
  };
});

/**
 * Component for Displaying BondConfirmModal
 */
const BondConfirmModal: FC<OHMBondConfirmModalProps> = () => {
  const theme = useTheme();
  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={false}
      topLeft={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={["DAI"]} sx={{ fontSize: "27px" }} />
          <Typography variant="h4" sx={{ marginLeft: "6px" }}>
            DAI
          </Typography>
        </Box>
      }
    >
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Bond" metric="10" />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>DAI</Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Receive" metric="10" />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>OHM</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt="21px" mb="21px" borderTop={`1px solid ${theme.colors.gray[500]}`}></Box>
        <DataRow title="ROI" balance="100%" />
        <DataRow title="Vesting Term" balance="1 min" />
        <PrimaryButton fullWidth>Confirm Bond</PrimaryButton>
      </>
    </Modal>
  );
};

export default BondConfirmModal;
