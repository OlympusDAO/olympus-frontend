import { Box } from "@mui/system";
import PageTitle from "src/components/PageTitle";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { SingleSidedFarms } from "src/views/Liquidity/SingleSidedFarms";
import { YourAmoDeposits } from "src/views/Liquidity/YourAMODeposits";

export const Liquidity = () => (
  <div id="stake-view">
    <PageTitle name="Liquidity" />
    <Box width="97%" maxWidth="974px">
      <YourAmoDeposits />
      <Box mb="33px" />
      <SingleSidedFarms />
      <Box mb="33px" />
      <ExternalStakePools />
      <LiquidityCTA />
    </Box>
  </div>
);
