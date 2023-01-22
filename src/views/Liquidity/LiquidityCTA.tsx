import { Box, Typography, useTheme } from "@mui/material";
import { TertiaryButton } from "@olympusdao/component-library";

export const LiquidityCTA = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" textAlign="center" mt="66px">
      <Box width="300px" display="flex" flexDirection="column" gap="9px">
        <Typography fontSize="12px" lineHeight="15px" fontWeight={500}>
          Increase OHM's use in DeFi by providing assets as liquidity paired with OHM
        </Typography>
        <Typography fontSize="12px" lineHeight="15px" color={theme.colors.gray[40]}>
          A strong Olympus treasury is the path forward to transforming OHM in the true DeFi reserve currency
        </Typography>
        <TertiaryButton fullWidth>Learn Why</TertiaryButton>
      </Box>
    </Box>
  );
};
