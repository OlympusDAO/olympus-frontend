import { Box } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import PageTitle from "src/components/PageTitle";

export const Liquidity = () => (
  <div id="stake-view">
    <PageTitle name="Liquidity" />
    <Paper>
      <PrimaryButton>Deposit</PrimaryButton>
      <PrimaryButton>Withdraw</PrimaryButton>
      <PrimaryButton>Claim</PrimaryButton>

      <Box>LP Token Amount</Box>
    </Paper>
  </div>
);
