import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { DataRow, Icon, Metric, Modal, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { FC } from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { BondDuration } from "src/views/Bond/components/BondDuration";
//import { BondSettingsModal } from "src/views/Bond/components/BondModal/components/BondSettingsModal";
import { Bond } from "src/views/Bond/hooks/useBond";

export interface OHMBondConfirmModalProps {
  bond: Bond;
  slippage: string;
  recipientAddress: string;
  spendAmount: string;
  receiveAmount: string;
  onSubmit: () => void;
  handleSettingsOpen: () => void;
  isOpen: boolean;
  handleConfirmClose: () => void;
  disabled: boolean;
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
const BondConfirmModal: FC<OHMBondConfirmModalProps> = ({
  bond,
  spendAmount,
  receiveAmount,
  onSubmit,
  handleSettingsOpen,
  isOpen,
  handleConfirmClose,
  disabled,
}) => {
  const theme = useTheme();

  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={bond.quoteToken.icons} sx={{ fontSize: "27px" }} />
          <Typography variant="h4" sx={{ marginLeft: "6px" }}>
            {bond.quoteToken.name}
          </Typography>
        </Box>
      }
      onClose={handleConfirmClose}
      topLeft={<Icon name="settings" style={{ cursor: "pointer" }} onClick={handleSettingsOpen} />}
    >
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric
              label="Assets to Bond"
              metric={new DecimalBigNumber(spendAmount).toString({ decimals: 4, format: true, trim: true })}
            />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{bond.quoteToken.name}</Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Receive" metric={receiveAmount} />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{bond.baseToken.name}</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt="21px" mb="21px" borderTop={`1px solid ${theme.colors.gray[500]}`}></Box>
        <DataRow title="ROI" balance={<BondDiscount discount={bond.discount} textOnly />} />
        <DataRow title="Vesting Term" balance={<BondDuration duration={bond.duration} />} />
        <PrimaryButton fullWidth onClick={onSubmit} disabled={disabled} loading={disabled}>
          {disabled ? "Bonding..." : "Confirm Bond"}
        </PrimaryButton>
      </>
    </Modal>
  );
};

export default BondConfirmModal;
