import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PageTitle from "src/components/PageTitle";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { SingleSidedFarms } from "src/views/Liquidity/SingleSidedFarms";
import { YourAmoDeposits } from "src/views/Liquidity/YourAMODeposits";

export const Liquidity = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const vaultsWithDeposits = vaults && vaults.filter(vault => vault.lpTokenBalance !== "0");

  console.log(vaults, "vaults");

  return (
    <div id="stake-view">
      <PageTitle name="Provide Liquidity" />
      <Box width="97%" maxWidth="974px">
        {vaultsWithDeposits && vaultsWithDeposits.length > 0 && (
          <>
            <YourAmoDeposits vaults={vaultsWithDeposits} />
            <Box mb="33px" />
          </>
        )}
        <Box mb="18px" mt="9px">
          <Typography variant="h1">Single Sided Deposit Vaults</Typography>
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
        <ExternalStakePools />
        <LiquidityCTA />
      </Box>
    </div>
  );
};
