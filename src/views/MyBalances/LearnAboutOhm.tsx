import { Box, Typography, useTheme } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";

export const LearnAboutOhm = () => {
  const theme = useTheme();
  return (
    <>
      <Box my="18px">
        <Typography fontWeight="500">What is OHM?</Typography>
        <Typography color={theme.colors.gray[40]} mt="9px">
          OHM is the native token of the Olympus protocol. OHM is used in liquid markets. OHM is fully-backed by the
          Olympus treasury.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        <SecondaryButton
          fullWidth
          href="https://swap.defillama.com/?chain=ethereum&from=0x0000000000000000000000000000000000000000&to=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5"
        >
          Get OHM
        </SecondaryButton>
      </Box>
    </>
  );
};
