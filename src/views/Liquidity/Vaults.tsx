import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Skeleton, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { SingleSidedFarms } from "src/views/Liquidity/SingleSidedFarms";
import { YourAmoDeposits } from "src/views/Liquidity/YourAMODeposits";

export const Vaults = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const vaultsWithDeposits = vaults && vaults.filter(vault => vault.lpTokenBalance !== "0");

  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Link component={RouterLink} to="/liquidity">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                  Back
                </Typography>
              </Box>
            </Link>

            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Single Sided Deposit Vaults
              </Typography>
            </Box>
          </Box>
        }
      ></PageTitle>

      <Box width="97%" maxWidth="974px">
        <Box mb="18px" mt="9px">
          <Typography>
            Increase OHM's use in DeFi by providing ERC-20 tokens in supported pools and Olympus will match your deposit
            with minted OHM.
          </Typography>
        </Box>
        {isLoading ? (
          <Skeleton height="64px" />
        ) : (
          <>
            {vaults && vaults.length > 0 ? (
              <>
                <SingleSidedFarms vaults={vaults} />
                <Box mb="33px" />
              </>
            ) : (
              <Typography variant="h1">No Active Vaults</Typography>
            )}
          </>
        )}
        {vaultsWithDeposits && vaultsWithDeposits.length > 0 && (
          <>
            <YourAmoDeposits vaults={vaultsWithDeposits} />
            <Box mb="33px" />
          </>
        )}

        <LiquidityCTA />
      </Box>
    </div>
  );
};
