import { Box, Typography, useTheme } from "@mui/material";
import { TertiaryButton } from "@olympusdao/component-library";

export const LiquidityCTA = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" textAlign="center" mt="66px">
      <Box width="300px" display="flex" flexDirection="column" gap="9px">
        <Typography fontSize="12px" lineHeight="15px" fontWeight={500}>
          Help proliferate OHM across DeFi by creating liquidity with your favorite asset and OHM.{" "}
        </Typography>
        <Typography fontSize="12px" lineHeight="15px" color={theme.colors.gray[40]}>
          Deep market liquidity combined with a strong Olympus treasury will help realize OHM as the de facto
          utilitarian DeFi currency.
        </Typography>
        <TertiaryButton fullWidth>Learn Why</TertiaryButton>
      </Box>
    </Box>
  );
};
