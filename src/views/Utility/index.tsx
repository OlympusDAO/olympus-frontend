import { Box } from "@mui/material";
import PageTitle from "src/components/PageTitle";
import { LendingMarkets } from "src/views/Lending/LendingMarkets";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { Vaults } from "src/views/Liquidity/Vaults";

export const Utility = () => {
  return (
    <div id="stake-view">
      <PageTitle name="Utility" subtitle="Olympus serves DeFi, explore your opportunities with OHM and gOHM" />
      <Box width="97%" maxWidth="974px">
        <Vaults />
        <div>
          <ExternalStakePools />
        </div>
        <div>
          <LendingMarkets />
        </div>
      </Box>
    </div>
  );
};
