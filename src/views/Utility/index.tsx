import PageTitle from "src/components/PageTitle";
import { LendingMarkets } from "src/views/Lending/LendingMarkets";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { Vaults } from "src/views/Liquidity/Vaults";

export const Utility = () => {
  return (
    <div id="stake-view">
      <PageTitle name="Utility" subtitle="Olympus serves DeFi, explore your opportunities with OHM and gOHM" />
      <Vaults />
      <div>
        <ExternalStakePools />
      </div>
      <div>
        <LendingMarkets />
      </div>
    </div>
  );
};
