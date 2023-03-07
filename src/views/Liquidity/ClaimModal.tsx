import { Box, Typography } from "@mui/material";
import { Modal, OHMTokenStackProps, TokenStack } from "@olympusdao/component-library";
import { ReactElement } from "react";
import { formatNumber } from "src/helpers";

export const ClaimModal = ({
  depositToken,
  rewards,
  isOpen,
  setIsOpen,
  confirmButton,
}: {
  depositToken: string;
  rewards: { tokenName: string; userRewards: string; apy: string }[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  confirmButton: ReactElement;
}) => {
  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={[depositToken as keyof OHMTokenStackProps["tokens"]]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Claim Rewards</Typography>
        </Box>
      }
      onClose={() => setIsOpen(false)}
    >
      <>
        <Box display="flex" alignItems="center" justifyContent="center" gap="25px">
          {rewards.map((reward, index) => (
            <Box display="flex" key={index} gap="25px">
              {index > 0 && (
                <Typography fontSize="27px" lineHeight="33px" fontWeight="500">
                  +
                </Typography>
              )}
              <Box textAlign="center">
                <Typography fontSize="27px" lineHeight="33px" fontWeight="500">
                  {formatNumber(Number(reward.userRewards), 2)}
                </Typography>
                <Typography>{reward.tokenName}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box mt="21px">{confirmButton}</Box>
      </>
    </Modal>
  );
};
