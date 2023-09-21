import { Box, Typography, useTheme } from "@mui/material";
import { TertiaryButton } from "@olympusdao/component-library";

export const LiquidityCTA = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" textAlign="center" mt="66px">
      <Box width="300px" display="flex" flexDirection="column" gap="9px">
        <Typography fontSize="15px" lineHeight="18px" fontWeight={500}>
          Borrow and Lend OHM{" "}
        </Typography>
        <Typography fontSize="15px" lineHeight="18px" color={theme.colors.gray[40]}>
          Leverage OHM's treasury backing and Range Bound Stability for flexibility and capital efficiency.
        </Typography>
        <TertiaryButton
          fullWidth
          href="https://docs.olympusdao.finance/main/overview/boosted-liq-vaults/#benefits-by-stakeholder"
        >
          Learn How
        </TertiaryButton>
      </Box>
    </Box>
  );
};
