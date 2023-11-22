import { Box } from "@mui/material";
import PageTitle from "src/components/PageTitle";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { YourAmoDeposits } from "src/views/Liquidity/YourAMODeposits";

export const Vaults = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const activeVaults = vaults && vaults.filter(vault => Number(vault.lpTokenBalance) > 0);

  return (
    <Box width="97%" maxWidth="974px">
      {activeVaults && activeVaults.length > 0 && (
        <>
          <PageTitle
            name="Boosted Liquidity Vaults"
            subtitle="Claim rewards or withdraw from your Single Sided Vault deposits."
            noMargin
          />

          <YourAmoDeposits vaults={activeVaults} />
          <Box mb="33px" />
        </>
      )}
    </Box>
  );
};
