import { t } from "@lingui/macro";
import { Box, Divider, Grid } from "@mui/material";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";
import { StakeBalances } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { StakeFiveDayRate } from "src/views/Stake/components/StakeArea/components/StakeFiveDayRate";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { StakeNextRebaseAmount } from "src/views/Stake/components/StakeArea/components/StakeNextRebaseAmount";
import { StakeRebaseRate } from "src/views/Stake/components/StakeArea/components/StakeRebaseRate";
import { CurrentIndex, StakingAPY, TotalValueDeposited } from "src/views/TreasuryDashboard/components/Metric/Metric";

export const StakeArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Paper headerText={t`Single Stake (3, 3)`} subHeader={<RebaseTimer />} childPaperBackground={true}>
      <Box mb="28px">
        <Grid>
          <MetricCollection>
            <StakingAPY className="stake-apy" />
            <TotalValueDeposited className="stake-tvl" />
            <CurrentIndex className="stake-index" />
          </MetricCollection>
        </Grid>
      </Box>

      <WalletConnectedGuard message="Connect your wallet to stake OHM">
        <StakeInputArea isZoomed={isZoomed} />

        <StakeBalances />

        <Divider />

        <StakeNextRebaseAmount />

        <StakeRebaseRate />

        <StakeFiveDayRate />
      </WalletConnectedGuard>
    </Paper>
  );
};
