import { ArrowForward } from "@mui/icons-material";
import { Box, Link, Skeleton, Typography, useTheme } from "@mui/material";
import { Chip, Metric, PrimaryButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { useOhmPrice } from "src/hooks/usePrices";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Liquidity = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const vaultsWithDeposits = vaults && vaults.filter(vault => vault.lpTokenBalance !== "0");
  const theme = useTheme();
  const { data: ohmPrice } = useOhmPrice();

  console.log(vaults, "vaults");

  return (
    <div id="stake-view">
      <PageTitle name="Provide Liquidity" />
      <Box width="97%" maxWidth="974px">
        <Box>
          <Metric label="OHM Price" metric={ohmPrice ? formatCurrency(ohmPrice, 2) : <Skeleton />} />
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
          <Box position="relative">
            <Box position="absolute" display="flex" justifyContent="right" mt="-10px" right="33px">
              <Chip template="success" label={<Typography fontWeight="500">New</Typography>} />
            </Box>
            <Box borderRadius="12px" padding="32px" sx={{ backgroundColor: theme.colors.paper.card }} maxWidth="427px">
              <Typography fontSize="32px" fontWeight="500" lineHeight="36px" align="center">
                Boosted <br />
                Liquidity Vaults
              </Typography>
              <Typography align="center" color={theme.colors.gray[40]}>
                Get double the rewards for the same liquidity. Olympus takes on the other side of your LP.{" "}
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
        </Box>
        <LiquidityCTA />
      </Box>
    </div>
  );
};
