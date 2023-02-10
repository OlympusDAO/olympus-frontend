import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { useChainModal } from "@rainbow-me/rainbowkit";

export const SwitchToMainnet = () => {
  const { openChainModal } = useChainModal();

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h2">Please switch to Mainnet to Stake</Typography>
      <PrimaryButton fullWidth onClick={openChainModal} sx={{ minWidth: "163px", maxWidth: "350px" }}>
        Switch
      </PrimaryButton>
    </Box>
  );
};
