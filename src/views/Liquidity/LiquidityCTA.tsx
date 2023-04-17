import { Box, Typography, useTheme } from "@mui/material";
import { TertiaryButton } from "@olympusdao/component-library";

export const LiquidityCTA = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" textAlign="center" mt="66px">
      <Box width="300px" display="flex" flexDirection="column" gap="9px">
        <Typography fontSize="15px" lineHeight="18px" fontWeight={500}>
          Help proliferate OHM across DeFi by creating liquidity with your favorite asset and OHM.{" "}
        </Typography>
        <Typography fontSize="15px" lineHeight="18px" color={theme.colors.gray[40]}>
          Deep market liquidity combined with a strong Olympus treasury will help realize OHM as the de facto
          utilitarian DeFi currency.
        </Typography>
        <TertiaryButton
          fullWidth
          href="https://docs.olympusdao.finance/main/overview/boosted-liq-vaults/#benefits-by-stakeholder"
        >
          Learn Why
        </TertiaryButton>
      </Box>
    </Box>
  );
};
