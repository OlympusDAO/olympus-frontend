import { Box, Divider, Grid } from "@mui/material";
import { Metric, MetricCollection } from "@olympusdao/component-library";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";
import { StakeBalances } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { StakeFiveDayYield } from "src/views/Stake/components/StakeArea/components/StakeFiveDayYield";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { StakeNextRebaseAmount } from "src/views/Stake/components/StakeArea/components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "src/views/Stake/components/StakeArea/components/StakeRebaseYield";
import { CurrentIndex, StakingAPY } from "src/views/TreasuryDashboard/components/Metric/Metric";
import { useAccount } from "wagmi";

export const StakeArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      <PageTitle name="Stake" />
      <Box>
        <Box mb="28px">
          <Grid>
            <MetricCollection>
              <StakingAPY className="stake-apy" />
              <Metric label="Time to Next Rebase" metric={<RebaseTimer />} />
              <CurrentIndex className="stake-index" />
            </MetricCollection>
          </Grid>
        </Box>

        <StakeInputArea isZoomed={isZoomed} />
        {isConnected && (
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
              <StakeBalances />

              <Divider />

              <StakeNextRebaseAmount />

              <StakeRebaseYield />

              <StakeFiveDayYield />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
