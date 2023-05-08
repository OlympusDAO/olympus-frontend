import { Box, Typography, useTheme } from "@mui/material";
import { DataRow, Icon, Metric, Modal, OHMTokenStackProps, TokenStack } from "@olympusdao/component-library";
import { ReactElement } from "react";
import { formatNumber } from "src/helpers";

export const WithdrawModal = ({
  depositToken,
  rewards,
  withdrawAmount,
  pairAmount,
  isOpen,
  ohmRemoved,
  setIsOpen,
  confirmButton,
}: {
  depositToken: string;
  rewards: { tokenName: string; userRewards: string; apy: string }[];
  withdrawAmount: string;
  pairAmount: string;
  isOpen: boolean;
  ohmRemoved: string;
  confirmButton: ReactElement;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const theme = useTheme();
  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={[depositToken as keyof OHMTokenStackProps["tokens"]]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Withdraw</Typography>
        </Box>
      }
      onClose={() => setIsOpen(false)}
    >
      <>
        <Box display="flex" flexDirection="column">
          <Metric label="LP tokens to withdraw" metric={formatNumber(Number(withdrawAmount), 2)} />
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Typography>{depositToken}-OHM-LP</Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" my="9px">
          <Icon name="caret-down" />
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography>You Get</Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" gap="20px" flexWrap="wrap">
          <Box textAlign="center">
            <Typography fontSize="27px" lineHeight="33px" fontWeight="500">
              {formatNumber(Number(pairAmount), 4)}
            </Typography>
            <Typography>{depositToken}</Typography>
          </Box>
          {rewards.map((reward, index) => (
            <Box display="flex" key={index} gap="20px" alignItems="center">
              <Typography fontSize="27px" lineHeight="33px" fontWeight="500">
                +
              </Typography>
              <Box textAlign="center">
                <Typography fontSize="27px" lineHeight="33px" fontWeight="500">
                  {formatNumber(Number(reward.userRewards), 2)}
                </Typography>
                <Typography>{reward.tokenName}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box mt="21px" mb="21px" borderTop={`1px solid ${theme.colors.gray[500]}`}></Box>
        <DataRow title="OHM Removed" balance={ohmRemoved} />
        {confirmButton}
      </>
    </Modal>
  );
};
