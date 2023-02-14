import { ArrowForward } from "@mui/icons-material";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Liquidity = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const vaultsWithDeposits = vaults && vaults.filter(vault => vault.lpTokenBalance !== "0");
  const theme = useTheme();

  console.log(vaults, "vaults");

  return (
    <div id="stake-view">
      <PageTitle name="Provide Liquidity" />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
          <Box borderRadius="12px" padding="32px" sx={{ backgroundColor: theme.colors.paper.card }} maxWidth="427px">
            <Typography fontSize="32px" fontWeight="500" lineHeight="36px" align="center">
              Incentivized Liquidity Pools
            </Typography>
            <Typography align="center" color={theme.colors.gray[40]}>
              Increase OHM's use in DeFi by pairing your OHM with other ERC-20 tokens and provide liquidity{" "}
            </Typography>
            <Box mt="18px">
              <Link component={RouterLink} to="/liquidity/pools">
                <PrimaryButton sx={{ width: "100%" }}>
                  <Box display="flex" gap="6px">
                    <Typography fontWeight="500">View Pools </Typography>
                    <ArrowForward sx={{ fontSize: "21px !important" }} />
                  </Box>
                </PrimaryButton>
              </Link>
            </Box>
          </Box>
          <Box borderRadius="12px" padding="32px" sx={{ backgroundColor: theme.colors.paper.card }} maxWidth="427px">
            <Typography fontSize="32px" fontWeight="500" lineHeight="36px" align="center">
              Single Sided Deposit Vaults
            </Typography>
            <Typography align="center" color={theme.colors.gray[40]}>
              Get double the rewards for the same liquidity as Olympus takes on the other side of your LP.{" "}
            </Typography>
            <Box mt="18px">
              <Link component={RouterLink} to="/liquidity/vaults">
                <PrimaryButton sx={{ width: "100%" }}>
                  <Box display="flex" gap="6px">
                    <Typography fontWeight="500">Take me to the Vaults </Typography>
                    <ArrowForward sx={{ fontSize: "21px !important" }} />
                  </Box>
                </PrimaryButton>
              </Link>
            </Box>
          </Box>
        </Box>
        <LiquidityCTA />
      </Box>
    </div>
  );
};
