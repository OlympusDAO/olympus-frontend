import { Box, Typography, useTheme } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { useAccount } from "wagmi";

export const LearnAboutGohm = () => {
  const theme = useTheme();
  const { isConnected } = useAccount();
  return (
    <>
      <Box my="18px">
        <Typography fontWeight="500">What is gOHM?</Typography>
        <Typography color={theme.colors.gray[40]} mt="9px">
          gOHM is Olympus protocol's governance token, acquired by wrapping OHM for voting and collateral. It can be
          unwrapped to OHM.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <SecondaryButton fullWidth href="https://docs.olympusdao.finance/main/overview/tokens">
          Learn More
        </SecondaryButton>
      </Box>
    </>
  );
};
