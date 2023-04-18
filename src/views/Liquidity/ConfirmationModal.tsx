import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Link, Typography, useTheme } from "@mui/material";
import { Icon, Metric, Modal, OHMTokenStackProps, TokenStack } from "@olympusdao/component-library";
import { ReactElement } from "react";

export const ConfirmationModal = ({
  isOpen,
  depositTokenName,
  vaultDepositTokenName,
  confirmButton,
  depositAmount,
  receiveAmount,
  disclaimerChecked,
  setDisclaimerChecked,
  setIsOpen,
}: {
  isOpen: boolean;
  depositTokenName: string;
  vaultDepositTokenName: string;
  confirmButton: ReactElement;
  depositAmount: string;
  receiveAmount: string;
  disclaimerChecked: boolean;
  setDisclaimerChecked: (checked: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const theme = useTheme();
  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={[depositTokenName] as keyof OHMTokenStackProps["tokens"]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Deposit {depositTokenName}</Typography>
        </Box>
      }
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Deposit" metric={depositAmount} />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{depositTokenName}</Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Receive" metric={receiveAmount} />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{vaultDepositTokenName}-OHM LP</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt="21px" mb="21px" borderTop={`1px solid ${theme.colors.gray[500]}`}></Box>
        <div>
          <Box display="flex" alignItems="center">
            <FormControlLabel
              sx={{ marginRight: 0 }}
              control={
                <Checkbox
                  checked={disclaimerChecked}
                  onChange={event => setDisclaimerChecked(event.target.checked)}
                  icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                  checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
                  data-testid="disclaimer-checkbox"
                />
              }
              label=""
              data-testid="disclaimer"
            />
            <Typography fontWeight="500">I Understand</Typography>
          </Box>
          <Typography fontSize="12px" lineHeight="15px" mb="18px">
            By depositing {vaultDepositTokenName}, you are not guaranteed to get back the exact same amount of deposit
            tokens at time of withdraw. In addition, there is a 24 hour withdraw period from time of last deposit. Learn
            more{" "}
            <Link href="https://docs.olympusdao.finance/main/overview/boosted-liq-vaults#for-users-1" target="_blank">
              here
            </Link>
            .
          </Typography>
        </div>
        {confirmButton}
      </>
    </Modal>
  );
};
